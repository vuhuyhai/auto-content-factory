import { getCurrentUserSubscription } from '@/lib/payos/queries';
import { UpgradeCard } from './upgrade-card';

/**
 * Server Component: doc subscription hien tai cua user, quyet dinh
 * hien khoi nang cap nhu the nao.
 * - Pro dang active: an han.
 * - Starter dang active: chi moi len Pro.
 * - Con lai (Free, trialing, chua co goi): hien ca hai goi.
 */
export async function UpgradeSection() {
  const sub = await getCurrentUserSubscription();

  const isActivePro = sub?.tier === 'pro' && sub?.status === 'active';
  const isActiveStarter = sub?.tier === 'starter' && sub?.status === 'active';

  if (isActivePro) {
    return null;
  }

  if (isActiveStarter) {
    return (
      <UpgradeCard
        visibleTiers={['pro']}
        subtitle="Bạn đang dùng gói Starter. Nâng lên Pro để mở khóa thêm tính năng."
      />
    );
  }

  return (
    <UpgradeCard
      visibleTiers={['starter', 'pro']}
      subtitle="Dùng thử 7 ngày miễn phí, hoặc thanh toán ngay để mở khóa đầy đủ tính năng."
    />
  );
}
