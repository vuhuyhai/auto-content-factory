'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { workflowFormSchema } from '@/lib/workflows/schemas';
import type { WorkflowFormSchema } from '@/lib/workflows/schemas';

export interface CreateWorkflowResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Server Action tạo workflow mới.
 * - Auth check qua Supabase
 * - Validate với zod
 * - Fetch brand_id của user (RLS-aware)
 * - Insert workflow với config = { name, news_sources }
 * - Revalidate /dashboard/workflows
 * - Redirect về list
 */
export async function createWorkflow(
  input: WorkflowFormSchema
): Promise<CreateWorkflowResult> {
  // 1. Validate
  const parsed = workflowFormSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join('.');
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      ok: false,
      message: 'Dữ liệu chưa hợp lệ. Vui lòng kiểm tra lại.',
      fieldErrors,
    };
  }

  const data = parsed.data;

  // 2. Auth check
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      message: 'Bạn cần đăng nhập để tạo workflow.',
    };
  }

  // 3. Fetch brand_id của user (RLS enforce)
  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (brandError) {
    console.error('[createWorkflow] brand fetch error:', brandError.message);
    return {
      ok: false,
      message: 'Không thể lấy thông tin brand. Vui lòng thử lại.',
    };
  }

  if (!brand) {
    return {
      ok: false,
      message: 'Bạn cần hoàn tất thiết lập Brand Voice trước khi tạo workflow.',
    };
  }

  // 4. Insert workflow
  const config = {
    name: data.name,
    ...(data.type === 'news_based' && data.newsSources && data.newsSources.length > 0
      ? { news_sources: data.newsSources }
      : {}),
  };

  const { error: insertError } = await supabase.from('workflows').insert({
    brand_id: brand.id,
    type: data.type,
    schedule_cron: data.scheduleCron,
    enabled: data.enabled,
    config,
  });

  if (insertError) {
    console.error('[createWorkflow] insert error:', insertError.message);
    return {
      ok: false,
      message: 'Không thể tạo workflow. Vui lòng thử lại.',
    };
  }

  // 5. Revalidate + redirect
  revalidatePath('/dashboard/workflows');
  redirect('/dashboard/workflows');
}

/**
 * Toggle enabled/disabled cho workflow.
 * RLS sẽ check brand_id thuộc về user (qua brands.user_id).
 */
export async function toggleWorkflowEnabled(
  id: string,
  enabled: boolean
): Promise<{ ok: boolean; message?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, message: 'Bạn cần đăng nhập.' };
  }

  const { error } = await supabase
    .from('workflows')
    .update({ enabled })
    .eq('id', id);

  if (error) {
    console.error('[toggleWorkflowEnabled] error:', error.message);
    return { ok: false, message: 'Không thể cập nhật trạng thái.' };
  }

  revalidatePath('/dashboard/workflows');
  return { ok: true };
}

/**
 * Xoá workflow (hard delete).
 * RLS enforce brand ownership.
 */
export async function deleteWorkflow(
  id: string
): Promise<{ ok: boolean; message?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, message: 'Bạn cần đăng nhập.' };
  }

  const { error } = await supabase.from('workflows').delete().eq('id', id);

  if (error) {
    console.error('[deleteWorkflow] error:', error.message);
    return { ok: false, message: 'Không thể xoá workflow.' };
  }

  revalidatePath('/dashboard/workflows');
  return { ok: true };
}

/**
 * Trigger manual run of a workflow.
 * Calls POST /api/workflows/[id]/run internally.
 * Returns success/error to client for toast display.
 */
export async function runWorkflow(
  workflowId: string
): Promise<{ success: boolean; error?: string; content_id?: string; source_title?: string }> {
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const cookieHeader = headersList.get('cookie') ?? '';

    const response = await fetch(`${baseUrl}/api/workflows/${workflowId}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      content_id: data.content_id,
      source_title: data.source_article?.title,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
