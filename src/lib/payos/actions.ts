'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { payos } from './client';
import { TRIAL_DAYS, TIER_CONFIG, isPaidTier, type PaidTier } from './constants';

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Bat dau dung thu 7 ngay cho mot goi tra phi.
 * Khong goi PayOS, khong can tra tien. Chi ghi subscriptions trang thai trialing.
 */
export async function startTrial(tier: string): Promise<ActionResult> {
  if (!isPaidTier(tier)) {
    return { success: false, error: 'Goi khong hop le' };
  }
  const paidTier: PaidTier = tier;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Chưa đăng nhập' };
  }

  // Dung admin client de ghi: subscriptions chi cho user SELECT, viec ghi do he thong lam
  const admin = createAdminClient();

  // Chan trial 2 lan: neu da co subscription thi khong cho trial lai
  const { data: existing } = await admin
    .from('subscriptions')
    .select('id, status')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      error: 'Tài khoản đã có gói đăng ký, không thể bắt đầu dùng thử lại.',
    };
  }

  const now = new Date();
  const trialEnd = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

  const { error: insertError } = await admin.from('subscriptions').insert({
    user_id: user.id,
    tier: paidTier,
    status: 'trialing',
    trial_start: now.toISOString(),
    trial_end: trialEnd.toISOString(),
  } as never);

  if (insertError) {
    console.error('[startTrial] insert error:', insertError.message);
    return { success: false, error: 'Không thể bắt đầu dùng thử lúc này.' };
  }

  // Cap nhat ban tom tat doc nhanh tren profiles
  const { error: profileError } = await admin
    .from('profiles')
    .update({ plan: paidTier } as never)
    .eq('id', user.id);

  if (profileError) {
    console.error('[startTrial] profile update error:', profileError.message);
  }

  revalidatePath('/dashboard', 'layout');
  return { success: true };
}

interface PaymentLinkResult {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}

/**
 * Tao link thanh toan PayOS cho mot goi tra phi.
 * Tra ve checkoutUrl de chuyen khach toi trang tra tien.
 */
export async function createPaymentLink(
  tier: string
): Promise<PaymentLinkResult> {
  if (!isPaidTier(tier)) {
    return { success: false, error: 'Goi khong hop le' };
  }
  const paidTier: PaidTier = tier;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Chưa đăng nhập' };
  }

  const config = TIER_CONFIG[paidTier];

  // Ma don hang PayOS: phai la so, moi lan khac nhau. Dung so giay hien tai.
  const orderCode = Math.floor(Date.now() / 1000);

  const headersList = await headers();
  const origin =
    headersList.get('origin') || 'https://auto-content-factory.vercel.app';

  try {
    const paymentLink = await payos.paymentRequests.create({
      orderCode,
      amount: config.priceVnd,
      description: `ACF goi ${config.label}`,
      returnUrl: `${origin}/dashboard?payment=success`,
      cancelUrl: `${origin}/dashboard?payment=cancel`,
    });

    // Luu ma don vao subscriptions de M4 (webhook) doi chieu
    const admin = createAdminClient();
    const { error: upsertError } = await admin
      .from('subscriptions')
      .upsert(
        {
          user_id: user.id,
          tier: paidTier,
          payos_order_code: orderCode,
        } as never,
        { onConflict: 'user_id' }
      );

    if (upsertError) {
      console.error('[createPaymentLink] upsert error:', upsertError.message);
    }

    return { success: true, checkoutUrl: paymentLink.checkoutUrl };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[createPaymentLink] PayOS error:', message);
    return { success: false, error: 'Không thể tạo link thanh toán lúc này.' };
  }
}
