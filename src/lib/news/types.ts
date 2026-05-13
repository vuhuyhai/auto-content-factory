/**
 * News article fetched from RSS + extracted via Readability
 */
export interface NewsArticle {
  /** Article title from RSS feed */
  title: string;
  /** Full article content extracted by Readability (HTML stripped to text) */
  content: string;
  /** Article link URL */
  link: string;
  /** Published date (ISO string from RSS pubDate) */
  pub_date: string;
  /** Source feed name (e.g. "VnExpress Suc Khoe") */
  source_name: string;
  /** Short summary/description from RSS */
  description: string;
}

/**
 * Error info per source URL when fetch fails
 */
export interface FetchError {
  source_url: string;
  error_message: string;
  stage: 'rss_parse' | 'article_fetch' | 'content_extract';
}

/**
 * Aggregate result from fetchNewsFromSources()
 */
export interface FetchNewsResult {
  articles: NewsArticle[];
  errors: FetchError[];
  total_sources: number;
  total_articles_fetched: number;
}
