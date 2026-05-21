// Trust Section - trust gate ngay sau Hero
// Server Component: giai toa nghi ngo ve founder truoc khi vao phan van de
// Design: light theme, accent token accent-acf

import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface CredentialCard {
  type: "stat" | "role";
  stat?: string;
  label?: string;
  caption: string;
}

const CREDENTIAL_CARDS: CredentialCard[] = [
  {
    type: "stat",
    stat: "18 năm",
    caption: "khởi nghiệp + 8 năm tư vấn và đào tạo doanh nghiệp",
  },
  {
    type: "role",
    label: "CEO & Co-Founder",
    caption: "Ladysfit Việt Nam",
  },
  {
    type: "role",
    label: "Chủ tịch HĐQT",
    caption: "VSE (Vietnam Society of Excellence)",
  },
  {
    type: "role",
    label: "Certified",
    caption: "Content Marketing Strategy của CMI × AMA",
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
          ACF được build bởi founder Việt cho SMB Việt. Tôi build từ chính kinh
          nghiệm vận hành đa kênh content cho nhiều brand trước khi mở rộng cho
          bạn.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Cột trái — Founder card */}
          <div>
            <Image
              src="/founder/vu-hai.jpg"
              alt="Vũ Hải - Chuyên gia tư vấn vận hành doanh nghiệp, founder Auto-Content Factory"
              width={200}
              height={200}
              priority
              className="h-48 w-48 rounded-3xl object-cover border-2 border-slate-200"
            />
            <h3 className="text-xl font-bold text-slate-900 mt-4">
              Tôi là Vũ Hải
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Chuyên gia tư vấn vận hành doanh nghiệp
            </p>
            <p className="text-base text-slate-700 leading-relaxed mt-4 max-w-md">
              Tôi từng quản trị đồng thời 8 fanpage Facebook với hơn 50.000 lượt
              theo dõi mỗi page, và 10 website với hơn 30.000 lượt truy cập mỗi
              tháng. Mỗi tuần mất 30-40 giờ chỉ để giữ content đều và đúng giọng
              từng brand. ACF được build từ chính đau đầu này, sau khi tôi nhận
              ra hệ thống có thể làm 80% công việc, con người chỉ cần làm 20%
              quan trọng nhất.
            </p>
          </div>

          {/* Cột phải — Credentials grid 2x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CREDENTIAL_CARDS.map((card, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                {card.type === "stat" ? (
                  <div className="font-mono text-3xl font-bold text-accent-acf leading-tight">
                    {card.stat}
                  </div>
                ) : (
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent-acf">
                    {card.label}
                  </div>
                )}
                <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                  {card.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
