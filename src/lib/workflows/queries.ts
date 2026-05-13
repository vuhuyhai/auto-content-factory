import { createClient } from '@/lib/supabase/server';
import type { WorkflowConfig, WorkflowWithConfig } from './types';

/**
 * Lấy tất cả workflows của user hiện tại (qua RLS).
 * RLS sẽ filter theo brand_id của user.
 * Trả về list workflows kèm config parsed.
 */
export async function getCurrentUserWorkflows(): Promise<WorkflowWithConfig[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from('workflows')
    .select('id, brand_id, type, schedule_cron, enabled, config, last_run_at, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getCurrentUserWorkflows] error:', error.message);
    return [];
  }

  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    brandId: row.brand_id,
    type: row.type,
    scheduleCron: row.schedule_cron,
    enabled: row.enabled,
    config: (row.config as WorkflowConfig | null) ?? null,
    lastRunAt: row.last_run_at ? new Date(row.last_run_at) : null,
    createdAt: new Date(row.created_at),
  }));
}

/**
 * Lấy 1 workflow by ID (qua RLS - user chỉ thấy workflow của brand mình).
 */
export async function getWorkflowById(id: string): Promise<WorkflowWithConfig | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('workflows')
    .select('id, brand_id, type, schedule_cron, enabled, config, last_run_at, created_at')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    brandId: data.brand_id,
    type: data.type,
    scheduleCron: data.schedule_cron,
    enabled: data.enabled,
    config: (data.config as WorkflowConfig | null) ?? null,
    lastRunAt: data.last_run_at ? new Date(data.last_run_at) : null,
    createdAt: new Date(data.created_at),
  };
}
