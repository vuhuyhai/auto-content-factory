/**
 * Email design tokens & shared styles cho Auto-Content Factory.
 * Underscore prefix = shared utilities, không phải email template standalone.
 *
 * Reuse cho: welcome, daily digest, trial countdown, payment confirm.
 * Pattern Day 13: _base.ts cho prompt builders.
 */

import type { CSSProperties } from 'react';

export const emailColors = {
  brand: '#dc2626',
  brandHover: '#b91c1c',
  text: '#111827',
  textMuted: '#374151',
  textLight: '#6b7280',
  textFooter: '#9ca3af',
  background: '#f5f5f5',
  cardBg: '#ffffff',
  border: '#e5e7eb',
  infoBg: '#fef3c7',
  infoText: '#78350f',
} as const;

export const bodyStyle: CSSProperties = {
  backgroundColor: emailColors.background,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
  margin: '0',
  padding: '0',
};

export const containerStyle: CSSProperties = {
  backgroundColor: emailColors.cardBg,
  margin: '0 auto',
  padding: '40px 24px',
  maxWidth: '600px',
};

export const headerStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: '8px',
};

export const brandStyle: CSSProperties = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: emailColors.brand,
  margin: '0',
  letterSpacing: '-0.02em',
};

export const hrStyle: CSSProperties = {
  borderColor: emailColors.border,
  margin: '24px 0',
};

export const contentStyle: CSSProperties = {
  padding: '0 8px',
};

export const h2Style: CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: emailColors.text,
  margin: '0 0 16px 0',
  lineHeight: '1.3',
};

export const paragraphStyle: CSSProperties = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: emailColors.textMuted,
  margin: '0 0 16px 0',
};

export const ctaContainerStyle: CSSProperties = {
  textAlign: 'center',
  margin: '32px 0',
};

export const buttonStyle: CSSProperties = {
  backgroundColor: emailColors.brand,
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '14px 32px',
};

export const smallTextStyle: CSSProperties = {
  fontSize: '13px',
  lineHeight: '1.5',
  color: emailColors.textLight,
  margin: '16px 0 0 0',
  wordBreak: 'break-all',
};

export const linkStyle: CSSProperties = {
  color: emailColors.brand,
  textDecoration: 'underline',
};

export const infoStyle: CSSProperties = {
  backgroundColor: emailColors.infoBg,
  borderRadius: '8px',
  padding: '16px 20px',
  margin: '8px 0',
};

export const infoTextStyle: CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: emailColors.infoText,
  margin: '0 0 8px 0',
};

export const footerStyle: CSSProperties = {
  textAlign: 'center',
  padding: '0 8px',
};

export const footerTextStyle: CSSProperties = {
  fontSize: '12px',
  lineHeight: '1.5',
  color: emailColors.textFooter,
  margin: '4px 0',
};

export const footerLinkStyle: CSSProperties = {
  color: emailColors.textFooter,
  textDecoration: 'underline',
};
