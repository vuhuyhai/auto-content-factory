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
 * Build config JSONB theo workflow type.
 * - news_based: { name, news_sources }
 * - evergreen: { name, topic_focus }
 * - promotional: { name, product_link, offer }
 */
function buildWorkflowConfig(data: WorkflowFormSchema): Record<string, unknown> {
  const base = { name: data.name };

  if (data.type === 'news_based') {
    return {
      ...base,
      news_sources: data.newsSources ?? [],
    };
  }

  if (data.type === 'evergreen') {
    return {
      ...base,
      topic_focus: (data.topicFocus ?? '').trim(),
    };
  }

  // promotional
  return {
    ...base,
    product_link: (data.productLink ?? '').trim(),
    offer: (data.offer ?? '').trim(),
  };
}

/**
 * Server Action tạo workflow mới.
 * - Auth check qua Supabase
 * - Validate với zod (type-specific field check qua superRefine)
 * - Fetch brand_id của user (RLS-aware)
 * - Insert workflow với config JSONB theo type
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

  // 4. Insert workflow với config theo type
  const config = buildWorkflowConfig(data);

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
): Promise<{ success: boolean; error?: string; job_id?: string; message?: string }> {
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
      job_id: data.job_id,
      message: data.message,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Server Action cập nhật workflow đã tồn tại.
 * - Lock field `type` (không update — tránh phá config JSONB shape)
 * - Chỉ update: schedule_cron, enabled, config
 * - Defense-in-depth: JOIN brands verify ownership trước khi update
 *   (ngoài RLS đã enforce ở DB)
 */
export async function updateWorkflow(
  workflowId: string,
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
      message: 'Phiên đăng nhập hết hạn.',
    };
  }

  // 3. Defense-in-depth ownership: workflow JOIN brands
  const { data: existing, error: ownerError } = await supabase
    .from('workflows')
    .select('id, brands!inner(user_id)')
    .eq('id', workflowId)
    .eq('brands.user_id', user.id)
    .maybeSingle();

  if (ownerError || !existing) {
    return {
      ok: false,
      message: 'Không tìm thấy workflow hoặc bạn không có quyền.',
    };
  }

  // 4. Build config JSONB theo type (helper dùng chung với createWorkflow)
  const config = buildWorkflowConfig(data);

  // 5. UPDATE — KHÔNG update type, brand_id, last_run_at
  const { error: updateError } = await supabase
    .from('workflows')
    .update({
      schedule_cron: data.scheduleCron,
      enabled: data.enabled,
      config,
    } as never)
    .eq('id', workflowId);

  if (updateError) {
    console.error('[updateWorkflow] update error:', updateError.message);
    return {
      ok: false,
      message: 'Không thể cập nhật workflow.',
    };
  }

  // 6. Revalidate + redirect
  revalidatePath('/dashboard/workflows');
  revalidatePath('/dashboard');
  redirect('/dashboard/workflows');
}