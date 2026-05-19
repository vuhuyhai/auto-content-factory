import { NextRequest, NextResponse } from 'next/server';
import { payos } from '@/lib/payos/client';
import { createAdminClient } from '@/lib/supabase/admin';
import { isPaidTier } from '@/lib/payos/constants';

export const runtime = 'nodejs';
export const maxDuration = 30;

function log(stage: string, data: Record<string, unknown>): void {
  console.log(`[payos-webhook] ${stage}`, JSON.stringify(data));
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Doc body tho tu PayOS
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    log('error', { reason: 'body-not-json' });
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  // 2. Verify chu ky - sai chu ky se nem loi, lot vao catch
  let verified;
  try {
    // @ts-expect-error - kieu Webhook cua PayOS, body tho tu request
    verified = await payos.webhooks.verify(rawBody);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown verify error';
    log('error', { reason: 'signature-invalid', detail: msg });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const orderCode = verified.orderCode;
  // PayOS gui webhook cho ca giao dich that bai. code === '00' moi la thanh cong.
  const isPaid = verified.code === '00';
  log('verified', { orderCode, code: verified.code, isPaid });

  if (!isPaid) {
    // Giao dich that bai hoac huy - khong nang cap, chi ghi nhan
    log('skipped', { reason: 'payment-not-successful', orderCode });
    return NextResponse.json({ received: true });
  }

  // 3. Tim subscription theo ma don hang
  const admin = createAdminClient();
  const { data: sub, error: findError } = await admin
    .from('subscriptions')
    .select('id, user_id, tier')
    .eq('payos_order_code', orderCode)
    .maybeSingle();

  if (findError || !sub) {
    log('error', { reason: 'subscription-not-found', orderCode });
    // Tra 200 de PayOS khong gui lai mai - day la loi du lieu, retry khong giup
    return NextResponse.json({ received: true });
  }

  // @ts-expect-error - Supabase client khong co schema types
  const tier: string = sub.tier;
  // @ts-expect-error
  const userId: string = sub.user_id;

  if (!isPaidTier(tier)) {
    log('error', { reason: 'invalid-tier', tier });
    return NextResponse.json({ received: true });
  }

  // 4. Thanh toan thanh cong - gia han them 1 thang
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const { error: updateError } = await admin
    .from('subscriptions')
    .update({
      status: 'active',
      current_period_end: periodEnd.toISOString(),
      updated_at: now.toISOString(),
    } as never)
    // @ts-expect-error
    .eq('id', sub.id);

  if (updateError) {
    log('error', { reason: 'subscription-update-failed', detail: updateError.message });
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }

  // 5. Cap nhat ban tom tat tren profiles
  const { error: profileError } = await admin
    .from('profiles')
    .update({ plan: tier } as never)
    .eq('id', userId);

  if (profileError) {
    log('error', { reason: 'profile-update-failed', detail: profileError.message });
  }

  log('done', { orderCode, userId, tier });
  return NextResponse.json({ received: true });
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'ok', endpoint: 'payos-webhook' });
}
