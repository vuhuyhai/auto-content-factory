'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { bulkUpdateStatusSchema, updateStatusSchema } from '@/lib/contents/schemas';
import type { ContentStatus } from '@/lib/contents/types';
import type { BulkUpdateStatusInput, UpdateStatusInput } from '@/lib/contents/schemas';

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
