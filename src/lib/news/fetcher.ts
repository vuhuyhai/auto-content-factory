import Parser from 'rss-parser';
import type { NewsArticle, FetchError, FetchNewsResult } from './types';

const FETCH_TIMEOUT_MS = 8000;
const MAX_ARTICLES_PER_SOURCE = 3;
const HOURS_LOOKBACK = 24;

const parser = new Parser({
  timeout: FETCH_TIMEOUT_MS,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; AutoContentFactory/1.0; +https://autocontent.online)',
  },
});

/**
 * Fetch full article content from URL using Readability
 */
async function fetchArticleContent(url: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AutoContentFactory/1.0; +https://autocontent.online)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Lazy dynamic import to avoid Vercel production bundling issue (ERR_REQUIRE_ESM)
    const { JSDOM } = await import('jsdom');
    const { Readability } = await import('@mozilla/readability');

    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || !article.textContent) {
      throw new Error('Readability extract returned empty content');
    }

    // Clean whitespace
    return article.textContent
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Extract source name from RSS feed URL
 * Example: "https://vnexpress.net/rss/suc-khoe.rss" -> "VnExpress"
 */
function getSourceName(feedUrl: string, fallback: string): string {
  try {
    const url = new URL(feedUrl);
    const hostname = url.hostname.replace(/^www\./, '').split('.')[0];
    return hostname.charAt(0).toUpperCase() + hostname.slice(1);
  } catch {
    return fallback;
  }
}

/**
 * Check if article is within HOURS_LOOKBACK
 */
function isRecent(pubDate: string | undefined): boolean {
  if (!pubDate) return false;
  const date = new Date(pubDate);
  if (isNaN(date.getTime())) return false;
  const cutoff = Date.now() - HOURS_LOOKBACK * 60 * 60 * 1000;
  return date.getTime() >= cutoff;
}

/**
 * Fetch news articles from list of RSS feed URLs.
 * - Parses each RSS feed (timeout 8s)
 * - Filters articles within last 24h
 * - Takes max 3 articles per source
 * - For each article, fetches full content via Readability
 * - Errors per source are collected, not thrown (partial success OK)
 */
export async function fetchNewsFromSources(
  feedUrls: string[]
): Promise<FetchNewsResult> {
  const articles: NewsArticle[] = [];
  const errors: FetchError[] = [];

  for (const feedUrl of feedUrls) {
    let feed;
    try {
      feed = await parser.parseURL(feedUrl);
    } catch (err) {
      errors.push({
        source_url: feedUrl,
        error_message: err instanceof Error ? err.message : 'Unknown RSS parse error',
        stage: 'rss_parse',
      });
      continue;
    }

    const sourceName = getSourceName(feedUrl, feed.title ?? 'Unknown');
    const recentItems = (feed.items ?? [])
      .filter((item) => isRecent(item.pubDate ?? item.isoDate))
      .slice(0, MAX_ARTICLES_PER_SOURCE);

    for (const item of recentItems) {
      if (!item.link || !item.title) {
        continue;
      }

      try {
        const content = await fetchArticleContent(item.link);
        articles.push({
          title: item.title,
          content,
          link: item.link,
          pub_date: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
          source_name: sourceName,
          description: item.contentSnippet ?? item.content ?? '',
        });
      } catch (err) {
        errors.push({
          source_url: item.link,
          error_message: err instanceof Error ? err.message : 'Unknown article fetch error',
          stage: 'article_fetch',
        });
      }
    }
  }

  return {
    articles,
    errors,
    total_sources: feedUrls.length,
    total_articles_fetched: articles.length,
  };
}
