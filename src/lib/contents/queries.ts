import { createClient } from '@/lib/supabase/server';
import { CONTENTS_PAGE_SIZE } from './types';
import type { Content, ContentStatus, ContentWithWorkflow } from './types';

export type ContentStatusCounts = Record<ContentStatus | 'all', number>;

type ContentRow = {
  id: string;
  workflow_id: string;
  brand_id: string;
  status: Content['status'];
  source_url: string | null;
  source_title: string | null;
  source_tier: number | null;
  facebook_post: string | null;
  variants: Content['variants'];
  selected_variant_index: number | null;
  generated_at: string;
  workflows: { config?: { name?: string } } | { config?: { name?: string } }[];
};

function rowToContent(row: ContentRow): ContentWithWorkflow {
  const config = Array.isArray(row.workflows) ? row.workflows[0]?.config : row.workflows?.config;
  return {
    id: row.id,
    workflow_id: row.workflow_id,
    brand_id: row.brand_id,
    status: row.status,
    source_url: row.source_url,
    source_title: row.source_title,
    source_tier: row.source_tier,
    facebook_post: row.facebook_post,
    variants: row.variants,
    selected_variant_index: row.selected_variant_index,
    generated_at: row.generated_at,
    workflow_name: config?.name ?? null,
  };
}

export async function getCurrentUserContents(
  statusFilter?: ContentStatus,
  page = 1
): Promise<ContentWithWorkflow[]> {
  const supabase = await createClient();
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * CONTENTS_PAGE_SIZE;
  const to = safePage * CONTENTS_PAGE_SIZE - 1;

  let query = supabase
    .from('contents')
    .select(`
      id, workflow_id, brand_id, status, source_url, source_title, source_tier,
      facebook_post, variants, selected_variant_index, generated_at,
      workflows!inner(config)
    `)
    .order('generated_at', { ascending: false })
    .range(from, to);

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;

  if (error || !data) return [];

  return (data as unknown as ContentRow[]).map(rowToContent);
}

export async function getContentsTotalCount(
  statusFilter?: ContentStatus
): Promise<number> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  let query = supabase
    .from('contents')
    .select('id, brands!inner(user_id)', { count: 'exact', head: true })
    .eq('brands.user_id', user.id);

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { count, error } = await query;

  if (error || count === null) return 0;

  return count;
}

export async function countContentsByStatusForCurrentUser(): Promise<ContentStatusCounts> {
  const empty: ContentStatusCounts = { all: 0, generating: 0, draft: 0, approved: 0, rejected: 0 };
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return empty;

  const { data, error } = await supabase
    .from('contents')
    .select('status, brands!inner(user_id)')
    .eq('brands.user_id', user.id);

  if (error || !data) return empty;

  return (data as unknown as { status: ContentStatus }[]).reduce<ContentStatusCounts>(
    (acc, row) => {
      acc.all += 1;
      acc[row.status] += 1;
      return acc;
    },
    { ...empty }
  );
}

export async function countDraftContentsForCurrentUser(): Promise<number> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  const { count, error } = await supabase
    .from('contents')
    .select('id, brands!inner(user_id)', { count: 'exact', head: true })
    .eq('status', 'draft')
    .eq('brands.user_id', user.id);

  if (error || count === null) return 0;

  return count;
}

export async function getContentById(id: string): Promise<ContentWithWorkflow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('contents')
    .select(`
      id, workflow_id, brand_id, status, source_url, source_title, source_tier,
      facebook_post, variants, selected_variant_index, generated_at,
      workflows!inner(config)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;

  return rowToContent(data as unknown as ContentRow);
}
