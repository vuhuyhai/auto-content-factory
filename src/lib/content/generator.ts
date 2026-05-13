import { z } from 'zod';
import { anthropic, CLAUDE_MODEL, DEFAULT_MAX_TOKENS } from '../claude/client';
import { buildSystemPrompt, buildUserPrompt } from './prompts';
import type { BrandVoiceGuide, GeneratedContent, ContentVariant } from './types';
import type { NewsArticle } from '../news/types';

/**
 * Zod schema for Claude response validation
 */
const contentVariantSchema = z.object({
  hook: z.string().min(10, 'Hook quá ngắn').max(300, 'Hook quá dài'),
  title: z.string().min(5).max(200),
  body: z.string().min(200, 'Body quá ngắn, phải 300-400 từ').max(3000, 'Body quá dài'),
  hashtags: z.array(z.string()).min(2).max(8),
});

const claudeResponseSchema = z.object({
  variants: z.array(contentVariantSchema).length(3, 'Phải có đúng 3 variants'),
});

export class ContentGenerationError extends Error {
  constructor(
    message: string,
    public readonly stage: 'api_call' | 'json_parse' | 'schema_validate',
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'ContentGenerationError';
  }
}

/**
 * Extract JSON from Claude response text.
 * Claude may wrap JSON in markdown code blocks or add prose around it.
 */
function extractJson(text: string): string {
  // Try markdown code block first: ```json ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  let jsonText: string;

  if (codeBlockMatch) {
    jsonText = codeBlockMatch[1].trim();
  } else {
    // Fallback: find first { and matching last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      jsonText = text.slice(firstBrace, lastBrace + 1).trim();
    } else {
      jsonText = text.trim();
    }
  }

  // Try to fix common Claude JSON issues:
  // 1. Unescaped newlines in strings (replace literal \n with space)
  // 2. Smart quotes (replace with straight quotes)
  jsonText = jsonText
    .replace(/[“”]/g, '"')  // smart double quotes
    .replace(/[‘’]/g, "'"); // smart single quotes

  return jsonText;
}

/**
 * Generate 3 content variants from brand voice + article
 */
export async function generateContent(
  brand: BrandVoiceGuide,
  article: NewsArticle
): Promise<GeneratedContent> {
  const systemPrompt = buildSystemPrompt(brand);
  const userPrompt = buildUserPrompt(article);

  // Step 1: Call Claude API
  let responseText: string;
  let usage: { input: number; output: number } = { input: 0, output: 0 };

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: DEFAULT_MAX_TOKENS,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const firstBlock = response.content[0];
    if (firstBlock.type !== 'text') {
      throw new Error(`Unexpected response block type: ${firstBlock.type}`);
    }

    responseText = firstBlock.text;
    usage = {
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
    };

    if (response.stop_reason !== 'end_turn') {
      console.warn(
        `Claude stop_reason: ${response.stop_reason} (expected end_turn). May indicate truncation.`
      );
    }
  } catch (err) {
    throw new ContentGenerationError(
      err instanceof Error ? err.message : 'Unknown Claude API error',
      'api_call',
      err
    );
  }

  // Step 2: Extract + parse JSON
  let parsed: unknown;
  try {
    const jsonText = extractJson(responseText);
    parsed = JSON.parse(jsonText);
  } catch (err) {
    // Log full response to stderr for debugging
    console.error('\n=== FULL CLAUDE RESPONSE (for debugging) ===');
    console.error(responseText);
    console.error('=== END RESPONSE ===\n');

    throw new ContentGenerationError(
      `Failed to parse JSON from Claude response. First 500 chars: "${responseText.slice(0, 500)}..."`,
      'json_parse',
      err
    );
  }

  // Step 3: Validate schema
  const validation = claudeResponseSchema.safeParse(parsed);
  if (!validation.success) {
    const issues = validation.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new ContentGenerationError(
      `Schema validation failed: ${issues}`,
      'schema_validate',
      validation.error
    );
  }

  console.log(
    `[generator] Generated 3 variants. Tokens: ${usage.input} in / ${usage.output} out`
  );

  return {
    variants: validation.data.variants as ContentVariant[],
    source_article: {
      title: article.title,
      link: article.link,
      source_name: article.source_name,
    },
    generated_at: new Date().toISOString(),
  };
}
