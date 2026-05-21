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

export const SUBJECT = 'Trial Auto-Content Factory hết hạn ngày mai - hành động ngay';

interface TrialReminderEmailProps {
  name: string | null;
  tier: 'starter' | 'pro';
  trialEndIso: string;
  upgradeUrl: string;
}

const MONTHS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

function formatTrialEnd(iso: string): string {
  const date = new Date(iso);
  return `${date.getDate()} tháng ${MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
}

const taglineStyle: CSSProperties = { fontSize: '13px', color: emailColors.textLight, margin: '4px 0 0 0' };

const urgentBadgeStyle: CSSProperties = {
  display: 'inline-block', backgroundColor: emailColors.infoBg, color: emailColors.infoText,
  fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.04em', borderRadius: '4px',
  padding: '4px 10px', margin: '8px 0 0 0',
};

const listStyle: CSSProperties = { margin: '0 0 8px 0', padding: '0 0 0 20px' };

const listItemStyle: CSSProperties = {
  fontSize: '15px', lineHeight: '1.6', color: emailColors.textMuted, margin: '0 0 10px 0',
};

const ctaBoxStyle: CSSProperties = {
  backgroundColor: emailColors.cardBg, border: `2px solid ${emailColors.brand}`,
  borderRadius: '8px', padding: '20px 24px', margin: '24px 0',
};

const ctaHeadingStyle: CSSProperties = {
  fontSize: '18px', fontWeight: 'bold', color: emailColors.brand, margin: '0 0 12px 0',
};

const planLineStyle: CSSProperties = {
  fontSize: '15px', lineHeight: '1.6', color: emailColors.textMuted, margin: '0 0 6px 0',
};

const tierHintStyle: CSSProperties = {
  fontSize: '13px', color: emailColors.textLight, textAlign: 'center', margin: '0',
};

export default function TrialEnding1DayEmail({
  name,
  tier,
  trialEndIso,
  upgradeUrl,
}: TrialReminderEmailProps) {
  const greetName = name?.trim() || 'bạn';
  const tierLabel = tier === 'starter' ? 'Starter' : 'Pro';

  return (
    <Html lang="vi">
      <Head />
      <Preview>Còn 1 ngày trial. Gia hạn ngay để giữ workflow tự động chạy.</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Heading as="h1" style={brandStyle}>
              Auto-Content Factory
            </Heading>
            <Text style={urgentBadgeStyle}>⚠ TRIAL SẮP HẾT HẠN</Text>
          </Section>

          <Hr style={hrStyle} />

          <Section style={contentStyle}>
            <Heading as="h2" style={h2Style}>
              Chào {greetName},
            </Heading>

            <Text style={paragraphStyle}>
              Trial 7 ngày của bạn kết thúc NGÀY MAI ({formatTrialEnd(trialEndIso)}).
            </Text>

            <Text style={paragraphStyle}>
              Sau đó, workflow của bạn sẽ dừng tự động chạy, daily digest dừng gửi, và bạn về gói
              Free chỉ còn 1 workflow. Sau ngày mai bạn sẽ không còn:
            </Text>

            <ul style={listStyle}>
              <li style={listItemStyle}>
                Workflow lịch trình tự động (sáng/tối) - PHẢI tự bấm chạy mỗi lần
              </li>
              <li style={listItemStyle}>
                Daily digest 8h sáng tổng kết content - KHÔNG còn gửi
              </li>
              <li style={listItemStyle}>
                Hashtag prefix theo brand + edit hook inline - bị giới hạn
              </li>
            </ul>

            <Section style={ctaBoxStyle}>
              <Heading as="h3" style={ctaHeadingStyle}>
                Đừng để workflow dừng lại - thanh toán ngay
              </Heading>
              <Text style={planLineStyle}>
                Starter 199.000đ/tháng - giữ nguyên 5 workflow đang chạy
              </Text>
              <Text style={planLineStyle}>
                Pro 399.000đ/tháng - mở khoá 3 brand voice + content không giới hạn
              </Text>
              <Section style={ctaContainerStyle}>
                <Button href={upgradeUrl} style={buttonStyle}>
                  Thanh toán ngay
                </Button>
              </Section>
              <Text style={tierHintStyle}>Bạn đang trial gói {tierLabel}</Text>
            </Section>

            <Text style={paragraphStyle}>
              Nếu chưa muốn tiếp tục, tài khoản sẽ tự về gói Free, không bị tính tiền gì.
            </Text>

            <Text style={paragraphStyle}>
              Cần hỗ trợ gấp? Reply email này, ACF team sẽ phản hồi trong 1-2h giờ làm việc.
            </Text>

            <Text style={paragraphStyle}>ACF team</Text>
          </Section>

          <Hr style={hrStyle} />

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>Auto-Content Factory · autocontent.online</Text>
            <Text style={footerTextStyle}>
              <Link href="#" style={footerLinkStyle}>
                Quản lý thông báo
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

TrialEnding1DayEmail.PreviewProps = {
  name: 'Vũ Hải',
  tier: 'pro',
  trialEndIso: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  upgradeUrl: 'https://autocontent.online/dashboard?upgrade=show',
} as TrialReminderEmailProps;
