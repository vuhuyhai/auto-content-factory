import { NextRequest, NextResponse } from 'next/server';
import { fetchUsersForDigest, markDigestSent } from '@/lib/email/digest-queries';
import { sendDigestEmail } from '@/lib/email/send-digest';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_TRIGGERED_IDS_IN_RESPONSE = 10;

function log(stage: string, data: Record<string, unknown> = {}): void {
  console.log(`[daily-digest] ${stage}`, JSON.stringify(data));
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const authHeader = req.headers.get('authorization');
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    log('error', { reason: 'CRON_SECRET env var not set' });
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  if (authHeader !== `Bearer ${expectedSecret}`) {
    log('auth-fail', { receivedHeader: authHeader?.slice(0, 20) ?? 'null' });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  log('start', { timestamp: new Date().toISOString() });

  try {
    const users = await fetchUsersForDigest();
    log('fetched', { count: users.length });

    if (users.length === 0) {
      log('done', { reason: 'no-eligible-users', durationMs: Date.now() - startTime });
      return NextResponse.json({
        checked: 0,
        sent: 0,
        failed: 0,
        durationMs: Date.now() - startTime,
        reason: 'no-eligible-users',
      });
    }

    log('batch-send-start', { count: users.length });
    const results = await Promise.allSettled(users.map((u) => sendDigestEmail(u)));

    const successUserIds: string[] = [];
    let failedCount = 0;

    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const user = users[i];
      if (r.status === 'rejected') {
        failedCount++;
        const errMsg = r.reason instanceof Error ? r.reason.message : String(r.reason);
        log('send-failed', { userId: user.userId, error: errMsg });
        continue;
      }
      if (r.value.success) {
        successUserIds.push(r.value.userId);
      } else {
        failedCount++;
        log('send-failed', { userId: user.userId, error: r.value.error });
      }
    }

    const successCount = successUserIds.length;
    log('batch-send-done', { success: successCount, failed: failedCount });

    if (successUserIds.length > 0) {
      await markDigestSent(successUserIds);
      log('marked', { count: successUserIds.length });
    }

    const durationMs = Date.now() - startTime;
    log('done', {
      checked: users.length,
      sent: successCount,
      failed: failedCount,
      durationMs,
    });

    return NextResponse.json({
      checked: users.length,
      sent: successCount,
      failed: failedCount,
      durationMs,
      triggered_user_ids: successUserIds.slice(0, MAX_TRIGGERED_IDS_IN_RESPONSE),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    const stack = err instanceof Error ? err.stack : undefined;
    console.error(`[daily-digest] ERROR ${msg}`, stack);
    return NextResponse.json(
      {
        error: 'Daily digest failed',
        details: msg,
        durationMs: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/cron/daily-digest',
    method: 'POST',
    auth: 'Bearer <CRON_SECRET>',
    timestamp: new Date().toISOString(),
  });
}
