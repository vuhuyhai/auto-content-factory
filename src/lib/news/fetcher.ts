import Parser from 'rss-parser';
import type { NewsArticle, FetchError, FetchNewsResult } from './types';

function log(stage: string, data: Record<string, unknown>): void {
  // Use console.log so Vercel Runtime Logs capture it
  console.log(`[news-fetcher] ${stage}`, JSON.stringify(data));
}

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

const MIN_DESCRIPTION_CHARS = 80;

function extractDescription(item: { content?: string; contentSnippet?: string; description?: string }): string {
  // Priority: contentSnippet (stripped HTML by rss-parser) > content (raw HTML, manual strip) > description
  const candidates = [item.contentSnippet, item.content, item.description].filter(
    (v): v is string => typeof v === 'string' && v.length > 0
  );

  for (const candidate of candidates) {
    // Strip HTML tags + whitespace cleanup
    const stripped = candidate
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim();

    if (stripped.length >= MIN_DESCRIPTION_CHARS) {
      return stripped;
    }
  }

  return '';
}

/**
 * Fetch news articles from list of RSS feed URLs.
 * - Parses each RSS feed (timeout 8s)
 * - Filters articles within last 24h
 * - Takes max 3 articles per source
 * - Uses RSS description as article content (no full-page fetch)
 * - Errors per source are collected, not thrown (partial success OK)
 */
export async function fetchNewsFromSources(
  feedUrls: string[]
): Promise<FetchNewsResult> {
  const articles: NewsArticle[] = [];
  const errors: FetchError[] = [];

  log('start', { sourceCount: feedUrls.length, sources: feedUrls });

  for (const feedUrl of feedUrls) {
    log('rss-fetch-start', { feedUrl, userAgent: 'Mozilla/5.0 (compatible; AutoContentFactory/1.0; +https://autocontent.online)' });

    const rssStart = Date.now();
    let feed;
    try {
      const rssController = new AbortController();
      const rssTimeoutId = setTimeout(() => rssController.abort(), FETCH_TIMEOUT_MS);

      let rssResponse: Response;
      try {
        rssResponse = await fetch(feedUrl, {
          signal: rssController.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; AutoContentFactory/1.0; +https://autocontent.online)',
            'Accept': 'application/rss+xml, application/xml, text/xml, */*',
          },
        });
      } finally {
        clearTimeout(rssTimeoutId);
      }

      const rssDurationMs = Date.now() - rssStart;
      log('rss-fetch-response', {
        feedUrl,
        status: rssResponse.status,
        statusText: rssResponse.statusText,
        contentType: rssResponse.headers.get('content-type'),
        contentLength: rssResponse.headers.get('content-length'),
        durationMs: rssDurationMs,
      });

      if (!rssResponse.ok) {
        throw new Error(`HTTP ${rssResponse.status} ${rssResponse.statusText}`);
      }

      const xmlText = await rssResponse.text();
      log('rss-fetch-body', { feedUrl, bytes: xmlText.length, firstChars: xmlText.slice(0, 200) });

      feed = await parser.parseString(xmlText);
      log('rss-parse-ok', { feedUrl, totalItems: feed.items?.length ?? 0 });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown RSS error';
      log('rss-fetch-error', { feedUrl, error: errMsg, durationMs: Date.now() - rssStart });
      errors.push({
        source_url: feedUrl,
        error_message: errMsg,
        stage: 'rss_parse',
      });
      continue;
    }

    const sourceName = getSourceName(feedUrl, feed.title ?? 'Unknown');
    const recentItems = (feed.items ?? [])
      .filter((item) => isRecent(item.pubDate ?? item.isoDate))
      .slice(0, MAX_ARTICLES_PER_SOURCE);

    log('rss-items-filter', { feedUrl, totalItems: feed.items?.length ?? 0, recentItemsCount: recentItems.length, hoursLookback: HOURS_LOOKBACK });

    for (const item of recentItems) {
      if (!item.link || !item.title) {
        continue;
      }

      const description = extractDescription(item);

      if (!description) {
        log('article-skip-short', { url: item.link, title: item.title, reason: 'description too short or missing' });
        errors.push({
          source_url: item.link,
          error_message: `Description shorter than ${MIN_DESCRIPTION_CHARS} chars or missing`,
          stage: 'content_extract',
        });
        continue;
      }

      articles.push({
        title: item.title,
        content: description,
        link: item.link,
        pub_date: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
        source_name: sourceName,
        description,
      });
      log('article-extract-ok', { url: item.link, contentBytes: description.length });
    }
  }

  log('done', {
    totalSources: feedUrls.length,
    totalArticles: articles.length,
    totalErrors: errors.length,
    errorSummary: errors.map(e => ({ url: e.source_url, stage: e.stage, msg: e.error_message })),
  });

  return {
    articles,
    errors,
    total_sources: feedUrls.length,
    total_articles_fetched: articles.length,
  };
}
