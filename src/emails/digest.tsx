import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { CSSProperties } from 'react';
import {
  bodyStyle,
  containerStyle,
  headerStyle,
  brandStyle,
  hrStyle,
  contentStyle,
  h2Style,
  paragraphStyle,
  ctaContainerStyle,
  buttonStyle,
  footerStyle,
  footerTextStyle,
  footerLinkStyle,
  emailColors,
} from './_styles';

interface DigestDraftItem {
  contentId: string;
  title: string;
  generatedAt: string;
}

interface DigestEmailProps {
  userName: string | null;
  brandName: string;
  draftCount: number;
  drafts: DigestDraftItem[];
  reviewUrl: string;
}

const MAX_DRAFTS_SHOWN = 5;

const taglineStyle: CSSProperties = {
  fontSize: '13px',
  color: emailColors.textLight,
  margin: '4px 0 0 0',
};

const draftCardStyle: CSSProperties = {
  backgroundColor: emailColors.cardBg,
  border: `1px solid ${emailColors.border}`,
  borderLeft: `3px solid ${emailColors.brand}`,
  padding: '12px 16px',
  margin: '12px 0',
  borderRadius: '4px',
};

const draftTitleStyle: CSSProperties = {
  fontSize: '15px',
  fontWeight: 600,
  color: emailColors.text,
  margin: '0 0 6px 0',
  lineHeight: '1.4',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical' as const,
  overflow: 'hidden',
};

const draftMetaStyle: CSSProperties = {
  fontSize: '12px',
  color: emailColors.textLight,
  margin: '0',
};

const moreLineStyle: CSSProperties = {
  fontSize: '13px',
  color: emailColors.textLight,
  fontStyle: 'italic',
  margin: '12px 0 0 0',
  textAlign: 'center',
};

export function formatRelativeTime(isoString: string, now: Date = new Date()): string {
  const then = new Date(isoString).getTime();
  const diffMs = Math.max(0, now.getTime() - then);
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) {
    return `${Math.max(1, minutes)} phút trước`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} giờ trước`;
  }
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

export default function DigestEmail({
  userName,
  brandName,
  draftCount,
  drafts,
  reviewUrl,
}: DigestEmailProps) {
  const greetName = userName?.trim() || 'bạn';
  const visibleDrafts = drafts.slice(0, MAX_DRAFTS_SHOWN);
  const remaining = Math.max(0, draftCount - visibleDrafts.length);

  return (
    <Html lang="vi">
      <Head />
      <Preview>{`Bạn có ${draftCount} bài content mới chờ duyệt`}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Heading as="h1" style={brandStyle}>
              Auto-Content Factory
            </Heading>
            <Text style={taglineStyle}>Trợ lý viết content cho {brandName}</Text>
          </Section>

          <Hr style={hrStyle} />

          <Section style={contentStyle}>
            <Heading as="h2" style={h2Style}>
              Chào {greetName},
            </Heading>

            <Text style={paragraphStyle}>
              Sáng nay {brandName} có {draftCount} bài content mới đang chờ bạn xem qua. Mỗi bài đã có 3 variant để bạn chọn variant phù hợp nhất.
            </Text>

            {visibleDrafts.map((draft) => (
              <Section key={draft.contentId} style={draftCardStyle}>
                <Text style={draftTitleStyle}>{draft.title}</Text>
                <Text style={draftMetaStyle}>
                  Tạo {formatRelativeTime(draft.generatedAt)}
                </Text>
              </Section>
            ))}

            {remaining > 0 && (
              <Text style={moreLineStyle}>
                ... và {remaining} bài khác trong dashboard
              </Text>
            )}

            <Section style={ctaContainerStyle}>
              <Button href={reviewUrl} style={buttonStyle}>
                Xem tất cả {draftCount} bài
              </Button>
            </Section>
          </Section>

          <Hr style={hrStyle} />

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Bạn nhận email này vì đang dùng Auto-Content Factory
            </Text>
            <Text style={footerTextStyle}>
              <Link href="#" style={footerLinkStyle}>
                Quản lý thông báo
              </Link>
            </Text>
            <Text style={footerTextStyle}>© 2026 Auto-Content Factory</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

DigestEmail.PreviewProps = {
  userName: 'Vũ Hải',
  brandName: 'Ladysfit',
  draftCount: 7,
  drafts: [
    { contentId: '1', title: '5 bài tập giảm mỡ bụng cho phụ nữ sau sinh hiệu quả tại nhà', generatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
    { contentId: '2', title: 'Bí quyết duy trì vóc dáng cho mẹ bỉm bận rộn', generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { contentId: '3', title: 'Chế độ ăn low-carb tuần đầu - những điều cần biết', generatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  ],
  reviewUrl: 'https://auto-content-factory.vercel.app/dashboard/contents?status=draft',
} as DigestEmailProps;
