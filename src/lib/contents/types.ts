import type { ContentVariant } from '@/lib/content/types';

export const CONTENT_STATUS_VALUES = ['generating', 'draft', 'approved', 'rejected'] as const;

export type ContentStatus = (typeof CONTENT_STATUS_VALUES)[number];

export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  generating: 'Đang tạo',
  draft: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Đã từ chối',
};

export interface Content {
  id: string;
  workflow_id: string;
  brand_id: string;
  status: ContentStatus;
  source_url: string | null;
  source_title: string | null;
  source_tier: number | null;
  facebook_post: string | null;
  variants: ContentVariant[] | null;
  selected_variant_index: number | null;
  generated_at: string;
}

export interface ContentWithWorkflow extends Content {
  workflow_name: string | null;
}

export function normalizeHashtag(tag: string): string {
  const trimmed = tag.trim().replace(/^#+/, '');
  return trimmed ? `#${trimmed}` : '';
}
