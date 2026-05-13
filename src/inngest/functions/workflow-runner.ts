import { inngest } from '@/inngest/client';
import {
  fetchWorkflowByIdAdmin,
  fetchBrandByUserIdAdmin,
  fetchRecentContentTitlesAdmin,
  type WorkflowForRunner,
  type BrandForRunner,
} from '@/lib/inngest/queries';
import { fetchNewsFromSources } from '@/lib/news/fetcher';
import { generateContent, type PromptContext } from '@/lib/content/generator';
import { createAdminClient } from '@/lib/supabase/admin';
import type { NewsArticle } from '@/lib/news/types';

const SUPPORTED_CONTENT_TYPES = ['news_based', 'evergreen', 'promotional'] as const;
type SupportedContentType = (typeof SUPPORTED_CONTENT_TYPES)[number];

/**
 * Type guard: narrow `string` thành SupportedContentType.
 * Dùng để re-narrow sau khi qua step.run boundary (Inngest serialize widen literal → string).
 */
function isSupportedContentType(value: string): value is SupportedContentType {
  return (SUPPORTED_CONTENT_TYPES as readonly string[]).includes(value);
}

/**
 * Inngest workflow runner — dispatch theo workflow.type:
 *   - news_based: fetch RSS → first article → generate
 *   - evergreen: skip RSS, fetch recent titles → generate từ topic_focus
 *   - promotional: skip RSS, generate từ product_link + offer
 */
export const workflowRunner = inngest.createFunction(
  {
    id: 'workflow-runner',
    name: 'Workflow Runner',
    concurrency: { limit: 5 },
    retries: 3,
    triggers: [{ event: 'workflow/run.requested' }],
  },
  async ({ event, step }) => {
    const { workflowId, userId } = event.data as {
      workflowId: string;
      userId: string;
    };

    // ============================================================
    // Step 1: Fetch workflow + brand + validate type-specific config
    // Throw sớm nếu config thiếu field bắt buộc → tiết kiệm Claude API call
    // ============================================================
    const fetchResult = await step.run('fetch-workflow-and-brand', async () => {
      const workflow = await fetchWorkflowByIdAdmin(workflowId, userId);
      if (!workflow) throw new Error(`Workflow ${workflowId} not found or not owned by user`);

      const rawType = workflow.type ?? 'news_based';
      if (!isSupportedContentType(rawType)) {
        throw new Error(`Content type "${rawType}" not supported`);
      }

      // Validate type-specific config
      const config = workflow.config ?? {};
      if (rawType === 'news_based') {
        if (!config.news_sources || config.news_sources.length === 0) {
          throw new Error('Workflow news_based: thiếu news_sources trong config');
        }
      } else if (rawType === 'evergreen') {
        if (!config.topic_focus || config.topic_focus.trim().length < 20) {
          throw new Error('Workflow evergreen: thiếu topic_focus (>= 20 chars) trong config');
        }
      } else if (rawType === 'promotional') {
        if (!config.product_link || config.product_link.trim().length === 0) {
          throw new Error('Workflow promotional: thiếu product_link trong config');
        }
        if (!config.offer || config.offer.trim().length < 30) {
          throw new Error('Workflow promotional: thiếu offer (>= 30 chars) trong config');
        }
      }

      const brand = await fetchBrandByUserIdAdmin(userId);
      if (!brand) throw new Error(`No brand found for user ${userId}`);
      if (!brand.brand_voice_guide) throw new Error('Brand voice guide is empty');

      return { workflow, brand, contentType: rawType };
    });

    // Re-narrow sau step.run boundary (Inngest serialize widen literal → string)
    const { workflow, brand } = fetchResult;
    const contentTypeRaw = fetchResult.contentType;
    if (!isSupportedContentType(contentTypeRaw)) {
      throw new Error(`Invalid contentType after fetch: ${contentTypeRaw}`);
    }
    const contentType: SupportedContentType = contentTypeRaw;

    // ============================================================
    // Step 2: Build prompt context + generate content (gộp 1 step)
    // - news_based: fetch RSS → pick first article → generate
    // - evergreen: fetch recent titles → generate từ topic_focus
    // - promotional: chỉ extract config → generate
    // Slowest step (~30-60s), Inngest retry riêng nếu fail
    // ============================================================
    const generated = await step.run('build-and-generate', async () => {
      if (!brand.brand_voice_guide) throw new Error('Brand voice guide disappeared mid-flow');

      const promptContext = await buildPromptContextByType(contentType, workflow);
      const result = await generateContent(brand.brand_voice_guide, promptContext);

      // Trả kèm source metadata để step 3 không phải rebuild context
      const sourceFields = buildSourceFields(promptContext);
      return {
        variants: result.variants,
        source_url: sourceFields.source_url,
        source_title: sourceFields.source_title,
        generated_at: result.generated_at,
      };
    });

    // ============================================================
    // Step 3: Save to DB + update workflow last_run_at
    // ============================================================
    const contentId = await step.run('save-content', async () => {
      const supabase = createAdminClient();

      const insertResult = await supabase
        .from('contents')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert({
          brand_id: brand.id,
          workflow_id: workflowId,
          facebook_post: generated.variants[0].body,
          variants: generated.variants,
          selected_variant_index: 0,
          source_url: generated.source_url,
          source_title: generated.source_title,
          status: 'draft',
        } as never)
        .select('id')
        .single();

      if (insertResult.error)
        throw new Error(`Insert content failed: ${insertResult.error.message}`);
      const inserted = insertResult.data as { id: string };

      const updateResult = await supabase
        .from('workflows')
        .update({ last_run_at: new Date().toISOString() } as never)
        .eq('id', workflowId);

      if (updateResult.error)
        throw new Error(`Update workflow last_run failed: ${updateResult.error.message}`);

      return inserted.id;
    });

    return {
      success: true,
      content_id: contentId,
      content_type: contentType,
      variants_count: generated.variants.length,
    };
  },
);

// ============================================================
// Helpers (extract ra giữ workflowRunner gọn)
// ============================================================

/**
 * Build PromptContext theo workflow type.
 * - news_based: fetch RSS → pick first article (giữ logic Day 9)
 * - evergreen: fetch 5 recent titles từ DB
 * - promotional: chỉ extract config (no external fetch)
 */
async function buildPromptContextByType(
  contentType: SupportedContentType,
  workflow: WorkflowForRunner,
): Promise<PromptContext> {
  const config = workflow.config ?? {};

  if (contentType === 'news_based') {
    const newsSources = config.news_sources ?? [];
    const result = await fetchNewsFromSources(newsSources);
    if (result.articles.length === 0) {
      throw new Error(`No articles fetched. Errors: ${JSON.stringify(result.errors)}`);
    }
    const article = result.articles[0] as NewsArticle;
    return { type: 'news_based', article };
  }

  if (contentType === 'evergreen') {
    const topicFocus = config.topic_focus!.trim();
    const recentTitles = await fetchRecentContentTitlesAdmin(workflow.id, 5);
    return {
      type: 'evergreen',
      context: { topicFocus, recentTitles },
    };
  }

  // promotional
  const productLink = config.product_link!.trim();
  const offer = config.offer!.trim();
  return {
    type: 'promotional',
    context: { productLink, offer },
  };
}

/**
 * Source URL + title cho DB save dựa trên PromptContext.
 * - news_based: link + title bài báo
 * - evergreen: NULL + truncate topic_focus
 * - promotional: product_link + truncate offer
 */
function buildSourceFields(ctx: PromptContext): {
  source_url: string | null;
  source_title: string;
} {
  if (ctx.type === 'news_based') {
    return {
      source_url: ctx.article.link,
      source_title: ctx.article.title,
    };
  }
  if (ctx.type === 'evergreen') {
    return {
      source_url: null,
      source_title: ctx.context.topicFocus.slice(0, 200),
    };
  }
  // promotional
  return {
    source_url: ctx.context.productLink,
    source_title: ctx.context.offer.slice(0, 200),
  };
}

// Silence unused import warning for BrandForRunner (type used in step.run callback inference)
export type { BrandForRunner };