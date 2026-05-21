// Pain Section - 3 lớp vấn đề (bên ngoài, bên trong, triết lý)
// Source content: LANDING_CONTENT.md - Phần 2 BRIDGE
// Design: Bento Quad Grid, accent token accent-acf, light theme

import { Clock, BrainCog, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PainCardData {
  eyebrow: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PAIN_CARDS: PainCardData[] = [
  {
    eyebrow: "Vấn đề bên ngoài",
    icon: <Clock size={24} />,
    title: "4-6 giờ mỗi tuần biến mất",
    description:
      "Bạn ngồi nghĩ ý tưởng, viết caption, tìm hashtag. Tháng tốt ra 8-12 bài. Tháng bận: fanpage im lặng cả tuần. Đối thủ đăng đều hơn, follower họ lên còn của bạn đứng yên.",
  },
  {
    eyebrow: "Vấn đề bên trong",
    icon: <BrainCog size={24} />,
    title: "3 lựa chọn đều không ổn",
    description:
      "Freelancer 5-8 triệu/tháng: viết không đúng giọng brand. Agency 15-25 triệu/tháng: chậm, không hiểu ngành. ChatGPT: ra bài generic, ai đọc cũng biết là AI viết.",
  },
  {
    eyebrow: "Vấn đề triết lý",
    icon: <Target size={24} />,
    title: "Marketing đang bòn rút thời gian của bạn",
    description:
      "Một chủ doanh nghiệp xứng đáng tập trung vào sản phẩm, khách hàng, mở rộng kinh doanh. Không phải dành buổi tối ngồi viết caption Facebook.",
  },
];

export function PainSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <Badge
            variant="outline"
            className="border-accent-acf text-accent-acf"
          >
            Bạn có quen?
          </Badge>
          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 leading-[1.25] tracking-tight mt-4 mb-4"
            style={{ wordBreak: "keep-all" }}
          >
            3 vấn đề kéo dài năm này qua năm khác
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            Nếu một trong những điều dưới đây nghe quen, có nghĩa là bạn đang trả giá đắt cho việc thiếu hệ thống content.
          </p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-12 gap-4 md:gap-6">
          {PAIN_CARDS.map((card) => (
            <Card
              key={card.title}
              className="col-span-4 md:col-span-4 rounded-[20px] border-slate-200 bg-white p-6 md:p-8 transition-colors duration-300 hover:border-slate-300 flex flex-col gap-4"
            >
              <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                {card.eyebrow}
              </span>
              <div className="w-12 h-12 rounded-xl bg-accent-acf/10 text-accent-acf flex items-center justify-center">
                {card.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug">
                {card.title}
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                {card.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
