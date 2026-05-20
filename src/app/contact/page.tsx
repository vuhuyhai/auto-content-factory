// Trang Liên hệ - public
import Link from "next/link";
import { Footer } from "@/components/landing/footer";
import { ContactForm } from "./contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ | Auto-Content Factory",
  description: "Liên hệ Auto-Content Factory để được hỗ trợ hoặc hợp tác.",
};

interface ContactChannel {
  title: string;
  email: string;
  note: string;
}

const CHANNELS: ContactChannel[] = [
  {
    title: "Hỗ trợ",
    email: "hello@autocontent.online",
    note: "Dành cho người dùng đang sử dụng dịch vụ, báo lỗi hoặc yêu cầu hoàn tiền.",
  },
  {
    title: "Hợp tác",
    email: "partner@autocontent.online",
    note: "Dành cho đối tác, agency và reseller muốn hợp tác kinh doanh.",
  },
  {
    title: "Báo chí",
    email: "press@autocontent.online",
    note: "Dành cho cơ quan truyền thông, báo chí và yêu cầu phỏng vấn.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="text-lg font-semibold text-slate-900">
            Auto-Content Factory
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Liên hệ
          </h1>
          <p className="text-slate-600 mb-10 leading-relaxed">
            Chúng tôi luôn sẵn sàng lắng nghe. Mọi yêu cầu sẽ được phản hồi
            trong vòng 24 giờ làm việc.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {CHANNELS.map((channel) => (
              <div
                key={channel.title}
                className="rounded-lg border border-slate-200 p-5"
              >
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  {channel.title}
                </h2>
                <a
                  href={`mailto:${channel.email}`}
                  className="text-sm text-accent-acf hover:underline break-all"
                >
                  {channel.email}
                </a>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {channel.note}
                </p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Hoặc gửi tin nhắn nhanh
          </h2>
          <ContactForm />
          <p className="mt-4 text-sm text-slate-500">
            Chúng tôi sẽ phản hồi trong 24h làm việc.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
