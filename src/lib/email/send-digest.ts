import { render } from '@react-email/components';
import DigestEmail from '@/emails/digest';
import { getResendClient, getFromEmail } from './resend';
import type { UserDigestData } from './digest-queries';

export type SendDigestResult =
  | { success: true; emailId: string; userId: string }
  | { success: false; error: string; userId: string };

const DEFAULT_BASE_URL = 'https://auto-content-factory.vercel.app';
const MAX_DRAFTS_IN_TEXT = 10;

function getBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_BASE_URL;
}

function buildPlainText(user: UserDigestData, reviewUrl: string): string {
  const greetName = user.name?.trim() || 'bạn';
  const lines = user.drafts
    .slice(0, MAX_DRAFTS_IN_TEXT)
    .map((d, i) => `${i + 1}. ${d.title}`)
    .join('\n');

  const more =
    user.draftCount > MAX_DRAFTS_IN_TEXT
      ? `\n... và ${user.draftCount - MAX_DRAFTS_IN_TEXT} bài khác trong dashboard\n`
      : '';

  return `Chào ${greetName},

${user.brandName} có ${user.draftCount} bài content mới chờ duyệt:

${lines}${more}

Xem tất cả: ${reviewUrl}

---
Auto-Content Factory`;
}

export async function sendDigestEmail(
  user: UserDigestData
): Promise<SendDigestResult> {
  if (!user.email || user.email.trim().length === 0) {
    console.error('[send-digest] missing email for user:', user.userId);
    return { success: false, error: 'missing email', userId: user.userId };
  }

  if (user.draftCount <= 0 || user.drafts.length === 0) {
    console.warn('[send-digest] skip user with no drafts:', user.userId);
    return { success: false, error: 'no drafts', userId: user.userId };
  }

  try {
    const reviewUrl = `${getBaseUrl()}/dashboard/contents?status=draft`;

    const html = await render(
      DigestEmail({
        userName: user.name,
        brandName: user.brandName,
        draftCount: user.draftCount,
        drafts: user.drafts,
        reviewUrl,
      })
    );

    const text = buildPlainText(user, reviewUrl);

    const client = getResendClient();
    const result = await client.emails.send({
      from: getFromEmail(),
      to: user.email,
      subject: `Bạn có ${user.draftCount} bài content mới chờ duyệt - ${user.brandName}`,
      html,
      text,
      headers: {
        'X-Entity-Ref-ID': `digest-${user.userId}-${Date.now()}`,
      },
    });

    if (result.error) {
      console.error(
        `[send-digest] Resend API error for ${user.userId}:`,
        result.error.message
      );
      return {
        success: false,
        error: result.error.message,
        userId: user.userId,
      };
    }

    if (!result.data?.id) {
      console.error(`[send-digest] no email ID returned for ${user.userId}`);
      return {
        success: false,
        error: 'no email ID returned',
        userId: user.userId,
      };
    }

    console.log(
      `[send-digest] sent OK userId=${user.userId} emailId=${result.data.id} drafts=${user.draftCount}`
    );

    return { success: true, emailId: result.data.id, userId: user.userId };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[send-digest] exception for ${user.userId}:`, errorMsg);
    return { success: false, error: errorMsg, userId: user.userId };
  }
}
