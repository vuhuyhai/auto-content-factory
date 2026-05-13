import { createAdminClient } from '@/lib/supabase/admin';

export interface EnabledWorkflow {
  id: string;
  brand_id: string;
  user_id: string;
  schedule_cron: string;
  last_run_at: string | null;
}

export async function fetchEnabledWorkflows(): Promise<EnabledWorkflow[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('workflows')
    .select('id, brand_id, schedule_cron, last_run_at, brands!inner(user_id)')
    .eq('enabled', true);

  if (error) {
    throw new Error(`Failed to fetch workflows: ${error.message}`);
  }

  if (!data) return [];

  return data.map((row) => {
    const typed = row as unknown as {
      id: string;
      brand_id: string;
      schedule_cron: string;
      last_run_at: string | null;
      brands: { user_id: string } | { user_id: string }[];
    };
    const userId = Array.isArray(typed.brands) ? typed.brands[0]?.user_id : typed.brands?.user_id;

    return {
      id: typed.id,
      brand_id: typed.brand_id,
      user_id: userId ?? '',
      schedule_cron: typed.schedule_cron,
      last_run_at: typed.last_run_at,
    };
  });
}

export async function markWorkflowTriggered(workflowId: string): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await (supabase
    .from('workflows')
    .update({ last_run_at: new Date().toISOString() } as never)
    .eq('id', workflowId));

  if (error) {
    throw new Error(`Failed to mark workflow ${workflowId} triggered: ${error.message}`);
  }
}
