// Mot nguon su that cho thong tin goi va thanh toan PayOS.
// Doi gia / so ngay trial chi sua o file nay.

export const TRIAL_DAYS = 7;

export type PaidTier = "starter" | "pro";
export type Tier = "free" | PaidTier;

export interface TierConfig {
  /** Gia mot thang, don vi VND */
  priceVnd: number;
  /** Ten hien thi tieng Viet */
  label: string;
}

export const TIER_CONFIG: Record<PaidTier, TierConfig> = {
  starter: { priceVnd: 199000, label: "Starter" },
  pro: { priceVnd: 399000, label: "Pro" },
};

/** Kiem tra mot chuoi co phai goi tra phi hop le khong */
export function isPaidTier(value: string): value is PaidTier {
  return value === "starter" || value === "pro";
}
