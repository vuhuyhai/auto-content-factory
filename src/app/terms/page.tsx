// Trang Điều khoản sử dụng - public, prose tiếng Việt
import Link from "next/link";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng | Auto-Content Factory",
  description: "Điều khoản và điều kiện khi sử dụng Auto-Content Factory.",
};

export default function TermsPage() {
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
            Điều khoản sử dụng
          </h1>
          <p className="text-slate-600 mb-10 leading-relaxed">
            Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng
            Auto-Content Factory. Khi tạo tài khoản hoặc sử dụng dịch vụ, bạn
            đồng ý tuân thủ toàn bộ điều khoản này.
          </p>

          <section className="space-y-8 text-slate-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                1. Định nghĩa
              </h2>
              <p>
                “Auto-Content Factory” (gọi tắt là “Dịch vụ”) là nền tảng giúp
                doanh nghiệp tự động hoá việc viết content social theo giọng
                thương hiệu riêng. “Người dùng” là cá nhân hoặc tổ chức truy
                cập và sử dụng Dịch vụ. “Tài khoản” là hồ sơ đăng nhập gắn với
                một địa chỉ email duy nhất.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                2. Điều kiện tài khoản
              </h2>
              <p>
                Bạn phải đủ 18 tuổi để tạo tài khoản. Bạn cam kết cung cấp
                thông tin chính xác và cập nhật khi có thay đổi. Bạn chịu trách
                nhiệm bảo mật mật khẩu và mọi hoạt động phát sinh từ tài khoản
                của mình. Mỗi người chỉ được sử dụng một tài khoản.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                3. Sử dụng dịch vụ
              </h2>
              <p className="mb-3">
                Bạn được phép sử dụng Dịch vụ để tạo, chỉnh sửa và quản lý
                content phục vụ hoạt động kinh doanh hợp pháp của mình.
              </p>
              <p>
                Bạn không được phép: gửi thư rác (spam); phát tán mã độc
                (malware); vi phạm bản quyền của bên thứ ba; tạo nội dung khiêu
                dâm hoặc bạo lực; hoặc bất kỳ hành vi nào vi phạm pháp luật Việt
                Nam.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                4. Thanh toán
              </h2>
              <p>
                Dịch vụ cung cấp gói Free và gói Pro. Gói Pro tính phí theo chu
                kỳ tháng và được thanh toán qua cổng PayOS. Gói sẽ tự động gia
                hạn vào cuối mỗi chu kỳ. Bạn có thể hủy gia hạn bất kỳ lúc nào
                trong phần cài đặt tài khoản.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                5. Hoàn tiền
              </h2>
              <p>
                Bạn có thể yêu cầu hoàn tiền trong vòng 7 ngày kể từ khi thanh
                toán, với điều kiện chưa sử dụng quá 10% hạn mức (quota) của
                gói. Chúng tôi không hoàn tiền cho phần dịch vụ đã được sử dụng.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                6. Sở hữu trí tuệ
              </h2>
              <p>
                Toàn bộ mã nguồn, giao diện và thương hiệu của Dịch vụ thuộc
                quyền sở hữu của Vũ Hải. Content do bạn tạo ra thông qua Dịch vụ
                thuộc quyền sở hữu của bạn; Auto-Content Factory chỉ có quyền
                lưu trữ và xử lý content đó theo yêu cầu của bạn.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                7. Giới hạn trách nhiệm
              </h2>
              <p>
                Dịch vụ được cung cấp theo hiện trạng (“as-is”). Chúng tôi
                không bảo đảm hệ thống hoạt động liên tục 100% thời gian và
                không chịu trách nhiệm cho các thiệt hại gián tiếp phát sinh.
                Nội dung do AI tạo ra có thể có sai sót; bạn có trách nhiệm tự
                kiểm duyệt trước khi xuất bản.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                8. Luật áp dụng
              </h2>
              <p>
                Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Toà
                án có thẩm quyền giải quyết tranh chấp là toà án tại TP. Cần
                Thơ. Mọi tranh chấp sẽ được ưu tiên giải quyết bằng thương lượng
                trước khi khởi kiện.
              </p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-slate-200 text-sm text-slate-500">
            <p>Cập nhật lần cuối: 20 tháng 5, 2026.</p>
            <p className="mt-1">
              Liên hệ:{" "}
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
