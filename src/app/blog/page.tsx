// Trang Blog - placeholder, sắp ra mắt
import Link from "next/link";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Auto-Content Factory",
  description:
    "Bài viết về content marketing, brand voice và AI cho doanh nghiệp Việt.",
};

interface PreviewPost {
  title: string;
  summary: string;
}

const PREVIEW_POSTS: PreviewPost[] = [
  {
    title: "Brand voice là gì? Tại sao 90% doanh nghiệp Việt chưa có",
    summary: "Hiểu đúng về giọng thương hiệu và lý do nó quyết định content.",
  },
  {
    title: "5 lý do content AI fail ở thị trường Việt - và cách khắc phục",
    summary: "Những sai lầm phổ biến khi dùng AI viết content cho người Việt.",
  },
  {
    title: "Tự động hoá content vs thuê freelancer - bài toán chi phí",
    summary: "So sánh thẳng thắn về chi phí, chất lượng và tốc độ.",
  },
  {
    title:
      "Case study: một chủ shop tăng follower 3x trong 6 tháng nhờ content tự động",
    summary: "Câu chuyện thực tế từ một doanh nghiệp nhỏ tại Việt Nam.",
  },
];

export default function BlogPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Blog
          </h1>
          <p className="text-lg font-semibold text-accent-acf mb-4">
            Sắp ra mắt.
          </p>
          <p className="text-slate-600 mb-10 leading-relaxed">
            Chúng tôi đang chuẩn bị blog với các chủ đề: content marketing cho
            SMB Việt, brand voice là gì và xây thế nào, AI viết content có thật
            sự thay được người? Tip thực tế từ 5 năm tư vấn doanh nghiệp.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PREVIEW_POSTS.map((post) => (
              <div
                key={post.title}
                className="rounded-lg border border-slate-200 p-5"
              >
                <span className="inline-block rounded-full border bg-slate-50 text-xs px-2.5 py-0.5 text-slate-600 mb-3">
                  Sắp ra
                </span>
                <h2 className="text-base font-semibold text-slate-900 mb-1.5 leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {post.summary}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-accent-acf px-5 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
            >
              Đăng ký nhận thông báo khi blog ra mắt
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
