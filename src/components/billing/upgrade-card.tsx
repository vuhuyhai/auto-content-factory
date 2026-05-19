'use client';

import { useEffect, useState, useTransition } from 'react';
import { Check } from 'lucide-react';
import { startTrial, createPaymentLink } from '@/lib/payos/actions';

type ToastState = { type: 'success' | 'error'; msg: string } | null;

interface PlanOption {
  tier: 'starter' | 'pro';
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

const PLANS: PlanOption[] = [
  {
    tier: 'starter',
    name: 'Starter',
    price: '199.000đ',
    description: 'Cho freelancer, coach, chủ shop nhỏ',
    features: [
      '5 workflow tự động',
      '90 bài viết mỗi tháng',
      'Email digest hằng ngày',
    ],
    highlighted: false,
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: '399.000đ',
    description: 'Cho chủ chuỗi, SMB và team marketing',
    features: [
      '3 brand voice',
      'Workflow và bài viết không giới hạn',
      'Hỗ trợ ưu tiên',
    ],
    highlighted: true,
  },
];

export function UpgradeCard() {
  const [isPending, startActionTransition] = useTransition();
  const [toast, setToast] = useState<ToastState>(null);
  const [pendingTier, setPendingTier] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  function handleStartTrial(tier: 'starter' | 'pro') {
    setPendingTier(tier);
    startActionTransition(async () => {
      const result = await startTrial(tier);
      setPendingTier(null);
      if (result.success) {
        setToast({ type: 'success', msg: 'Đã bắt đầu dùng thử 7 ngày!' });
      } else {
        setToast({ type: 'error', msg: result.error ?? 'Có lỗi xảy ra' });
      }
    });
  }

  function handlePay(tier: 'starter' | 'pro') {
    setPendingTier(tier);
    startActionTransition(async () => {
      const result = await createPaymentLink(tier);
      setPendingTier(null);
      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        setToast({ type: 'error', msg: result.error ?? 'Có lỗi xảy ra' });
      }
    });
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-slate-900 mb-1">
        Nâng cấp gói
      </h2>
      <p className="text-sm text-slate-500 mb-5">
        Dùng thử 7 ngày miễn phí, hoặc thanh toán ngay để mở khóa đầy đủ tính năng.
      </p>

      {toast && (
        <div
          className={`mb-4 rounded-lg px-4 py-2 text-sm ${
            toast.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PLANS.map((plan) => (
          <div
            key={plan.tier}
            className={`rounded-xl border bg-white p-6 flex flex-col gap-4 ${
              plan.highlighted
                ? 'border-accent-acf border-2'
                : 'border-slate-200'
            }`}
          >
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {plan.name}
              </h3>
              <p className="text-sm text-slate-500">{plan.description}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">
                {plan.price}
              </span>
              <span className="text-sm text-slate-500">mỗi tháng</span>
            </div>
            <ul className="flex flex-col gap-2 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2 items-start text-sm text-slate-700">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-accent-acf" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleStartTrial(plan.tier)}
                disabled={isPending}
                className="w-full rounded-lg bg-accent-acf px-4 py-2 text-sm font-semibold text-white hover:bg-accent-acf/90 disabled:opacity-50"
              >
                {pendingTier === plan.tier && isPending
                  ? 'Đang xử lý...'
                  : 'Bắt đầu dùng thử 7 ngày'}
              </button>
              <button
                onClick={() => handlePay(plan.tier)}
                disabled={isPending}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Thanh toán ngay
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
