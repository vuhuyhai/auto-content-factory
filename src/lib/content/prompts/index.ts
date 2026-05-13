import type { BrandVoiceGuide } from '../types';
import type { NewsArticle } from '../../news/types';
import type { ContentType } from '../../workflows/types';
import {
  buildSystemPromptNewsBased,
  buildUserPromptNewsBased,
} from './news-based';
import {
  buildSystemPromptEvergreen,
  buildUserPromptEvergreen,
  type EvergreenContext,
} from './evergreen';
import {
  buildSystemPromptPromotional,
  buildUserPromptPromotional,
  type PromotionalContext,
} from './promotional';

/**
 * Dispatcher: gọi đúng prompt builder theo workflow type.
 *
 * Discriminated union ensure type safety:
 * - news_based → cần NewsArticle
 * - evergreen → cần EvergreenContext
 * - promotional → cần PromotionalContext
 */

export type PromptContext =
  | { type: 'news_based'; article: NewsArticle }
  | { type: 'evergreen'; context: EvergreenContext }
  | { type: 'promotional'; context: PromotionalContext };

export interface BuiltPrompts {
  systemPrompt: string;
  userPrompt: string;
}

export function buildPrompts(brand: BrandVoiceGuide, ctx: PromptContext): BuiltPrompts {
  switch (ctx.type) {
    case 'news_based':
      return {
        systemPrompt: buildSystemPromptNewsBased(brand),
        userPrompt: buildUserPromptNewsBased(ctx.article),
      };
    case 'evergreen':
      return {
        systemPrompt: buildSystemPromptEvergreen(brand),
        userPrompt: buildUserPromptEvergreen(ctx.context),
      };
    case 'promotional':
      return {
        systemPrompt: buildSystemPromptPromotional(brand),
        userPrompt: buildUserPromptPromotional(ctx.context),
      };
  }
}

// Re-export context types cho generator.ts dùng
export type { EvergreenContext, PromotionalContext };
export type { ContentType };
