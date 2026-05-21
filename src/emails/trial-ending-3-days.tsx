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

export const SUBJECT = 'Còn 3 ngày trial - đừng dừng luồng content tự động của bạn';

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

const taglineStyle: CSSProperties = {
  fontSize: '13px',
  color: emailColors.textLight,
  margin: '4px 0 0 0',
};

const listStyle: CSSProperties = {
  margin: '0 0 8px 0',
  padding: '0 0 0 20px',
};

const listItemStyle: CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: emailColors.textMuted,
  margin: '0 0 10px 0',
};

const ctaBoxStyle: CSSProperties = {
  backgroundColor: emailColors.cardBg,
  border: `1px solid ${emailColors.border}`,
  borderLeft: `3px solid ${emailColors.brand}`,
  borderRadius: '8px',
  padding: '20px 24px',
  margin: '24px 0',
};

const ctaHeadingStyle: CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: emailColors.text,
  margin: '0 0 8px 0',
};

const tierHintStyle: CSSProperties = {
  fontSize: '13px',
  color: emailColors.textLight,
  textAlign: 'center',
  margin: '0',
};

export default function TrialEnding3DaysEmail({
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
      <Preview>
        Còn 3 ngày trải nghiệm Auto-Content Factory. Đừng để mất luồng content tự động này nha.
      </Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Heading as="h1" style={brandStyle}>
              Auto-Content Factory
            </Heading>
            <Text style={taglineStyle}>
              Tự động viết content social bằng brand voice riêng
            </Text>
          </Section>

          <Hr style={hrStyle} />

          <Section style={contentStyle}>
            <Heading as="h2" style={h2Style}>
              Chào {greetName},
            </Heading>

            <Text style={paragraphStyle}>
              Mấy ngày qua, ACF đã giúp bạn tự động viết content theo brand voice riêng. Trial 7
              ngày của bạn còn 3 ngày nữa. Nếu chưa thử hết, đây là 3 thứ bạn nên test trước khi
              hết hạn:
            </Text>

            <ul style={listStyle}>
              <li style={listItemStyle}>
                Tạo workflow theo lịch (sáng 7h hoặc tối 8h) - khỏi lo nhớ ngày nào đăng gì
              </li>
              <li style={listItemStyle}>
                Edit hook + body từng bài trước khi duyệt - voice của bạn vẫn là của bạn
              </li>
              <li style={listItemStyle}>
                Daily digest 8h sáng - tổng kết content vừa tạo trong 24h, không sót bài nào
              </li>
            </ul>

            <Section style={ctaBoxStyle}>
              <Heading as="h3" style={ctaHeadingStyle}>
                Sẵn sàng giữ luồng content này chạy mãi?
              </Heading>
              <Text style={paragraphStyle}>
                Chọn gói phù hợp - Starter 199.000đ/tháng hoặc Pro 399.000đ/tháng. Hủy bất kỳ lúc
                nào.
              </Text>
              <Section style={ctaContainerStyle}>
                <Button href={upgradeUrl} style={buttonStyle}>
                  Xem các gói
                </Button>
              </Section>
              <Text style={tierHintStyle}>Bạn đang trial gói {tierLabel}</Text>
            </Section>

            <Text style={paragraphStyle}>
              Trial hết hạn ngày {formatTrialEnd(trialEndIso)}. Sau đó tài khoản sẽ về gói Free (1
              workflow, không có daily digest).
            </Text>

            <Text style={paragraphStyle}>
              Có thắc mắc gì? Reply email này, đội ngũ ACF sẽ trả lời trong 24h.
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

TrialEnding3DaysEmail.PreviewProps = {
  name: 'Vũ Hải',
  tier: 'starter',
  trialEndIso: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  upgradeUrl: 'https://autocontent.online/dashboard?upgrade=show',
} as TrialReminderEmailProps;
