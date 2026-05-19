import { createClient } from '@/lib/supabase/server';

export interface UserSubscription {
  tier: string;
  status: string;
  trial_start: string | null;
  trial_end: string | null;
  current_period_end: string | null;
}

/**
 * Lay subscription cua user dang dang nhap. RLS tu loc theo user.
 * Tra ve null neu user chua co subscription nao.
 */
export async function getCurrentUserSubscription(): Promise<UserSubscription | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('tier, status, trial_start, trial_end, current_period_end')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as UserSubscription;
}
