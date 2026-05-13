import { createAdminClient } from '@/lib/supabase/admin';
import type { BrandVoiceGuide } from '@/lib/content/types';

/**
 * Config JSONB của workflow.
 * Discriminated theo workflow.type (xem src/lib/workflows/types.ts WorkflowConfig).
 * Type này là loose superset cho query layer (backward compat).
 */
export interface WorkflowConfigForRunner {
  name?: string;
  news_sources?: string[];
  topic_focus?: string;
  product_link?: string;
  offer?: string;
}

export interface WorkflowForRunner {
  id: string;
  brand_id: string | null;
  type: string | null;
  config: WorkflowConfigForRunner | null;
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
    config: (data as { config: WorkflowConfigForRunner | null }).config,
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

/**
 * Lấy source_title của N content gần nhất từ workflow (DESC theo created_at).
 * Dùng cho evergreen prompt: pass vào recentTitles để Claude tránh lặp angle.
 * Trả empty array nếu workflow chưa có content nào (lần chạy đầu tiên).
 */
export async function fetchRecentContentTitlesAdmin(
  workflowId: string,
  limit: number = 5,
): Promise<string[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('contents')
    .select('source_title')
    .eq('workflow_id', workflowId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    // Silent fail: prompt vẫn chạy được không có recent titles, không nên crash
    console.warn(`[fetchRecentContentTitlesAdmin] failed: ${error.message}`);
    return [];
  }

  const rows = (data ?? []) as Array<{ source_title: string | null }>;
  return rows
    .map((r) => r.source_title)
    .filter((t): t is string => typeof t === 'string' && t.trim().length > 0);
}