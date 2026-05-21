'use client';

import { useActionState, useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { startTrial, createPaymentLink } from '@/lib/payos/actions';

type ToastState = { type: 'success' | 'error'; msg: string } | null;

type TrialState = {
  success: boolean;
  error: string | null;
  tier: 'starter' | 'pro' | null;
};

type PayState = {
  success: boolean;
  error: string | null;
  tier: 'starter' | 'pro' | null;
  checkoutUrl: string | null;
};

const INITIAL_TRIAL_STATE: TrialState = {
  success: false,
  error: null,
  tier: null,
};

const INITIAL_PAY_STATE: PayState = {
  success: false,
  error: null,
  tier: null,
  checkoutUrl: null,
};

/**
 * Wrapper cho startTrial: form action nhan (prevState, FormData).
 * Doc tier tu hidden input roi goi Server Action goc.
 */
async function startTrialActionWrapper(
  prevState: TrialState,
  formData: FormData
): Promise<TrialState> {
  const tier = formData.get('tier') as string;
  const result = await startTrial(tier);
  return {
    success: result.success,
    error: result.error ?? null,
    tier: tier as 'starter' | 'pro',
  };
}

/**
 * Wrapper cho createPaymentLink: form action nhan (prevState, FormData).
 */
async function createPaymentLinkWrapper(
  prevState: PayState,
  formData: FormData
): Promise<PayState> {
  const tier = formData.get('tier') as string;
  const result = await createPaymentLink(tier);
  return {
    success: result.success,
    error: result.error ?? null,
    tier: tier as 'starter' | 'pro',
    checkoutUrl: result.checkoutUrl ?? null,
  };
}

interface PlanOption {
  tier: 'starter' | 'pro';
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

const ALL_PLANS: PlanOption[] = [
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

interface UpgradeCardProps {
  /** Cac goi duoc phep hien thi. Component cha quyet dinh dua tren tier hien tai. */
  visibleTiers: ('starter' | 'pro')[];
  /** Tieu de phu, doi theo trang thai user (vd: dang Starter thi moi len Pro). */
  subtitle: string;
}

export function UpgradeCard({ visibleTiers, subtitle }: UpgradeCardProps) {
  const [toast, setToast] = useState<ToastState>(null);

  const [trialState, trialFormAction, isTrialPending] = useActionState(
    startTrialActionWrapper,
    INITIAL_TRIAL_STATE
  );
  const [payState, payFormAction, isPayPending] = useActionState(
    createPaymentLinkWrapper,
    INITIAL_PAY_STATE
  );

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (trialState.success) {
      setToast({ type: 'success', msg: 'Đã bắt đầu dùng thử 7 ngày!' });
    } else if (trialState.error) {
      setToast({ type: 'error', msg: trialState.error });
    }
  }, [trialState]);

  useEffect(() => {
    if (payState.success && payState.checkoutUrl) {
      window.location.href = payState.checkoutUrl;
    } else if (payState.error) {
      setToast({ type: 'error', msg: payState.error });
    }
  }, [payState]);

  const plans = ALL_PLANS.filter((p) => visibleTiers.includes(p.tier));

  if (plans.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-slate-900 mb-1">
        Nâng cấp gói
      </h2>
      <p className="text-sm text-slate-500 mb-5">{subtitle}</p>

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
        {plans.map((plan) => (
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
              <form action={trialFormAction}>
                <input type="hidden" name="tier" value={plan.tier} />
                <button
                  type="submit"
                  disabled={isTrialPending || isPayPending}
                  className="w-full rounded-lg bg-accent-acf px-4 py-2 text-sm font-semibold text-white hover:bg-accent-acf/90 disabled:opacity-50"
                >
                  {isTrialPending && trialState.tier === plan.tier
                    ? 'Đang xử lý...'
                    : 'Bắt đầu dùng thử 7 ngày'}
                </button>
              </form>
              <form action={payFormAction}>
                <input type="hidden" name="tier" value={plan.tier} />
                <button
                  type="submit"
                  disabled={isTrialPending || isPayPending}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  {isPayPending && payState.tier === plan.tier
                    ? 'Đang xử lý...'
                    : 'Thanh toán ngay'}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
