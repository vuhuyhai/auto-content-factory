/**
 * Send welcome email sau khi user signup verify Supabase Auth.
 * Day 16 M3.3 - Email infra Phase 1.
 *
 * Pattern: discriminated return type cho error handling rõ ở callsite.
 * Fire-and-forget OK (callsite không block flow auth).
 */

import { render } from '@react-email/components';
import WelcomeEmail from '@/emails/welcome';
import { getResendClient, getFromEmail } from './resend';

export interface SendWelcomeInput {
  to: string;
  userName?: string;
  baseUrl?: string;
}

export type SendWelcomeResult =
  | { success: true; emailId: string }
  | { success: false; error: string };

const DEFAULT_BASE_URL = 'https://auto-content-factory.vercel.app';

export async function sendWelcomeEmail(
  input: SendWelcomeInput
): Promise<SendWelcomeResult> {
  try {
    const baseUrl = input.baseUrl?.replace(/\/$/, '') || DEFAULT_BASE_URL;
    const onboardingUrl = `${baseUrl}/onboarding`;
    const dashboardUrl = `${baseUrl}/dashboard`;

    const html = await render(
      WelcomeEmail({
        userName: input.userName,
        userEmail: input.to,
        onboardingUrl,
        dashboardUrl,
      })
    );

    const text = `Chào ${input.userName || input.to.split('@')[0]}!

Mình là Vũ Hải, founder của Auto-Content Factory. Cảm ơn bạn đã đăng ký dùng thử.

ACF giúp bạn tự động viết content social bằng brand voice riêng của thương hiệu bạn.

Bước đầu tiên: Tạo Brand Voice cho thương hiệu của bạn (~3 phút).

Vào link sau để bắt đầu: ${onboardingUrl}

Trial 14 ngày, không cần thẻ tín dụng. Reply email này nếu cần hỗ trợ.

Auto-Content Factory · Hà Nội, Việt Nam`;

    const client = getResendClient();
    const result = await client.emails.send({
      from: getFromEmail(),
      to: input.to,
      subject: 'Chào mừng đến với Auto-Content Factory',
      html,
      text,
      headers: {
        'X-Entity-Ref-ID': `welcome-${Date.now()}`,
      },
    });

    if (result.error) {
      console.error('[sendWelcomeEmail] Resend API error:', result.error);
      return { success: false, error: result.error.message };
    }

    if (!result.data?.id) {
      return { success: false, error: 'No email ID returned' };
    }

    console.log('[sendWelcomeEmail] Sent OK:', {
      to: input.to,
      emailId: result.data.id,
    });

    return { success: true, emailId: result.data.id };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[sendWelcomeEmail] Exception:', errorMsg);
    return { success: false, error: errorMsg };
  }
}
