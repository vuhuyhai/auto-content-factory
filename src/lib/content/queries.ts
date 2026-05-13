import { createClient } from '@/lib/supabase/server';
import type { GeneratedContent } from './types';

export interface ContentInsertResult {
  id: string;
  workflow_id: string;
  brand_id: string;
  status: string;
  generated_at: string;
}

/**
 * Insert generated content (3 variants) into contents table.
 * RLS enforces user owns brand via brands.user_id = auth.uid()
 */
export async function insertGeneratedContent(
  brand_id: string,
  workflow_id: string,
  generated: GeneratedContent
): Promise<ContentInsertResult> {
  const supabase = await createClient();

  // Default selected variant = 0 (first variant)
  const selectedIndex = 0;
  const firstVariant = generated.variants[0];

  const { data, error } = await supabase
    .from('contents')
    .insert({
      workflow_id,
      brand_id,
      status: 'draft',
      source_url: generated.source_article.link,
      source_title: generated.source_article.title,
      variants: generated.variants,
      selected_variant_index: selectedIndex,
      facebook_post: firstVariant.body,
    })
    .select('id, workflow_id, brand_id, status, generated_at')
    .single();

  if (error) {
    throw new Error(`Failed to insert content: ${error.message}`);
  }

  if (!data) {
    throw new Error('Insert succeeded but no data returned');
  }

  return data as ContentInsertResult;
}

/**
 * Update workflow.last_run_at after successful generation
 */
export async function updateWorkflowLastRun(
  workflow_id: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('workflows')
    .update({ last_run_at: new Date().toISOString() })
    .eq('id', workflow_id);

  if (error) {
    throw new Error(`Failed to update last_run_at: ${error.message}`);
  }
}
