import type { BrandVoiceGuide } from '../types';
import type { NewsArticle } from '../../news/types';
import { buildBrandContext, OUTPUT_SPEC_COMMON } from './_base';

/**
 * Prompt builder cho workflow type='news_based'.
 * Input: 1 NewsArticle từ RSS feed.
 * Output: 3 variants reword từ bài báo theo brand voice.
 */

export function buildSystemPromptNewsBased(brand: BrandVoiceGuide): string {
  const brandContext = buildBrandContext(brand);

  return `${brandContext}

# YÊU CẦU OUTPUT

Bạn sẽ nhận 1 bài báo tham khảo. Nhiệm vụ:
1. Tìm góc nhìn liên kết bài báo với brand (nếu có thể)
2. Viết 3 phiên bản content KHÁC NHAU về cùng chủ đề
3. Mỗi phiên bản có hook + title + body (300-400 từ) + 3-5 hashtags
4. CTA (call-to-action) cuối body: tự quyết theo brand voice, có thể là câu hỏi mời comment, link tham khảo, hoặc lời mời nhẹ nhàng. KHÔNG hard sell.

${OUTPUT_SPEC_COMMON}

# LƯU Ý RIÊNG CHO NEWS_BASED

- Bài báo có thể có phần header/breadcrumb (vd "Sức khoẻTin tức Thứ tư..."), BỎ QUA những phần này
- Liên kết tin tức với brand qua góc nhìn audience pain point hoặc topic brand quan tâm`;
}

export function buildUserPromptNewsBased(article: NewsArticle): string {
  return `# BÀI BÁO THAM KHẢO

**Title:** ${article.title}
**Source:** ${article.source_name}
**Link:** ${article.link}
**Published:** ${article.pub_date}

## Description

${article.description}

## Full Content

${article.content.slice(0, 4000)}

---

Hãy viết 3 phiên bản content theo yêu cầu ở system prompt. TRẢ VỀ JSON duy nhất, không thêm text giải thích.`;
}
