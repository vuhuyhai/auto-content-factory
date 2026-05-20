// Trang Chính sách bảo mật - public, prose tiếng Việt
import Link from "next/link";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật | Auto-Content Factory",
  description:
    "Cách Auto-Content Factory thu thập, sử dụng và bảo vệ dữ liệu cá nhân.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="text-lg font-semibold text-slate-900">
            Auto-Content Factory
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Chính sách bảo mật
          </h1>
          <p className="text-slate-600 mb-10 leading-relaxed">
            Chúng tôi tôn trọng quyền riêng tư của bạn. Tài liệu này giải thích
            cách Auto-Content Factory thu thập, sử dụng và bảo vệ dữ liệu cá
            nhân khi bạn sử dụng dịch vụ.
          </p>

          <section className="space-y-8 text-slate-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                1. Dữ liệu chúng tôi thu thập
              </h2>
              <p>
                Chúng tôi thu thập: địa chỉ email, tên (không bắt buộc), hồ sơ
                giọng thương hiệu (brand voice profile), content do bạn tạo ra,
                lịch sử thanh toán và log truy cập hệ thống.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                2. Mục đích sử dụng dữ liệu
              </h2>
              <p>
                Dữ liệu được dùng để: cung cấp và vận hành dịch vụ; gửi email
                giao dịch (transactional) như xác nhận tài khoản và thông báo
                thanh toán; cải thiện mô hình AI dựa trên dữ liệu đã ẩn danh
                (anonymized); và gửi email marketing nếu bạn chủ động đăng ký
                (opt-in).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                3. Bên thứ ba
              </h2>
              <p className="mb-3">
                Chúng tôi sử dụng một số nhà cung cấp dịch vụ để vận hành hệ
                thống:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Supabase — lưu trữ cơ sở dữ liệu và xác thực người dùng, máy
                  chủ đặt tại châu Âu.
                </li>
                <li>
                  Vercel — hạ tầng hosting, máy chủ đặt tại Mỹ và mạng lưới
                  edge toàn cầu.
                </li>
                <li>
                  PayOS — xử lý thanh toán, máy chủ đặt tại Việt Nam.
                </li>
                <li>
                  Resend — gửi email giao dịch.
                </li>
              </ul>
              <p className="mt-3">
                Mỗi nhà cung cấp có chính sách bảo mật riêng; bạn có thể tham
                khảo trực tiếp tại website của họ.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                4. Cookie
              </h2>
              <p>
                Chúng tôi chỉ sử dụng cookie cần thiết để duy trì phiên đăng
                nhập (session auth của Supabase). Nếu sau này bổ sung công cụ
                phân tích (analytics), chúng tôi sẽ cập nhật chính sách này
                tương ứng.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                5. Quyền của bạn
              </h2>
              <p>
                Bạn có quyền: truy cập, chỉnh sửa, xóa dữ liệu cá nhân; xuất
                (export) dữ liệu của mình; và rút lại sự đồng ý đã cấp. Để thực
                hiện các quyền này, vui lòng liên hệ{" "}
                <a
                  href="mailto:hello@autocontent.online"
                  className="text-accent-acf hover:underline"
                >
                  hello@autocontent.online
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                6. Lưu trữ và bảo mật
              </h2>
              <p>
                Dữ liệu được mã hoá khi lưu trữ (at rest) thông qua hạ tầng
                quản lý của Supabase. Toàn bộ website sử dụng kết nối HTTPS.
                Các bảng chứa dữ liệu cá nhân được bảo vệ bằng Row Level
                Security (RLS).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                7. Trẻ em dưới 16 tuổi
              </h2>
              <p>
                Chúng tôi không chủ ý thu thập dữ liệu của trẻ em dưới 16 tuổi.
                Nếu phát hiện dữ liệu thuộc nhóm này, chúng tôi sẽ xóa ngay lập
                tức.
              </p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-slate-200 text-sm text-slate-500">
            <p>Cập nhật lần cuối: 20/5/2026.</p>
            <p className="mt-1">
              Liên hệ phụ trách bảo vệ dữ liệu (DPO):{" "}
              <a
                href="mailto:hello@autocontent.online"
                className="text-accent-acf hover:underline"
              >
                hello@autocontent.online
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
