import type { BrandVoiceGuide } from '../types';
import { buildBrandContext, OUTPUT_SPEC_COMMON } from './_base';

/**
 * Prompt builder cho workflow type='evergreen'.
 * Input: topicFocus (chủ đề cố định) + optional recentTitles (lịch sử content gần nhất để Claude không lặp).
 * Output: 3 variants quanh chủ đề, mỗi variant 1 góc nhìn khác nhau.
 */

export interface EvergreenContext {
  topicFocus: string;
  recentTitles?: string[];
}

export function buildSystemPromptEvergreen(brand: BrandVoiceGuide): string {
  const brandContext = buildBrandContext(brand);

  return `${brandContext}

# YÊU CẦU OUTPUT

Bạn sẽ nhận 1 chủ đề cố định (topic_focus). Nhiệm vụ:
1. Viết 3 phiên bản content KHÁC NHAU về chủ đề đó
2. Mỗi variant tiếp cận chủ đề từ 1 góc khác (vd: variant 1 chia sẻ kinh nghiệm cá nhân, variant 2 đưa tips thực hành, variant 3 phân tích lý thuyết/khoa học)
3. Mỗi phiên bản có hook + title + body (300-400 từ) + 3-5 hashtags
4. CTA cuối body: câu hỏi mời comment hoặc lời mời nhẹ. KHÔNG hard sell.

${OUTPUT_SPEC_COMMON}

# LƯU Ý RIÊNG CHO EVERGREEN

- Không có bài báo tham khảo. Bạn tự xây dựng nội dung từ kiến thức về chủ đề + brand voice
- Content phải FRESH, mỗi variant 1 angle khác nhau (tránh viết 3 bài na ná)
- Tránh khẳng định số liệu cụ thể nếu không chắc chắn (vd "70% phụ nữ..." nếu không có dữ liệu, dùng "nhiều chị em..." thay thế)
- Nếu có lịch sử content gần nhất, TRÁNH lặp angle/title đã viết`;
}

export function buildUserPromptEvergreen(context: EvergreenContext): string {
  const recentSection = context.recentTitles && context.recentTitles.length > 0
    ? `\n## Lịch sử content gần nhất (TRÁNH LẶP)\n\n${context.recentTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n`
    : '';

  return `# CHỦ ĐỀ CỐ ĐỊNH

${context.topicFocus}
${recentSection}
---

Hãy viết 3 phiên bản content theo yêu cầu ở system prompt. Mỗi variant 1 góc nhìn khác nhau. TRẢ VỀ JSON duy nhất, không thêm text giải thích.`;
}
