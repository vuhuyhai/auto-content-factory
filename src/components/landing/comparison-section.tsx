// Comparison Section - ACF vs 4 alternative (Tự viết / Freelancer / Agency / ChatGPT)
// Server Component: không cần state, bảng tĩnh
// Anchor id="comparison" cho FAQ Q8 tham chiếu

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ComparisonOption {
  name: string;
  isHighlight?: boolean;
  values: string[];
}

const CRITERIA = [
  "Thời gian mỗi tuần",
  "Chi phí mỗi tháng",
  "Hiểu giọng brand",
  "Đăng đều mỗi tuần",
  "Tiếng Việt có dấu",
  "Chuyên môn ngành",
];

const OPTIONS: ComparisonOption[] = [
  {
    name: "Tự viết",
    values: [
      "4-6 giờ",
      "0đ + cơ hội bị mất",
      "✅ Tốt nhất",
      "❌ Phụ thuộc tâm trạng",
      "✅",
      "✅ Anh chị hiểu nhất",
    ],
  },
  {
    name: "Freelancer",
    values: [
      "1-2 giờ chỉnh sửa",
      "5-8 triệu",
      "⚠️ Phải brief lại mỗi tháng",
      "⚠️ Phụ thuộc freelancer",
      "✅",
      "⚠️ Tùy người",
    ],
  },
  {
    name: "Agency",
    values: [
      "30 phút duyệt",
      "15-25 triệu",
      "⚠️ Chậm, account hay đổi",
      "⚠️ Phụ thuộc agency",
      "✅",
      "⚠️ Junior viết",
    ],
  },
  {
    name: "ChatGPT",
    values: [
      "30 phút prompt + edit",
      "$20 + ChatGPT Plus",
      "❌ Generic, ai cũng giống ai",
      "❌ Phải tự ngồi prompt",
      "⚠️ Hay lai tiếng Anh",
      "❌ Generic",
    ],
  },
  {
    name: "ACF",
    isHighlight: true,
    values: [
      "5 phút duyệt",
      "199-399K",
      "✅ Học 1 lần, dùng mãi",
      "✅ Cron tự chạy 24/7",
      "✅ Native Việt",
      "✅ Brand voice profile",
    ],
  },
];

export function ComparisonSection() {
  return (
    <section
      id="comparison"
      className="w-full scroll-mt-20 bg-white py-16 px-4 md:py-24 md:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <Badge
            variant="outline"
            className="border-accent-acf text-accent-acf mb-3"
          >
            So sánh thẳng thắn
          </Badge>
          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 leading-[1.25] tracking-tight mb-4"
            style={{ wordBreak: "keep-all" }}
          >
            Tại sao ACF không phải lựa chọn thứ N của anh chị
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            5 cách phổ biến để có content. Tụi em so thẳng. Quyết định nào tốt
            cho anh chị, anh chị tự chọn.
          </p>
        </div>

        {/* DESKTOP: bảng 5 cột */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-4 md:px-6 text-left text-sm font-semibold text-slate-500">
                  Tiêu chí
                </th>
                {OPTIONS.map((option) => (
                  <th
                    key={option.name}
                    className={`px-4 py-4 md:px-6 text-left text-sm ${
                      option.isHighlight
                        ? "bg-accent-acf/5 border-l-2 border-r-2 border-accent-acf text-accent-acf font-bold"
                        : "text-slate-600 font-semibold"
                    }`}
                  >
                    {option.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CRITERIA.map((criterion, rowIndex) => (
                <tr
                  key={criterion}
                  className="border-b border-slate-200 last:border-b-0 transition-colors hover:bg-slate-50"
                >
                  <td className="px-4 py-4 md:px-6 text-sm font-medium text-slate-900">
                    {criterion}
                  </td>
                  {OPTIONS.map((option) => (
                    <td
                      key={option.name}
                      className={`px-4 py-4 md:px-6 text-sm leading-relaxed ${
                        option.isHighlight
                          ? "bg-accent-acf/5 border-l-2 border-r-2 border-accent-acf text-slate-900 font-medium"
                          : "text-slate-700"
                      }`}
                    >
                      {option.values[rowIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE: 5 card xếp dọc */}
        <div className="md:hidden flex flex-col gap-4">
          {OPTIONS.map((option) => (
            <div
              key={option.name}
              className={`rounded-2xl p-5 ${
                option.isHighlight
                  ? "border-2 border-accent-acf bg-accent-acf/5"
                  : "border border-slate-200"
              }`}
            >
              <h3
                className={`text-lg font-bold mb-3 ${
                  option.isHighlight ? "text-accent-acf" : "text-slate-900"
                }`}
              >
                {option.name}
              </h3>
              <div className="flex flex-col divide-y divide-slate-200">
                {CRITERIA.map((criterion, rowIndex) => (
                  <div
                    key={criterion}
                    className="flex justify-between gap-4 py-2.5"
                  >
                    <span className="text-xs text-slate-500 shrink-0">
                      {criterion}
                    </span>
                    <span className="text-sm text-slate-700 text-right">
                      {option.values[rowIndex]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-12 max-w-3xl mx-auto text-center">
          <p className="text-base md:text-lg text-slate-700 leading-relaxed italic">
            3 lựa chọn đầu phụ thuộc con người - nghỉ phép, bận việc, thay đổi
            quan điểm. ChatGPT phụ thuộc anh chị ngồi prompt mỗi ngày. ACF phụ
            thuộc 1 lần setup, sau đó hệ thống tự chạy.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-11 rounded-md px-8 bg-accent-acf hover:bg-[#d12d3a] text-white font-medium transition-colors"
            >
              Bắt đầu Free, không cần thẻ →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
