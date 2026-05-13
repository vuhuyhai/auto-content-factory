'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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
