import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://autocontent.online'),
  title: 'Auto-Content Factory - Tự động hoá content, giữ giọng brand',
  description:
    'SaaS giúp chủ doanh nghiệp Việt tự động hoá viết content social bằng brand voice riêng. Tiết kiệm 4-6 giờ mỗi tuần.',
  openGraph: {
    title: 'Auto-Content Factory - Tự động hoá content, giữ giọng brand',
    description:
      'SaaS giúp chủ doanh nghiệp Việt tự động hoá viết content social bằng brand voice riêng. Tiết kiệm 4-6 giờ mỗi tuần.',
    url: 'https://autocontent.online',
    siteName: 'Auto-Content Factory',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auto-Content Factory - Tự động hoá content, giữ giọng brand',
    description:
      'SaaS giúp chủ doanh nghiệp Việt tự động hoá viết content social bằng brand voice riêng. Tiết kiệm 4-6 giờ mỗi tuần.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
