import { NextRequest, NextResponse } from 'next/server';
import {
  getTrialUsersForReminder,
  markTrialReminderSent,
} from '@/lib/payos/trial-queries';
import { sendTrialReminderEmail } from '@/lib/email/send-trial-reminder';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get('Authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error('[trial-reminders] CRON_SECRET env var not set');
    return NextResponse.json({ error: 'Server config error' }, { status: 500 });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    console.warn('[trial-reminders] unauthorized request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startedAt = Date.now();
  console.log('[trial-reminders] cron run started');

  try {
    // Fetch song song 2 batch nhac D-3 va D-1
    const [d3Users, d1Users] = await Promise.all([
      getTrialUsersForReminder(3),
      getTrialUsersForReminder(1),
    ]);
    const allUsers = [...d3Users, ...d1Users];

    if (allUsers.length === 0) {
      console.log('[trial-reminders] no eligible users');
      return NextResponse.json({
        status: 'ok',
        checked: 0,
        sent: 0,
        failed: 0,
        reason: 'no-eligible-users',
        durationMs: Date.now() - startedAt,
      });
    }

    // Gui email batch - Promise.allSettled de 1 user fail khong block ca batch (RULE D17-1)
    const results = await Promise.allSettled(
      allUsers.map((u) => sendTrialReminderEmail(u))
    );

    const d3SuccessIds: string[] = [];
    const d1SuccessIds: string[] = [];
    let sentCount = 0;
    let failedCount = 0;

    for (const r of results) {
      if (r.status === 'rejected') {
        failedCount += 1;
        console.error('[trial-reminders] unexpected rejection:', r.reason);
        continue;
      }

      const result = r.value;
      if (result.success) {
        sentCount += 1;
        if (result.daysLeft === 3) d3SuccessIds.push(result.userId);
        else d1SuccessIds.push(result.userId);
      } else {
        failedCount += 1;
        console.error(
          `[trial-reminders] send failed userId=${result.userId} d=${result.daysLeft} error=${result.error}`
        );
      }
    }

    // Mark dedup CHI cho user gui thanh cong - user fail se retry run sau (RULE D18-2)
    await Promise.all([
      markTrialReminderSent(d3SuccessIds, 3),
      markTrialReminderSent(d1SuccessIds, 1),
    ]);

    const durationMs = Date.now() - startedAt;
    console.log(
      `[trial-reminders] done sent=${sentCount} failed=${failedCount} durationMs=${durationMs}`
    );

    return NextResponse.json({
      status: 'ok',
      checked: allUsers.length,
      sent: sentCount,
      failed: failedCount,
      breakdown: { d3: d3SuccessIds.length, d1: d1SuccessIds.length },
      durationMs,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[trial-reminders] cron run failed:', msg);
    return NextResponse.json(
      { error: 'Trial reminders cron failed' },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'trial-reminders',
    timestamp: new Date().toISOString(),
  });
}
