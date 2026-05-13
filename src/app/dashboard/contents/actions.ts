'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { updateStatusSchema } from '@/lib/contents/schemas';
import type { ContentStatus } from '@/lib/contents/types';
import type { UpdateStatusInput } from '@/lib/contents/schemas';

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
