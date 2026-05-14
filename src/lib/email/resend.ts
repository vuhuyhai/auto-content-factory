/**
 * Resend client singleton cho ACF email infra.
 * Reuse cho welcome, daily digest, trial countdown, payment confirm.
 *
 * Pattern Day 11: singleton instance + lazy init.
 */

import { Resend } from 'resend';

let resendClient: Resend | null = null;

/**
 * Lazy-init Resend client. Throw rõ ràng nếu env vars thiếu.
 * Pattern Day 9 RULE D9-1: verify env replacement trước khi dùng.
 */
export function getResendClient(): Resend {
  if (resendClient) return resendClient;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !apiKey.startsWith('re_')) {
    throw new Error(
      '[Resend] RESEND_API_KEY missing or invalid format. Check .env.local'
    );
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

/**
 * Get sender email (Name <email@domain> format).
 * Default fallback nếu env var thiếu (Day 16 dev safety net).
 */
export function getFromEmail(): string {
  return (
    process.env.RESEND_FROM_EMAIL ||
    'Auto-Content Factory <onboarding@resend.dev>'
  );
}
