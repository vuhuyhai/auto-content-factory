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
  smallTextStyle,
  linkStyle,
  infoStyle,
  infoTextStyle,
  footerStyle,
  footerTextStyle,
  footerLinkStyle,
} from './_styles';

interface WelcomeEmailProps {
  userName?: string;
  userEmail: string;
  onboardingUrl: string;
  dashboardUrl: string;
}

export default function WelcomeEmail({
  userName,
  userEmail,
  onboardingUrl,
  dashboardUrl,
}: WelcomeEmailProps) {
  const displayName = userName?.trim() || userEmail.split('@')[0];

  return (
    <Html lang="vi">
      <Head />
      <Preview>Chào bạn! Bắt đầu tạo Brand Voice cho thương hiệu của bạn trong 3 phút.</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Heading as="h1" style={brandStyle}>
              Auto-Content Factory
            </Heading>
          </Section>

          <Hr style={hrStyle} />

          <Section style={contentStyle}>
            <Heading as="h2" style={h2Style}>
              Chào {displayName}!
            </Heading>

            <Text style={paragraphStyle}>
              Mình là Vũ Hải, founder của Auto-Content Factory. Cảm ơn bạn đã đăng ký dùng thử.
            </Text>

            <Text style={paragraphStyle}>
              ACF giúp bạn tự động viết content social bằng brand voice riêng của thương hiệu bạn. Mỗi sáng, hệ thống sẽ gửi content draft sẵn cho bạn duyệt.
            </Text>

            <Text style={paragraphStyle}>
              <strong>Bước đầu tiên:</strong> Tạo Brand Voice cho thương hiệu của bạn. Mất khoảng 3 phút.
            </Text>

            <Section style={ctaContainerStyle}>
              <Button href={onboardingUrl} style={buttonStyle}>
                Bắt đầu tạo Brand Voice
              </Button>
            </Section>

            <Text style={smallTextStyle}>
              Hoặc copy link này vào browser:{' '}
              <Link href={onboardingUrl} style={linkStyle}>
                {onboardingUrl}
              </Link>
            </Text>
          </Section>

          <Hr style={hrStyle} />

          <Section style={infoStyle}>
            <Text style={infoTextStyle}>
              <strong>Trial 14 ngày:</strong> Không cần thẻ tín dụng. Sau 14 ngày, bạn có thể nâng cấp nếu thấy ACF hữu ích.
            </Text>

            <Text style={infoTextStyle}>
              <strong>Cần hỗ trợ?</strong> Reply trực tiếp email này, mình sẽ trả lời sớm nhất có thể.
            </Text>
          </Section>

          <Hr style={hrStyle} />

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Auto-Content Factory · Hà Nội, Việt Nam
            </Text>
            <Text style={footerTextStyle}>
              <Link href={dashboardUrl} style={footerLinkStyle}>
                Vào dashboard
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

WelcomeEmail.PreviewProps = {
  userName: 'Vũ Hải',
  userEmail: 'vuhai@example.com',
  onboardingUrl: 'https://autocontent.online/onboarding',
  dashboardUrl: 'https://autocontent.online/dashboard',
} as WelcomeEmailProps;
