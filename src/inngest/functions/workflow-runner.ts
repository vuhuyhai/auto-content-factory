import { inngest } from '@/inngest/client';
import { fetchWorkflowByIdAdmin, fetchBrandByUserIdAdmin } from '@/lib/inngest/queries';
import { fetchNewsFromSources } from '@/lib/news/fetcher';
import { generateContent } from '@/lib/content/generator';
import { createAdminClient } from '@/lib/supabase/admin';

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

    // Step 1: Fetch workflow + brand
    const { workflow, brand } = await step.run('fetch-workflow-and-brand', async () => {
      const workflow = await fetchWorkflowByIdAdmin(workflowId, userId);
      if (!workflow) throw new Error(`Workflow ${workflowId} not found or not owned by user`);

      const contentType = workflow.type ?? 'news_based';
      if (contentType !== 'news_based') {
        throw new Error(`Content type "${contentType}" not yet supported`);
      }

      const brand = await fetchBrandByUserIdAdmin(userId);
      if (!brand) throw new Error(`No brand found for user ${userId}`);
      if (!brand.brand_voice_guide) throw new Error('Brand voice guide is empty');

      return { workflow, brand };
    });

    // Step 2: Fetch news from RSS sources
    const articles = await step.run('fetch-news', async () => {
      const newsSources = workflow.config?.news_sources ?? [];
      if (newsSources.length === 0) {
        throw new Error('Workflow has no news sources configured');
      }

      const result = await fetchNewsFromSources(newsSources);
      if (result.articles.length === 0) {
        throw new Error(`No articles fetched. Errors: ${JSON.stringify(result.errors)}`);
      }

      return result.articles;
    });

    const firstArticle = articles[0];

    // Step 3: Generate content via Claude (slowest step, ~30-60s)
    const generated = await step.run('generate-content', async () => {
      if (!brand.brand_voice_guide) throw new Error('Brand voice guide disappeared mid-flow');
      return await generateContent(brand.brand_voice_guide, firstArticle);
    });

    // Step 4: Save to DB + update workflow last_run_at
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
          source_url: firstArticle.link,
          source_title: firstArticle.title,
          status: 'draft',
        } as never)
        .select('id')
        .single();

      if (insertResult.error) throw new Error(`Insert content failed: ${insertResult.error.message}`);
      const inserted = insertResult.data as { id: string };

      const updateResult = await supabase
        .from('workflows')
        .update({ last_run_at: new Date().toISOString() } as never)
        .eq('id', workflowId);

      if (updateResult.error) throw new Error(`Update workflow last_run failed: ${updateResult.error.message}`);

      return inserted.id;
    });

    return {
      success: true,
      content_id: contentId,
      source_title: firstArticle.title,
      variants_count: generated.variants.length,
    };
  },
);
