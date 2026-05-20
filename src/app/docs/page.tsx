// Trang Hướng dẫn sử dụng - placeholder
import Link from "next/link";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hướng dẫn | Auto-Content Factory",
  description: "Tài liệu hướng dẫn sử dụng Auto-Content Factory.",
};

interface DocSection {
  title: string;
  bullets: string[];
}

const SECTIONS: DocSection[] = [
  {
    title: "Bắt đầu nhanh",
    bullets: [
      "Đăng ký tài khoản bằng email hoặc Google.",
      "Hoàn thành onboarding 7 bước để định hình thương hiệu.",
      "Tạo workflow đầu tiên để hệ thống bắt đầu viết content.",
    ],
  },
  {
    title: "Brand voice",
    bullets: [
      "Định nghĩa giọng thương hiệu qua các câu hỏi onboarding.",
      "Cách AI học và áp dụng giọng đó vào từng bài content.",
    ],
  },
  {
    title: "Workflow",
    bullets: [
      "Tạo workflow chạy theo lịch (hằng ngày hoặc hằng tuần).",
      "Chỉnh sửa content trước khi xuất bản.",
      "Lưu draft và publish sau khi đã sẵn sàng.",
    ],
  },
  {
    title: "Thanh toán và gói",
    bullets: [
      "So sánh gói Free và gói Pro để chọn đúng nhu cầu.",
      "Hủy gói và quy trình hoàn tiền.",
    ],
  },
];

export default function DocsPage() {
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
            Hướng dẫn sử dụng
          </h1>
          <p className="text-slate-600 mb-10 leading-relaxed">
            Tài liệu chi tiết đang được biên soạn. Trong lúc chờ, đây là những
            gì bạn cần biết để bắt đầu.
          </p>

          <div className="space-y-8">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">
                  {section.title}
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-slate-700 leading-relaxed">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-accent-acf px-5 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
            >
              Cần hỗ trợ? Liên hệ chúng tôi
            </Link>
            <p className="mt-4 text-xs text-slate-500">
              Tài liệu API sẽ có ở phiên bản v2 (Q3 2026).
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
