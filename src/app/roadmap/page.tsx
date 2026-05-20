// Trang Roadmap - public
import Link from "next/link";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap | Auto-Content Factory",
  description: "Lộ trình phát triển tính năng của Auto-Content Factory.",
};

interface RoadmapPhase {
  title: string;
  items: string[];
}

const PHASES: RoadmapPhase[] = [
  {
    title: "Đang làm (Q2 2026)",
    items: [
      "Workflow tự động chạy theo lịch",
      "Tích hợp PayOS đầy đủ",
      "Brand voice học từ bài viết cũ",
    ],
  },
  {
    title: "Sắp tới (Q3 2026)",
    items: [
      "Tích hợp Facebook + LinkedIn API",
      "Mobile app iOS/Android",
      "Team collaboration (nhiều user một brand)",
      "Analytics chi tiết",
    ],
  },
  {
    title: "Đang nghiên cứu (Q4 2026+)",
    items: [
      "Video script generator",
      "A/B testing variants",
      "Tích hợp Zapier/n8n",
      "Multi-brand cho agency",
    ],
  },
];

export default function RoadmapPage() {
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
            Roadmap
          </h1>
          <p className="text-slate-600 mb-10 leading-relaxed">
            Đây là những gì chúng tôi đang xây dựng. Lộ trình có thể thay đổi
            theo phản hồi từ user.
          </p>

          <div className="space-y-10">
            {PHASES.map((phase) => (
              <section key={phase.title}>
                <h2 className="text-xl font-semibold text-accent-acf mb-4">
                  {phase.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {phase.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border bg-slate-50 text-sm px-3 py-1 text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-12 pt-8 border-t border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              Bạn muốn tính năng gì?
            </h2>
            <p className="text-slate-600 mb-5 leading-relaxed">
              Mỗi đề xuất từ bạn đều giúp chúng tôi ưu tiên đúng việc cần làm.
            </p>
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-accent-acf px-5 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
            >
              Gửi đề xuất
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
