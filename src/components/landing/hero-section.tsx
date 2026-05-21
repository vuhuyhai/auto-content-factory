// Hero Section - Bento Grid Pattern A (Hero-Left)
// Source content: LANDING_CONTENT.md - Phần 1 + 2 rút gọn
// Design: Light Bento, accent token accent-acf, gap 24px desktop, radius 20px

import { Mic2, Sparkles, ArrowRight, ArrowDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="w-full bg-slate-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="grid grid-cols-4 md:grid-cols-12 gap-4 md:gap-6 auto-rows-fr">
          {/* Hero Card */}
          <Card className="rounded-[20px] border-slate-200 bg-white transition-colors duration-300 hover:border-slate-300 col-span-4 md:col-span-8 md:row-span-2 p-8 md:p-12 flex flex-col justify-between min-h-[400px] border-l-4 border-l-accent-acf">
            <div>
              <Badge variant="outline" className="text-accent-acf border-accent-acf/40 mb-6">
                Auto-Content Factory
              </Badge>
              <h1
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.25] tracking-tight mb-6"
              >
                Content <span style={{ whiteSpace: "nowrap" }}>đều đặn</span> mỗi tuần.{" "}
                Đúng <span style={{ whiteSpace: "nowrap" }}>giọng brand</span>.{" "}
                Không phải <span style={{ whiteSpace: "nowrap" }}>tự viết</span>.
              </h1>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
                SaaS giúp chủ doanh nghiệp Việt tự động hoá viết content social bằng brand voice riêng. Tiết kiệm 4-6 giờ mỗi tuần.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                asChild
                className="min-h-12 bg-accent-acf hover:bg-[#d12d3a] text-white"
              >
                <Link href="/signup">
                  Bắt đầu Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                variant="outline"
                className="min-h-12 border-2 border-gray-900 bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white"
              >
                <Link href="#samples">
                  Xem bài viết mẫu
                  <ArrowDown className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Stat Card 1 */}
          <Card className="rounded-[20px] border-slate-200 bg-white transition-colors duration-300 hover:border-slate-300 col-span-2 md:col-span-4 p-6 md:p-8 flex flex-col justify-center">
            <div className="text-4xl md:text-5xl font-bold text-accent-acf leading-none mb-3 tracking-tight">
              4-6h
            </div>
            <div className="text-sm text-slate-600 leading-relaxed">
              thời gian tự viết content mỗi tuần
            </div>
          </Card>

          {/* Stat Card 2 */}
          <Card className="rounded-[20px] border-slate-200 bg-white transition-colors duration-300 hover:border-slate-300 col-span-2 md:col-span-4 p-6 md:p-8 flex flex-col justify-center">
            <div className="text-4xl md:text-5xl font-bold text-accent-acf leading-none mb-3 tracking-tight">
              16-24h
            </div>
            <div className="text-sm text-slate-600 leading-relaxed">
              thời gian lấy lại mỗi tháng
            </div>
          </Card>

          {/* Feature Card 1 */}
          <Card className="rounded-[20px] border-slate-200 bg-white transition-colors duration-300 hover:border-slate-300 col-span-4 md:col-span-4 p-8 flex flex-col justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-acf/10 text-accent-acf flex items-center justify-center">
              <Mic2 size={24} />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mt-2">
              Brand voice riêng
            </h3>
            <p className="text-base text-slate-600 leading-relaxed">
              Không generic. Hệ thống học giọng văn riêng của brand bạn qua 8 câu hỏi đơn giản.
            </p>
          </Card>

          {/* Feature Card 2 */}
          <Card className="rounded-[20px] border-slate-200 bg-white transition-colors duration-300 hover:border-slate-300 col-span-4 md:col-span-8 p-8 flex flex-col justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-acf/10 text-accent-acf flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mt-2">
              Workflow đã tested production
            </h3>
            <p className="text-base text-slate-600 leading-relaxed">
              Workflow đã viết hơn 100 bài cho Vietnam Society of Excellence. Giờ mở cho mọi chủ doanh nghiệp Việt Nam.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
