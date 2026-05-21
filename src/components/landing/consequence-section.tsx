// Consequence Section - 3 timeline (6 tháng, 1 năm, 5 năm)
// Source content: LANDING_CONTENT.md - Phần 3 BRIDGE (Amplify)
// Design: Vertical timeline, accent token accent-acf, slate-100 background (warning tone)

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TimelineCardData {
  timeline: string;
  title: string;
  description: string;
  statValue: string;
  statLabel: string;
}

const TIMELINE_CARDS: TimelineCardData[] = [
  {
    timeline: "6 THÁNG TỚI",
    title: "Đối thủ build xong tệp follower trung thành",
    description:
      "Họ đăng đều 3 bài/tuần. Fanpage của bạn vẫn lác đác bài. Organic reach tụt xuống dưới 5%. Khách hàng cũ quên dần thương hiệu của bạn vì không thấy mặt trên feed.",
    statValue: "<5%",
    statLabel: "organic reach",
  },
  {
    timeline: "1 NĂM TỚI",
    title: "Quảng cáo của bạn đắt gấp 2-3 lần đối thủ",
    description:
      "Để chạy quảng cáo Facebook hiệu quả, fanpage phải có độ \"ấm\" - đăng đều và có tương tác. Page yếu thì cost cao. Mỗi tháng bạn đốt thêm 5-10 triệu chỉ để bù cho việc không có content.",
    statValue: "5-10tr/tháng",
    statLabel: "đốt thêm vì page yếu",
  },
  {
    timeline: "5 NĂM TỚI",
    title: "Đối thủ có thương hiệu cá nhân rõ ràng. Bạn thì không.",
    description:
      "Họ được khách hàng tin tưởng, được báo chí phỏng vấn, được mời nói chuyện sự kiện ngành. Bạn vẫn là \"anh chủ làm tốt nhưng ít người biết\". Cơ hội mở rộng, hợp tác, gọi vốn ít hơn vì thiếu sự hiện diện công khai.",
    statValue: "5 năm",
    statLabel: "cộng dồn không bao giờ lấy lại được",
  },
];

export function ConsequenceSection() {
  return (
    <section className="w-full bg-slate-100 py-16 md:py-24 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <Badge
            variant="outline"
            className="border-accent-acf text-accent-acf"
          >
            Cảnh báo
          </Badge>
          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 leading-[1.25] tracking-tight mt-4 mb-4"
            style={{ wordBreak: "keep-all" }}
          >
            Cái giá thật của việc trì hoãn
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            Mỗi tuần bạn không hành động là một mảng thương hiệu không được xây. Đây là 5 năm cộng dồn nếu để vấn đề kéo dài.
          </p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-12 gap-4 md:gap-6 mb-12">
          {TIMELINE_CARDS.map((card) => (
            <Card
              key={card.timeline}
              className="col-span-4 md:col-span-12 rounded-[20px] border-slate-200 bg-white p-6 md:p-10 transition-colors duration-300 hover:border-slate-300"
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                <div className="flex-1 flex flex-col gap-3">
                  <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-accent-acf">
                    {card.timeline}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-base text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="md:w-64 flex flex-col items-start md:items-end gap-1 md:border-l md:border-slate-200 md:pl-8">
                  <span className="text-3xl md:text-4xl font-bold text-accent-acf tracking-tight">
                    {card.statValue}
                  </span>
                  <span className="text-sm text-slate-500 leading-relaxed md:text-right">
                    {card.statLabel}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-12 mt-4">
          <p className="text-center text-lg md:text-xl italic text-slate-700 leading-relaxed max-w-3xl mx-auto">
            Cái giá của việc trì hoãn không phải là &quot;thiếu vài bài Facebook&quot;. Mà là 5 năm cộng dồn của một thương hiệu không bao giờ được xây.
          </p>
        </div>
      </div>
    </section>
  );
}
