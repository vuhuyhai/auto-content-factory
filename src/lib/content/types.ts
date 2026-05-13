import type { NewsArticle } from '../news/types';

/**
 * One generated content variant (3 variants per content)
 */
export interface ContentVariant {
  /** Scroll-stopping hook, 1-2 sentences */
  hook: string;
  /** Article title */
  title: string;
  /** Main body 300-400 words, includes CTA if appropriate */
  body: string;
  /** 3-5 relevant hashtags (without # prefix in array, add # when display) */
  hashtags: string[];
}

/**
 * Source article reference for generated content
 */
export interface SourceArticleRef {
  title: string;
  link: string;
  source_name: string;
}

/**
 * Complete generated content with 3 variants + source reference
 */
export interface GeneratedContent {
  variants: ContentVariant[];
  source_article: SourceArticleRef;
  generated_at: string;
}

/**
 * Input for content generation
 */
export interface GenerateContentInput {
  /** Brand voice guide JSON from brands.brand_voice_guide */
  brand_voice_guide: BrandVoiceGuide;
  /** Source article to inspire content */
  article: NewsArticle;
}

/**
 * Brand voice guide structure (matches DB schema)
 * Note: Inline definition here, not imported, to keep content lib self-contained
 */
export interface BrandVoiceGuide {
  version: string;
  brand_basics: {
    name: string;
    slogan?: string;
    industry: string;
  };
  audience: {
    age_range: string[];
    gender_focus: string;
    persona_description: string;
  };
  voice: {
    archetype: string;
    tone: {
      formality: number;
      humor: number;
      emotion: number;
    };
    principles: string[];
  };
  messaging: {
    pain_points: string[];
    usp: string;
    topics: string[];
    hashtags: string[];
  };
  vocabulary: {
    yes_words: string[];
    no_words: string[];
  };
  signature_move: string;
  example_hooks: string[];
  sample_content_provided: boolean;
}
