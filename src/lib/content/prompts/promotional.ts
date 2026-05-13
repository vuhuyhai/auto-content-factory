import type { BrandVoiceGuide } from '../types';
import { buildBrandContext, OUTPUT_SPEC_COMMON } from './_base';

/**
 * Prompt builder cho workflow type='promotional'.
 * Input: productLink + offer (mô tả ưu đãi/giá/USP).
 * Output: 3 variants quảng bá sản phẩm với CTA mạnh.
 */

export interface PromotionalContext {
  productLink: string;
  offer: string;
}

export function buildSystemPromptPromotional(brand: BrandVoiceGuide): string {
  const brandContext = buildBrandContext(brand);

  return `${brandContext}

# YÊU CẦU OUTPUT

Bạn sẽ nhận 1 sản phẩm/khoá học của brand cần quảng bá. Nhiệm vụ:
1. Viết 3 phiên bản content KHÁC NHAU quảng bá sản phẩm
2. Mỗi variant dùng 1 angle bán hàng khác (vd: variant 1 đánh vào pain point, variant 2 kể câu chuyện thành công, variant 3 đưa lý do/USP cụ thể)
3. Mỗi phiên bản có hook + title + body (300-400 từ) + 3-5 hashtags
4. CTA cuối body PHẢI có link sản phẩm và lời kêu gọi hành động rõ ràng (vd "Đăng ký ngay tại [link]", "Xem chi tiết: [link]")

${OUTPUT_SPEC_COMMON}

# LƯU Ý RIÊNG CHO PROMOTIONAL

- Đây là content BÁN HÀNG, được phép có CTA mạnh hơn news_based/evergreen
- KHÔNG over-promise (vd "giảm 10kg trong 7 ngày" nếu offer không nói vậy)
- Phải nhắc đến ưu đãi cụ thể từ offer (nếu offer có giá, nhắc giá; nếu offer có deadline, nhắc deadline)
- Body PHẢI có link sản phẩm ít nhất 1 lần (đặt cuối body trước CTA)
- Tránh từ ngữ "AI-feel" cứng nhắc: "Đừng bỏ lỡ cơ hội vàng!", "Số lượng có hạn!" - thay bằng giọng brand thật`;
}

export function buildUserPromptPromotional(context: PromotionalContext): string {
  return `# SẢN PHẨM CẦN QUẢNG BÁ

**Link sản phẩm:** ${context.productLink}

## Mô tả ưu đãi (offer)

${context.offer}

---

Hãy viết 3 phiên bản content quảng bá theo yêu cầu ở system prompt. Mỗi variant 1 angle bán hàng khác nhau. TRẢ VỀ JSON duy nhất, không thêm text giải thích.`;
}
