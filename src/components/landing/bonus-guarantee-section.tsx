// Bonus + Guarantee + Scarcity Section
// Source content: LANDING_CONTENT.md - Phần 7 BRIDGE (bonus + guarantee + scarcity + total value)
// Design: 3 bonus card + Guarantee callout + Scarcity warning + Total value (slate-900 dark)

import { Users, BookOpen, MessagesSquare, ShieldCheck, AlarmClock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BonusCardData {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: string;
}

const BONUS_CARDS: BonusCardData[] = [
  {
    icon: <Users size={24} />,
    title: "Buổi tư vấn 1-1 với founder",
    description: "60 phút làm việc trực tiếp với Vũ Hải. Audit brand voice của bạn, xây roadmap content 90 ngày.",
    value: "Giá trị 3 triệu",
  },
  {
    icon: <BookOpen size={24} />,
    title: "Template 12 chủ đề evergreen",
    description: "12 chủ đề content luôn được khách hàng quan tâm trong ngành của bạn. Viết sẵn dạng draft, chỉ cần điều chỉnh.",
    value: "Giá trị 1.5 triệu",
  },
  {
    icon: <MessagesSquare size={24} />,
    title: "ACF Founders Circle",
    description: "Group riêng chia sẻ workflow, prompt, case study giữa các chủ doanh nghiệp đang dùng ACF. Networking giữa founders cùng tệp.",
    value: "Giá trị 1 triệu/năm",
  },
];

const TOTAL_VALUE_ITEMS = [
  { label: "Pro tháng đầu", value: "Hệ thống viết content tự động" },
  { label: "3 bonus", value: "Giá trị 5.5 triệu" },
  { label: "Bảo đảm hoàn tiền", value: "14 ngày dùng thử rủi ro bằng 0" },
];

export function BonusGuaranteeSection() {
  return (
    <section className="w-full bg-slate-50 py-20 md:py-32 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <Badge variant="outline" className="border-[#E63946] text-[#E63946]">
            Bonus đặc biệt
          </Badge>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.25] tracking-tight mt-4 mb-4"
            style={{ wordBreak: "keep-all" }}
          >
            Dành cho 100 người đăng ký Pro đầu tiên
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            Đăng ký Pro trong tháng này nhận thêm 3 bonus tổng giá trị 5.5 triệu, không tính phí thêm.
          </p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-12 gap-4 md:gap-6 mb-12">
          {BONUS_CARDS.map((card) => (
            <Card
              key={card.title}
              className="col-span-4 md:col-span-4 rounded-[20px] border-slate-200 bg-white p-6 md:p-8 flex flex-col gap-4 transition-colors duration-300 hover:border-slate-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E63946]/10 text-[#E63946] flex items-center justify-center">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{card.title}</h3>
              <p className="text-base text-slate-600 leading-relaxed flex-1">{card.description}</p>
              <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#E63946] mt-auto">
                {card.value}
              </span>
            </Card>
          ))}
        </div>

        <div className="rounded-[20px] bg-white border-2 border-[#E63946]/20 p-8 md:p-12 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#E63946]/10 flex items-center justify-center shrink-0">
            <ShieldCheck size={48} className="text-[#E63946]" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
              Bảo đảm hoàn tiền 14 ngày
            </h3>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              Dùng thử Pro trong 14 ngày đầu. Nếu không thấy hệ thống hiểu giọng brand, không thấy bài viết đăng được lên Facebook hoặc LinkedIn, hoàn lại 100% phí. Không hỏi lý do. Email một dòng là xong.
            </p>
          </div>
        </div>

        <div className="rounded-[20px] bg-[#E63946]/5 border border-[#E63946]/20 p-6 mb-8 flex gap-3 items-start">
          <AlarmClock size={20} className="text-[#E63946] shrink-0 mt-1" />
          <p className="text-sm md:text-base text-slate-700 leading-relaxed">
            Bonus 100 suất chỉ áp dụng cho người đăng ký Pro trong tháng này. Sau ngày 30/06/2026, chỉ còn giá Pro thuần, không có 3 bonus đi kèm.
          </p>
        </div>

        <div className="rounded-[20px] bg-slate-900 text-white p-8 md:p-12 flex flex-col gap-6">
          <h3 className="text-2xl md:text-3xl font-semibold mb-2">Tổng giá trị bạn nhận</h3>
          <div className="flex flex-col gap-3">
            {TOTAL_VALUE_ITEMS.map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-baseline text-base md:text-lg border-b border-slate-700 pb-3 last:border-b-0"
              >
                <span className="text-slate-300">{item.label}</span>
                <span className="text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
          <p className="text-xl md:text-2xl font-bold text-[#E63946] mt-2">
            Tất cả chỉ với 999K cho tháng đầu tiên
          </p>
          <Button
            asChild
            size="lg"
            className="w-full md:w-auto md:self-start bg-[#E63946] hover:bg-[#d12d3a] text-white"
          >
            <Link href="/signup?plan=pro&bonus=true">
              Đăng ký Pro nhận bonus
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
