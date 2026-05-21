/**
 * Send 1 email nhac trial sap het han cho 1 user (Day 25 M4).
 *
 * Pattern Day 17 send-digest.ts: discriminated return type cho caller
 * (endpoint cron) aggregate metrics. NEVER throw - luon return result.
 */

import { render } from '@react-email/components';
import { getResendClient, getFromEmail } from './resend';
import type { TrialReminderUser } from '@/lib/payos/trial-queries';
import { default as TrialEnding3DaysEmail, SUBJECT as SUBJECT_3DAYS } from '@/emails/trial-ending-3-days';
import { default as TrialEnding1DayEmail, SUBJECT as SUBJECT_1DAY } from '@/emails/trial-ending-1-day';

export type SendTrialReminderResult =
  | { success: true; userId: string; daysLeft: 3 | 1; emailId: string }
  | { success: false; userId: string; daysLeft: 3 | 1; error: string };

const DEFAULT_SITE_URL = 'https://autocontent.online';

function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_SITE_URL;
}

function pickTemplate(daysLeft: 3 | 1) {
  if (daysLeft === 3) {
    return { Template: TrialEnding3DaysEmail, subject: SUBJECT_3DAYS };
  }
  return { Template: TrialEnding1DayEmail, subject: SUBJECT_1DAY };
}

function buildPlainText(user: TrialReminderUser, upgradeUrl: string): string {
  const greetName = user.name?.trim() || 'bạn';

  const body =
    user.daysLeft === 3
      ? `Trial 7 ngày của bạn còn 3 ngày nữa. Mấy ngày qua, ACF đã giúp bạn tự động viết content theo brand voice riêng.

Trước khi hết hạn, hãy thử: tạo workflow theo lịch, edit hook + body từng bài, và xem daily digest 8h sáng.

Sẵn sàng giữ luồng content này chạy mãi? Chọn Starter 199.000đ/tháng hoặc Pro 399.000đ/tháng. Hủy bất kỳ lúc nào.`
      : `Trial 7 ngày của bạn kết thúc NGÀY MAI.

Sau đó, workflow sẽ dừng tự động chạy, daily digest dừng gửi, và bạn về gói Free chỉ còn 1 workflow.

Đừng để workflow dừng lại - thanh toán ngay: Starter 199.000đ/tháng hoặc Pro 399.000đ/tháng. Nếu chưa muốn tiếp tục, tài khoản tự về gói Free, không bị tính tiền.`;

  return `Chào ${greetName},

${body}

Xem các gói: ${upgradeUrl}

Cần hỗ trợ? Reply email này, ACF team sẽ phản hồi sớm.

---
Auto-Content Factory · autocontent.online`;
}

export async function sendTrialReminderEmail(
  user: TrialReminderUser
): Promise<SendTrialReminderResult> {
  const { userId, daysLeft } = user;

  // Guards fast-fail
  if (!user.email || user.email.trim().length === 0) {
    console.error(`[trial-reminder] invalid email for userId=${userId}`);
    return { success: false, userId, daysLeft, error: 'invalid-email' };
  }

  if (daysLeft !== 3 && daysLeft !== 1) {
    console.error(`[trial-reminder] invalid daysLeft=${daysLeft} for userId=${userId}`);
    return { success: false, userId, daysLeft, error: 'invalid-days-left' };
  }

  if (user.tier !== 'starter' && user.tier !== 'pro') {
    console.error(`[trial-reminder] invalid tier=${user.tier} for userId=${userId}`);
    return { success: false, userId, daysLeft, error: 'invalid-tier' };
  }

  console.log(
    `[trial-reminder] sending d${daysLeft} to ${user.email} (userId=${userId})`
  );

  try {
    const { Template, subject } = pickTemplate(daysLeft);
    const upgradeUrl = `${getSiteUrl()}/dashboard?upgrade=show`;

    const html = await render(
      Template({
        name: user.name,
        tier: user.tier,
        trialEndIso: user.trialEnd,
        upgradeUrl,
      })
    );
    const text = buildPlainText(user, upgradeUrl);

    const client = getResendClient();
    const result = await client.emails.send({
      from: getFromEmail(),
      to: user.email,
      subject,
      html,
      text,
      headers: {
        'X-Entity-Ref-ID': `${userId}-trial-d${daysLeft}-${Date.now()}`,
      },
    });

    if (result.error) {
      console.error(
        `[trial-reminder] send failed for ${userId}:`,
        result.error.message
      );
      return { success: false, userId, daysLeft, error: result.error.message };
    }

    if (!result.data?.id) {
      console.error(`[trial-reminder] no email ID returned for ${userId}`);
      return { success: false, userId, daysLeft, error: 'no email ID returned' };
    }

    console.log(
      `[trial-reminder] sent d${daysLeft} to ${userId}, emailId=${result.data.id}`
    );
    return { success: true, userId, daysLeft, emailId: result.data.id };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[trial-reminder] send failed for ${userId}:`, errorMsg);
    return { success: false, userId, daysLeft, error: errorMsg };
  }
}
