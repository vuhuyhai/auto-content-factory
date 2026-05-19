import Link from 'next/link';
import { getCurrentUserSubscription } from '@/lib/payos/queries';

/** So ngay con lai cua trial, lam tron len. Am hoac 0 nghia la het han. */
function daysLeft(trialEnd: string): number {
  const end = new Date(trialEnd).getTime();
  const now = Date.now();
  return Math.ceil((end - now) / (24 * 60 * 60 * 1000));
}

export async function TrialBanner() {
  const sub = await getCurrentUserSubscription();

  // Da tra tien - khong hien banner
  if (sub && sub.status === 'active') return null;

  // Dang trial
  if (sub && sub.status === 'trialing' && sub.trial_end) {
    const left = daysLeft(sub.trial_end);

    if (left > 0) {
      return (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
          <p className="text-sm text-amber-800">
            Bạn đang dùng thử, còn{' '}
            <span className="font-semibold">{left} ngày</span>. Nâng cấp để giữ
            đầy đủ tính năng.
          </p>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-accent-acf hover:underline shrink-0"
          >
            Nâng cấp ngay
          </Link>
        </div>
      );
    }

    // Trial het han
    return (
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
        <p className="text-sm text-red-700">
          Thời gian dùng thử đã kết thúc. Nâng cấp để tiếp tục sử dụng đầy đủ
          tính năng.
        </p>
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-accent-acf hover:underline shrink-0"
        >
          Nâng cấp ngay
        </Link>
      </div>
    );
  }

  // Chua co goi (free, chua trial) - banner moi dung thu
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
      <p className="text-sm text-slate-700">
        Dùng thử 7 ngày miễn phí để mở khóa toàn bộ tính năng tự động hoá content.
      </p>
      <Link
        href="/dashboard"
        className="text-sm font-semibold text-accent-acf hover:underline shrink-0"
      >
        Xem các gói
      </Link>
    </div>
  );
}
