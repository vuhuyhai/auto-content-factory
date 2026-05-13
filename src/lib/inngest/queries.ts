import { createAdminClient } from '@/lib/supabase/admin';
import type { BrandVoiceGuide } from '@/lib/content/types';

export interface WorkflowForRunner {
  id: string;
  brand_id: string | null;
  type: string | null;
  config: { name?: string; news_sources?: string[] } | null;
}

export interface BrandForRunner {
  id: string;
  user_id: string;
  brand_voice_guide: BrandVoiceGuide | null;
}

export async function fetchWorkflowByIdAdmin(
  workflowId: string,
  userId: string,
): Promise<WorkflowForRunner | null> {
  const supabase = createAdminClient();

  // Verify ownership via brand_id → brands.user_id (workflows table has no user_id column)
  const { data, error } = await supabase
    .from('workflows')
    .select('id, brand_id, type, config, brands!inner(user_id)')
    .eq('id', workflowId)
    .eq('brands.user_id', userId)
    .maybeSingle();

  if (error) throw new Error(`Fetch workflow failed: ${error.message}`);
  if (!data) return null;

  return {
    id: (data as { id: string }).id,
    brand_id: (data as { brand_id: string | null }).brand_id,
    type: (data as { type: string | null }).type,
    config: (data as { config: { name?: string; news_sources?: string[] } | null }).config,
  };
}

export async function fetchBrandByUserIdAdmin(
  userId: string,
): Promise<BrandForRunner | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('brands')
    .select('id, user_id, brand_voice_guide')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Fetch brand failed: ${error.message}`);
  return data as BrandForRunner | null;
}
