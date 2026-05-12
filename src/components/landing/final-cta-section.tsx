// Final CTA Section + PS (BRIDGE Phần 8)
// Source content: LANDING_CONTENT.md
// Design: Center callout với border accent, PS italic dưới callout

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function FinalCtaSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 md:px-12">
        <div className="rounded-[20px] border-2 border-[#E63946]/20 bg-white p-8 md:p-16 text-center flex flex-col gap-6 items-center mb-12 shadow-lg shadow-[#E63946]/5">
          <Badge variant="outline" className="border-[#E63946]/40 text-[#E63946]">
            Hành động
          </Badge>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.25] tracking-tight"
            style={{ wordBreak: "keep-all" }}
          >
            Bắt đầu trong 10 phút. Không cam kết gì.
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Tạo brand voice trong 10 phút. Xem hệ thống viết ra bài đầu tiên. Nếu thấy đúng giọng mình, nâng cấp. Nếu không, bạn không mất gì.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              asChild
              size="lg"
              className="bg-[#E63946] hover:bg-[#d12d3a] text-white"
            >
              <Link href="/signup?plan=pro&bonus=true">
                Đăng ký Pro - nhận 3 bonus 5.5 triệu
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup">Bắt đầu Free, không cần thẻ</Link>
            </Button>
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm md:text-base italic text-slate-600 leading-relaxed">
            Mỗi tuần bạn chần chừ là một tuần fanpage tiếp tục im lặng và đối thủ tiếp tục bỏ xa. Đăng ký Free không có nghĩa là cam kết. Tạo brand voice trong <strong className="text-slate-900">10 phút</strong>. Xem hệ thống viết ra bài đầu tiên. Nếu thấy đúng giọng mình, nâng cấp. Nếu không, bạn không mất gì. Nhưng nếu thấy đúng, đó có thể là <strong className="text-slate-900">10 phút thay đổi cách bạn làm marketing trong 5 năm tới</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
