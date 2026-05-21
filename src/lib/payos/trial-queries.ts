import { createAdminClient } from '@/lib/supabase/admin';
import { isPaidTier, type PaidTier } from '@/lib/payos/constants';

/**
 * 1 user trial sap het han, du dieu kien nhan email nhac (Day 25 M2).
 */
export interface TrialReminderUser {
  userId: string;
  email: string;
  name: string | null;
  tier: PaidTier;
  /** ISO timestamp thoi diem trial het han */
  trialEnd: string;
  /** So ngay con lai: 3 hoac 1 */
  daysLeft: 3 | 1;
}

const MAX_USERS_PER_RUN = 100;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Cot dedup tuong ung voi moc nhac (3 ngay / 1 ngay). */
const SENT_AT_COLUMN: Record<3 | 1, 'reminder_d3_sent_at' | 'reminder_d1_sent_at'> = {
  3: 'reminder_d3_sent_at',
  1: 'reminder_d1_sent_at',
};

type SubscriptionRow = {
  user_id: string;
  tier: string;
  trial_end: string | null;
};

type ProfileRow = {
  id: string;
  email: string;
  name: string | null;
};

/**
 * Lay danh sach user trial con `daysLeft` ngay nua het han, chua duoc nhac.
 * Admin client (bypass RLS).
 *
 * KHONG embed profiles qua PostgREST: subscriptions.user_id FK -> auth.users,
 * profiles.id KHONG co FK ra auth.users -> PostgREST khong resolve duoc quan he.
 * Dung pattern 2 round-trip JS merge (RULE D14-1).
 *
 * Cua so thoi gian: trial_end nam trong [now + (daysLeft - 0.5)d, now + (daysLeft + 0.5)d]
 * de cron chay 1 lan/ngay van bat dung user.
 *
 * Silent fail: tra ve [] neu DB loi (khong throw - cron khong nen sap vi 1 query loi).
 */
export async function getTrialUsersForReminder(
  daysLeft: 3 | 1
): Promise<TrialReminderUser[]> {
  console.log(`[trial-reminder] start fetching users with daysLeft=${daysLeft}`);

  try {
    const supabase = createAdminClient();
    const now = Date.now();
    const minIso = new Date(now + (daysLeft - 0.5) * DAY_MS).toISOString();
    const maxIso = new Date(now + (daysLeft + 0.5) * DAY_MS).toISOString();
    const sentAtColumn = SENT_AT_COLUMN[daysLeft];

    // Buoc 1: query subscriptions (khong embed profiles)
    const { data: subsData, error: subsError } = await supabase
      .from('subscriptions')
      .select('user_id, tier, trial_end')
      .eq('status', 'trialing')
      .in('tier', ['starter', 'pro'])
      .is(sentAtColumn, null)
      .gte('trial_end', minIso)
      .lte('trial_end', maxIso)
      .limit(MAX_USERS_PER_RUN);

    if (subsError) {
      console.error('[trial-reminder] subscriptions fetch failed:', subsError.message);
      return [];
    }

    const subs = (subsData as unknown as SubscriptionRow[] | null) ?? [];

    // Buoc 2: khong co subscription nao -> return rong
    if (subs.length === 0) {
      console.log('[trial-reminder] fetched 0 subscriptions');
      return [];
    }

    // Buoc 3: query profiles cho cac user_id, dung Map de lookup
    const userIds = subs.map((s) => s.user_id);
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, name')
      .in('id', userIds);

    if (profilesError) {
      console.error('[trial-reminder] profiles fetch failed:', profilesError.message);
      return [];
    }

    const profileMap = new Map<string, { email: string; name: string | null }>();
    for (const p of (profilesData as unknown as ProfileRow[] | null) ?? []) {
      if (p.email) profileMap.set(p.id, { email: p.email, name: p.name ?? null });
    }

    // Buoc 4: merge - loop subs, lookup profile, filter row khong match
    const matched: TrialReminderUser[] = [];
    for (const sub of subs) {
      if (!isPaidTier(sub.tier)) continue;
      if (!sub.trial_end) continue;

      const profile = profileMap.get(sub.user_id);
      if (!profile) continue;

      matched.push({
        userId: sub.user_id,
        email: profile.email,
        name: profile.name,
        tier: sub.tier,
        trialEnd: sub.trial_end,
        daysLeft,
      });
    }

    console.log(
      `[trial-reminder] fetched ${subs.length} subscriptions, matched ${matched.length} profiles`
    );
    if (subs.length > matched.length) {
      console.warn(
        `[trial-reminder] ${subs.length - matched.length} subscription(s) khong khop profile (profile bi xoa?)`
      );
    }

    // Buoc 5: return
    return matched;
  } catch (err) {
    console.error('[trial-reminder] unexpected error:', err);
    return [];
  }
}

/**
 * Danh dau da gui email nhac cho cac user (dedup).
 * Set reminder_dN_sent_at = NOW() tuy `daysLeft`.
 *
 * Silent fail: log error, KHONG throw (pattern Day 17 markDigestSent).
 */
export async function markTrialReminderSent(
  userIds: string[],
  daysLeft: 3 | 1
): Promise<void> {
  if (userIds.length === 0) {
    console.log('[trial-reminder] markTrialReminderSent skipped (empty userIds)');
    return;
  }

  const sentAtColumn = SENT_AT_COLUMN[daysLeft];

  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('subscriptions')
      .update({ [sentAtColumn]: new Date().toISOString() } as never)
      .in('user_id', userIds);

    if (error) {
      console.error(
        `[trial-reminder] markTrialReminderSent failed for ${userIds.length} user(s):`,
        error.message
      );
      return;
    }

    console.log(
      `[trial-reminder] marked ${userIds.length} user(s) reminder sent (daysLeft=${daysLeft})`
    );
  } catch (err) {
    console.error('[trial-reminder] markTrialReminderSent unexpected error:', err);
  }
}
