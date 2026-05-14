import { createAdminClient } from '@/lib/supabase/admin';
import type { ContentVariant } from '@/lib/content/types';

export interface DigestDraft {
  contentId: string;
  title: string;
  generatedAt: string;
}

export interface UserDigestData {
  userId: string;
  email: string;
  name: string | null;
  brandName: string;
  draftCount: number;
  drafts: DigestDraft[];
}

const MAX_USERS_PER_RUN = 50;
const DRAFT_LOOKBACK_HOURS = 24;
const DIGEST_COOLDOWN_HOURS = 20;

type DraftRow = {
  id: string;
  generated_at: string;
  variants: ContentVariant[] | null;
  brands: BrandJoin | BrandJoin[];
};

type BrandJoin = {
  name: string;
  user_id: string;
  profiles: ProfileJoin | ProfileJoin[];
};

type ProfileJoin = {
  email: string;
  name: string | null;
  last_digest_sent_at: string | null;
};

function flatten<T>(value: T | T[]): T | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function pickTitle(variants: ContentVariant[] | null): string {
  const first = variants?.[0]?.title?.trim();
  return first && first.length > 0 ? first : '(Chưa có tiêu đề)';
}

function isCooldownExpired(lastSentAt: string | null, cutoffIso: string): boolean {
  if (!lastSentAt) return true;
  return lastSentAt < cutoffIso;
}

export async function fetchUsersForDigest(): Promise<UserDigestData[]> {
  const supabase = createAdminClient();
  const now = Date.now();
  const draftCutoffIso = new Date(now - DRAFT_LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();
  const digestCutoffIso = new Date(now - DIGEST_COOLDOWN_HOURS * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('contents')
    .select(
      'id, generated_at, variants, brands!inner(name, user_id, profiles!inner(email, name, last_digest_sent_at))'
    )
    .eq('status', 'draft')
    .gt('generated_at', draftCutoffIso)
    .order('generated_at', { ascending: false });

  if (error) {
    console.error('[digest-queries] fetch failed:', error.message);
    throw new Error(`Failed to fetch drafts for digest: ${error.message}`);
  }

  if (!data || data.length === 0) {
    console.log('[digest-queries] no draft contents in last 24h');
    return [];
  }

  const grouped = new Map<string, UserDigestData>();

  for (const row of data as unknown as DraftRow[]) {
    const brand = flatten(row.brands);
    if (!brand) continue;
    const profile = flatten(brand.profiles);
    if (!profile) continue;

    if (!isCooldownExpired(profile.last_digest_sent_at, digestCutoffIso)) {
      continue;
    }

    const draft: DigestDraft = {
      contentId: row.id,
      title: pickTitle(row.variants),
      generatedAt: row.generated_at,
    };

    const existing = grouped.get(brand.user_id);
    if (existing) {
      existing.drafts.push(draft);
      existing.draftCount = existing.drafts.length;
      continue;
    }

    if (grouped.size >= MAX_USERS_PER_RUN) continue;

    grouped.set(brand.user_id, {
      userId: brand.user_id,
      email: profile.email,
      name: profile.name,
      brandName: brand.name,
      draftCount: 1,
      drafts: [draft],
    });
  }

  const result = Array.from(grouped.values());
  console.log(
    `[digest-queries] fetched ${result.length} user(s) eligible for digest (max ${MAX_USERS_PER_RUN})`
  );
  return result;
}

export async function markDigestSent(userIds: string[]): Promise<void> {
  if (userIds.length === 0) {
    console.log('[digest-queries] markDigestSent skipped (empty userIds)');
    return;
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from('profiles')
    .update({ last_digest_sent_at: new Date().toISOString() } as never)
    .in('id', userIds);

  if (error) {
    console.error(
      `[digest-queries] markDigestSent failed for ${userIds.length} user(s):`,
      error.message
    );
    return;
  }

  console.log(`[digest-queries] marked ${userIds.length} user(s) digest sent`);
}
