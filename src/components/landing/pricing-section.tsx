// Pricing Section - 3 tier (Free / Starter / Pro)
// Cap nhat Day 23 M1: gia moi 199K/399K, tinh nang theo han muc + ban hang, trial 7 ngay
// Design: 3 card grid, Pro card highlighted voi border accent + badge "Phu hop nhat"

import { Check, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PricingTier {
  name: string;
  description: string;
  price: string;
  suffix: string;
  included: string[];
  excluded: string[];
  cta: { label: string; href: string };
  highlighted: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: "Free",
    description: "Thử trải nghiệm brand voice",
    price: "0đ",
    suffix: "Mãi mãi miễn phí",
    included: [
      "1 brand voice profile",
      "1 workflow tự động",
      "5 bài viết tự động mỗi tháng",
      "Xuất bài định dạng Facebook",
    ],
    excluded: [
      "Email digest hằng ngày",
      "Gợi ý prompt hình ảnh",
      "Hỗ trợ qua email",
    ],
    cta: { label: "Bắt đầu Free", href: "/signup" },
    highlighted: false,
  },
  {
    name: "Starter",
    description: "Cho freelancer, coach, chủ shop nhỏ",
    price: "199K",
    suffix: "mỗi tháng",
    included: [
      "1 brand voice profile",
      "5 workflow tự động",
      "90 bài viết tự động mỗi tháng",
      "Đủ 3 loại workflow: tin tức, thường xuyên, khuyến mãi",
      "Xuất bài định dạng Facebook + LinkedIn",
      "Gợi ý prompt hình ảnh",
      "Email digest hằng ngày",
      "Hỗ trợ qua email",
    ],
    excluded: [],
    cta: { label: "Nâng cấp Starter", href: "/signup?plan=starter" },
    highlighted: false,
  },
  {
    name: "Pro",
    description: "Cho chủ chuỗi, SMB và team marketing",
    price: "399K",
    suffix: "mỗi tháng",
    included: [
      "3 brand voice profile (nhiều thương hiệu)",
      "Workflow không giới hạn",
      "Bài viết tự động không giới hạn",
      "Đủ 3 loại workflow: tin tức, thường xuyên, khuyến mãi",
      "Xuất bài định dạng Facebook + LinkedIn",
      "Gợi ý prompt hình ảnh",
      "Email digest hằng ngày",
      "Hỗ trợ ưu tiên",
    ],
    excluded: [],
    cta: { label: "Đăng ký Pro", href: "/signup?plan=pro" },
    highlighted: true,
  },
];

export function PricingSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <Badge variant="outline" className="border-accent-acf text-accent-acf">
            Bảng giá
          </Badge>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.25] tracking-tight mt-4 mb-4"
            style={{ wordBreak: "keep-all" }}
          >
            3 gói linh hoạt, dùng được ngay hôm nay
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            Bắt đầu miễn phí, hoặc dùng thử 7 ngày đầy đủ tính năng. Đổi gói linh hoạt mỗi tháng, không cam kết dài hạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PRICING_TIERS.map((tier) => (
            <Card
              key={tier.name}
              className={`rounded-[20px] border-slate-200 bg-white p-8 flex flex-col gap-6 h-full transition-colors duration-300 hover:border-slate-300 relative ${tier.highlighted ? "border-accent-acf border-2 shadow-lg shadow-accent-acf/10 scale-100 md:scale-105" : ""}`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-acf text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wider">
                  Phù hợp nhất
                </span>
              )}

              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold text-slate-900">{tier.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{tier.description}</p>
              </div>

              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">{tier.price}</span>
                <span className="text-sm text-slate-500">{tier.suffix}</span>
              </div>

              <ul className="flex flex-col gap-3 flex-1">
                {tier.included.map((text) => (
                  <li key={text} className="flex gap-3 items-start">
                    <Check className={`w-5 h-5 shrink-0 mt-0.5 ${tier.name === "Free" ? "text-slate-400" : "text-accent-acf"}`} />
                    <span className="text-sm text-slate-700 leading-relaxed">{text}</span>
                  </li>
                ))}
                {tier.excluded.map((text) => (
                  <li key={text} className="flex gap-3 items-start">
                    <X className="w-5 h-5 shrink-0 mt-0.5 text-slate-300" />
                    <span className="text-sm text-slate-400 line-through leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 mt-auto">
                <Button
                  asChild
                  size="lg"
                  variant={tier.highlighted ? "default" : "outline"}
                  className={`w-full ${tier.highlighted ? "bg-accent-acf hover:bg-accent-acf/90 text-white" : ""}`}
                >
                  <Link href={tier.cta.href}>{tier.cta.label}</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}