"use client";

// FAQ Section - 8 objection phổ biến nhất của SMB Việt
// Client Component: accordion native dùng React.useState (KHÔNG dùng shadcn Accordion)
// Anchor id="faq" cho sticky nav Day 27 scroll tới

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'AI viết có generic như ChatGPT không?',
    answer: 'Không. ChatGPT không biết brand của anh là ai, viết cho audience nào, dùng từ ngữ gì. ACF học giọng brand qua 8 câu hỏi (hình mẫu thương hiệu, tone, từ "có dùng" và "tránh dùng", chủ đề chuyên môn). Mỗi bài generate ra đều mang chữ ký riêng. Anh xem 3 sample bài Việt phía trên - 3 giọng hoàn toàn khác nhau từ cùng 1 hệ thống.',
  },
  {
    question: 'Hệ thống học giọng brand của tôi như nào?',
    answer: 'Onboarding 10 phút có 8 câu hỏi đơn giản. Hệ thống map câu trả lời thành brand voice profile (12 hình mẫu thương hiệu + tone + từ vựng nên/không nên dùng). Profile này dùng làm context mỗi lần AI viết bài. Anh có thể chỉnh sửa profile bất cứ lúc nào trong dashboard.',
  },
  {
    question: 'Mất bao lâu để có bài đầu tiên?',
    answer: 'Khoảng 11-12 phút. 10 phút onboarding, 1 phút setup workflow (chọn nguồn tin hoặc chủ đề), 60-90 giây hệ thống generate bài đầu tiên. Anh sẽ thấy 3 variants để chọn cho từng bài.',
  },
  {
    question: 'Tôi có thể chỉnh sửa bài trước khi đăng không?',
    answer: 'Có. Mỗi bài có 3 variants, anh chọn 1 variant tốt nhất rồi edit inline 4 field (hook, title, body, hashtag). Sau khi approved trong dashboard, anh copy text sang Facebook hoặc LinkedIn để đăng. Tính năng tự động đăng bài lên Facebook sẽ ra mắt tháng 6/2026.',
  },
  {
    question: 'Có hỗ trợ tiếng Việt có dấu chuẩn không?',
    answer: 'Có, đây là core feature. ACF được build cho SMB Việt Nam. Hệ thống dùng Claude Sonnet 4.6, model tiếng Việt mạnh nhất hiện tại. Mọi bài đều có dấu chuẩn, không lai tiếng Anh kệch cỡm. Hashtag tiếng Việt cũng được normalize đúng.',
  },
  {
    question: 'Hủy gói có dễ không?',
    answer: 'Rất dễ. Login dashboard, vào Settings, click Cancel subscription, xong trong 1 click. Không phải gọi điện, không phải email xin phép. Anh hủy bất cứ lúc nào, không cam kết dài hạn.',
  },
  {
    question: 'Nếu tôi không hài lòng?',
    answer: 'Bảo đảm hoàn tiền với gói Pro trong 7 ngày dùng thử miễn phí. Nếu trong 7 ngày anh thấy hệ thống không hiểu giọng brand, không thấy bài đăng được, hủy luôn, không phải trả đồng nào. Sau 7 ngày trial, gói Free vẫn dùng được mãi mãi miễn phí.',
  },
  {
    question: 'Khác gì so với thuê freelancer 5 triệu?',
    answer: '3 điểm khác. Một là tốc độ: freelancer 1-2 ngày mỗi bài, ACF 60-90 giây. Hai là nhất quán: freelancer mỗi người 1 giọng, ACF 1 brand voice duy nhất. Ba là chi phí: freelancer 5-8 triệu mỗi tháng, ACF Pro 399K. Bảng so sánh chi tiết với agency và ChatGPT có ở section bên dưới.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="w-full scroll-mt-20 bg-white py-16 px-4 md:py-24 md:px-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="border-accent-acf text-accent-acf mb-3"
          >
            Câu hỏi thường gặp
          </Badge>
          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 leading-[1.25] tracking-tight mb-4"
            style={{ wordBreak: "keep-all" }}
          >
            8 câu hỏi anh chị hay hỏi nhất
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            Nếu không tìm thấy câu trả lời ở đây, email fitnessviet@gmail.com em
            trả lời trong 24 giờ.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 px-4 md:px-6">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="border-b border-slate-200 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-base md:text-lg font-semibold text-slate-900">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-slate-500 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 pb-5" : "max-h-0"
                  }`}
                >
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
