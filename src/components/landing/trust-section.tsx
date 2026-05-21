// Trust Section - trust gate ngay sau Hero
// Server Component: giai toa nghi ngo ve founder truoc khi vao phan van de
// Design: light theme, accent token accent-acf

import { Badge } from "@/components/ui/badge";

interface ProofCard {
  stat: string;
  caption: string;
}

const PROOF_CARDS: ProofCard[] = [
  {
    stat: "100+",
    caption: "bài viết đã tạo cho VSE và Ladysfit trong 6 tháng qua",
  },
  {
    stat: "2",
    caption:
      "brand pilot đang dùng hệ thống mỗi ngày — Vietnam Society of Excellence và Ladysfit",
  },
  {
    stat: "8/10",
    caption:
      "câu hỏi đơn giản để hệ thống học giọng văn của brand bạn, mất ~10 phút",
  },
];

export function TrustSection() {
  return (
    <section className="w-full bg-white py-16 px-4 md:py-24 md:px-6">
      <div className="max-w-5xl mx-auto">
        <Badge
          variant="outline"
          className="border-accent-acf text-accent-acf mb-3"
        >
          Ai đứng sau
        </Badge>
        <h2
          className="text-3xl md:text-4xl font-bold text-slate-900 leading-[1.25] tracking-tight mb-4"
          style={{ wordBreak: "keep-all" }}
        >
          Sản phẩm không phải code Tây bỏ đi
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mb-12">
          ACF được build bởi founder Việt cho SMB Việt. Đã chạy production cho 2
          brand thật trước khi mở cho anh chị.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Cột trái — Founder card */}
          <div>
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-slate-300 bg-gradient-to-br from-slate-200 to-slate-300">
              <span className="text-2xl font-bold text-slate-700">VH</span>
            </div>
            {/* TODO: Replace với ảnh thật src/public/founder.jpg khi có */}
            <h3 className="text-xl font-bold text-slate-900 mt-4">
              Em là Vũ Hải
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Chairman Vietnam Society of Excellence, CEO Ladysfit
            </p>
            <p className="text-base text-slate-700 leading-relaxed mt-4 max-w-md">
              Em làm ACF vì chính em từng mất 6-8 giờ mỗi tuần viết content cho 2
              brand. Sau khi build hệ thống cho VSE và Ladysfit, em mở cho mọi
              chủ doanh nghiệp Việt Nam có cùng vấn đề.
            </p>
          </div>

          {/* Cột phải — Proof stack */}
          <div className="flex flex-col gap-4">
            {PROOF_CARDS.map((card) => (
              <div
                key={card.stat}
                className="rounded-xl border border-slate-100 bg-slate-50 p-5"
              >
                <div className="font-mono text-3xl font-bold text-accent-acf">
                  {card.stat}
                </div>
                <p className="text-sm text-slate-700 mt-1">{card.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
