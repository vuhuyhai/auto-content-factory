'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  bulkUpdateStatusSchema,
  updateStatusSchema,
  updateVariantContentSchema,
} from '@/lib/contents/schemas';
import type { ContentStatus } from '@/lib/contents/types';
import type {
  BulkUpdateStatusInput,
  UpdateStatusInput,
  UpdateVariantContentInput,
} from '@/lib/contents/schemas';

export async function selectVariant(
  contentId: string,
  variantIndex: number
): Promise<{ success: boolean; error?: string }> {
  if (variantIndex < 0 || variantIndex > 10) {
    return { success: false, error: 'Variant index không hợp lệ' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Chưa đăng nhập' };
  }

  const { error } = await (supabase
    .from('contents')
    .update({ selected_variant_index: variantIndex } as never)
    .eq('id', contentId));

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/dashboard/contents/${contentId}`);
  revalidatePath('/dashboard/contents');
  return { success: true };
}

export async function updateContentStatus(
  input: UpdateStatusInput
): Promise<{ success: boolean; status: ContentStatus }> {
  const parsed = updateStatusSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error('Status không hợp lệ');
  }
  const { contentId, status } = parsed.data;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Chưa đăng nhập');
  }

  const { error } = await (supabase
    .from('contents')
    .update({ status } as never)
    .eq('id', contentId));

  if (error) {
    throw new Error(`Không cập nhật được trạng thái: ${error.message}`);
  }

  revalidatePath('/dashboard/contents');
  revalidatePath(`/dashboard/contents/${contentId}`);
  revalidatePath('/dashboard', 'layout');
  return { success: true, status };
}

export async function bulkUpdateStatus(
  input: BulkUpdateStatusInput
): Promise<{ success: boolean; updated_count: number; error?: string }> {
  const parsed = bulkUpdateStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, updated_count: 0, error: 'Input không hợp lệ' };
  }
  const { ids, status } = parsed.data;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, updated_count: 0, error: 'Chưa đăng nhập' };
  }

  // Cách 2 fallback: Supabase JS không hỗ trợ join filter trong UPDATE,
  // nên fetch ownership trước (brands!inner → user_id) rồi update chỉ valid ids.
  const { data: owned, error: ownErr } = await supabase
    .from('contents')
    .select('id, brands!inner(user_id)')
    .in('id', ids)
    .eq('brands.user_id', user.id);

  if (ownErr) {
    return { success: false, updated_count: 0, error: ownErr.message };
  }

  const validIds = (owned as unknown as { id: string }[] | null)?.map((r) => r.id) ?? [];

  if (validIds.length === 0) {
    return { success: false, updated_count: 0, error: 'Không có nội dung hợp lệ' };
  }

  const { error } = await (supabase
    .from('contents')
    .update({ status } as never)
    .in('id', validIds));

  if (error) {
    return { success: false, updated_count: 0, error: error.message };
  }

  revalidatePath('/dashboard', 'layout');
  revalidatePath('/dashboard/contents');
  return { success: true, updated_count: validIds.length };
}

/**
 * M3.1: Update inline 4 field của 1 variant.
 * Defense-in-depth: RLS + app-layer ownership check qua brands.user_id (RULE D14-1).
 * Pattern fetch-merge-update an toàn (validate variantIndex tồn tại trước).
 */
export async function updateVariantContent(
  input: UpdateVariantContentInput
): Promise<{ success: boolean; error?: string }> {
  const parsed = updateVariantContentSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      success: false,
      error: firstError?.message ?? 'Dữ liệu không hợp lệ',
    };
  }

  const { contentId, variantIndex, fields } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Phiên đăng nhập hết hạn' };
  }

  // Defense-in-depth: verify ownership qua brands.user_id (RULE D14-1)
  const { data: owned, error: ownErr } = await supabase
    .from('contents')
    .select('id, brands!inner(user_id)')
    .eq('id', contentId)
    .eq('brands.user_id', user.id)
    .maybeSingle();

  if (ownErr || !owned) {
    return { success: false, error: 'Không tìm thấy nội dung hoặc không có quyền' };
  }

  // Normalize hashtags: ensure # prefix (DRY pattern Day 11)
  const normalizedHashtags = fields.hashtags.map((tag) =>
    tag.startsWith('#') ? tag : `#${tag}`
  );

  const { data: current, error: fetchErr } = await supabase
    .from('contents')
    .select('variants')
    .eq('id', contentId)
    .single();

  if (fetchErr || !current) {
    return { success: false, error: 'Không đọc được nội dung hiện tại' };
  }

  const variants = (current as { variants: Array<Record<string, unknown>> | null }).variants;
  if (!Array.isArray(variants) || variantIndex >= variants.length) {
    return { success: false, error: `Variant index ${variantIndex} không tồn tại` };
  }

  const updatedVariants = [...variants];
  updatedVariants[variantIndex] = {
    ...variants[variantIndex],
    hook: fields.hook,
    title: fields.title,
    body: fields.body,
    hashtags: normalizedHashtags,
  };

  const { error: updateErr } = await (supabase
    .from('contents')
    .update({ variants: updatedVariants } as never)
    .eq('id', contentId));

  if (updateErr) {
    console.error('[updateVariantContent] DB error:', updateErr);
    return { success: false, error: 'Lưu thất bại, vui lòng thử lại' };
  }

  revalidatePath(`/dashboard/contents/${contentId}`);
  revalidatePath('/dashboard/contents');

  return { success: true };
}
