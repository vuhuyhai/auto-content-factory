import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getWorkflowById } from '@/lib/workflows/queries';
import { getCurrentUserBrand } from '@/lib/brands/queries';
import { fetchNewsFromSources } from '@/lib/news/fetcher';
import { generateContent } from '@/lib/content/generator';
import { insertGeneratedContent, updateWorkflowLastRun } from '@/lib/content/queries';
import type { BrandVoiceGuide } from '@/lib/content/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: workflowId } = await context.params;

  // Step 1: Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Step 2: Fetch workflow + verify ownership via RLS
  let workflow;
  try {
    workflow = await getWorkflowById(workflowId);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Workflow not found' },
      { status: 404 }
    );
  }

  if (!workflow) {
    return NextResponse.json(
      { error: 'Workflow not found or no permission' },
      { status: 404 }
    );
  }

  // Step 3: Only news_based workflow type supported in Day 9
  const contentType = workflow.type ?? 'news_based';
  if (contentType !== 'news_based') {
    return NextResponse.json(
      { error: `Content type "${contentType}" not yet supported. Only "news_based" works in Day 9.` },
      { status: 400 }
    );
  }

  // Step 4: Extract news_sources from workflow config
  const config = workflow.config as { name?: string; news_sources?: string[] } | null;
  const newsSources = config?.news_sources ?? [];

  if (newsSources.length === 0) {
    return NextResponse.json(
      { error: 'Workflow has no news sources configured' },
      { status: 400 }
    );
  }

  // Step 5: Fetch brand voice
  const brand = await getCurrentUserBrand();
  if (!brand) {
    return NextResponse.json(
      { error: 'No brand found. Please complete onboarding first.' },
      { status: 400 }
    );
  }

  const brandVoiceGuide = brand.brand_voice_guide as BrandVoiceGuide | null;
  if (!brandVoiceGuide) {
    return NextResponse.json(
      { error: 'Brand voice guide is empty. Please complete onboarding.' },
      { status: 400 }
    );
  }

  // Step 6: Fetch news (timeout protected by fetcher internal 8s per source)
  let articles;
  try {
    const fetchResult = await fetchNewsFromSources(newsSources);
    if (fetchResult.articles.length === 0) {
      return NextResponse.json(
        {
          error: 'No articles fetched from any source',
          fetch_errors: fetchResult.errors,
        },
        { status: 502 }
      );
    }
    articles = fetchResult.articles;
  } catch (err) {
    return NextResponse.json(
      { error: `News fetch failed: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 502 }
    );
  }

  // Day 9: Generate from FIRST article only (batch defer Day 10)
  const article = articles[0];

  // Step 7: Generate content via Claude
  let generated;
  try {
    generated = await generateContent(brandVoiceGuide, article);
  } catch (err) {
    return NextResponse.json(
      {
        error: `Content generation failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        stage: err instanceof Error ? (err as { stage?: string }).stage : 'unknown',
      },
      { status: 500 }
    );
  }

  // Step 8: Save to DB + update workflow last_run_at
  try {
    const inserted = await insertGeneratedContent(brand.id, workflowId, generated);
    await updateWorkflowLastRun(workflowId);

    return NextResponse.json({
      success: true,
      content_id: inserted.id,
      variants_count: generated.variants.length,
      source_article: {
        title: article.title,
        link: article.link,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Database save failed: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
