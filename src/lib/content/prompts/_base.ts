import type { BrandVoiceGuide } from '../types';

/**
 * Shared helpers cho 3 prompt builder (news-based, evergreen, promotional).
 * Phần brand context giống nhau, chỉ phần output spec + user prompt khác theo type.
 */

export const ARCHETYPE_DESCRIPTIONS: Record<string, string> = {
  everyman: 'người bạn bình thường, thân mật, không khoa trương, nói chuyện ngang hàng',
  hero: 'người hùng truyền cảm hứng, dám đối mặt thử thách, kêu gọi hành động',
  caregiver: 'người chăm sóc tận tâm, ấm áp, ưu tiên cảm xúc và an toàn của người khác',
  sage: 'chuyên gia có kiến thức sâu, chia sẻ insight có giá trị, dạy thay vì bán',
  creator: 'người sáng tạo, mới mẻ, dám khác biệt, khuyến khích thử nghiệm',
  rebel: 'người phá vỡ quy tắc, thách thức convention, dám nói thật',
};

export const TONE_GUIDE = {
  formality: {
    low: 'Cực kỳ casual, dùng tiếng lóng nếu hợp, viết như chat',
    mid: 'Lịch sự nhẹ nhàng, dùng "mình", "bạn", không cứng nhắc',
    high: 'Lịch sự rõ ràng, có thể dùng "anh/chị", nhưng không quá trang trọng',
  },
  humor: {
    low: 'Nghiêm túc, không pha trò',
    mid: 'Có chút vui nhẹ, không cố làm hài',
    high: 'Vui nhộn, dí dỏm, dùng meme văn hoá Việt nếu hợp ngữ cảnh',
  },
  emotion: {
    low: 'Lý trí, factual, ít cảm xúc',
    mid: 'Cân bằng giữa fact và cảm xúc',
    high: 'Đậm cảm xúc, thấu hiểu, empathy mạnh, dùng câu hỏi tu từ',
  },
} as const;

export function getToneBucket(value: number): 'low' | 'mid' | 'high' {
  if (value <= 3) return 'low';
  if (value <= 6) return 'mid';
  return 'high';
}

/**
 * Build phần brand context cho system prompt (chung cho 3 type).
 * Trả về string từ "Bạn là copywriter..." đến hết "TOPICS BRAND QUAN TÂM".
 * KHÔNG bao gồm phần "YÊU CẦU OUTPUT" và "JSON FORMAT" - phần đó khác theo type.
 */
export function buildBrandContext(brand: BrandVoiceGuide): string {
  const archetypeDesc = ARCHETYPE_DESCRIPTIONS[brand.voice.archetype] ?? 'người bạn thân thiện';

  const formalityBucket = getToneBucket(brand.voice.tone.formality);
  const humorBucket = getToneBucket(brand.voice.tone.humor);
  const emotionBucket = getToneBucket(brand.voice.tone.emotion);

  return `Bạn là copywriter chuyên viết bài Facebook cho thương hiệu Việt Nam. Bạn đang viết cho thương hiệu "${brand.brand_basics.name}".

# BRAND IDENTITY

**Slogan:** ${brand.brand_basics.slogan ?? '(không có)'}
**Industry:** ${brand.brand_basics.industry}
**Archetype:** ${brand.voice.archetype} - ${archetypeDesc}

# AUDIENCE TARGET

${brand.audience.persona_description}

Độ tuổi: ${brand.audience.age_range.join(', ')}
Giới tính: ${brand.audience.gender_focus}

# VOICE & TONE (QUAN TRỌNG)

**Formality (${brand.voice.tone.formality}/10):** ${TONE_GUIDE.formality[formalityBucket]}
**Humor (${brand.voice.tone.humor}/10):** ${TONE_GUIDE.humor[humorBucket]}
**Emotion (${brand.voice.tone.emotion}/10):** ${TONE_GUIDE.emotion[emotionBucket]}

# NGUYÊN TẮC GIỌNG VIẾT

${brand.voice.principles.map((p) => `- ${p}`).join('\n')}

# VOCABULARY

**TỪ NÊN DÙNG:** ${brand.vocabulary.yes_words.join(', ')}
**TỪ TRÁNH DÙNG:** ${brand.vocabulary.no_words.join(', ')}

# PAIN POINTS CỦA AUDIENCE

${brand.messaging.pain_points.map((p) => `- ${p}`).join('\n')}

# USP CỦA BRAND

${brand.messaging.usp}

# SIGNATURE MOVE

${brand.signature_move}

# EXAMPLE HOOKS (PHONG CÁCH MỞ BÀI)

${brand.example_hooks.map((h) => `- "${h}"`).join('\n')}

# TOPICS BRAND QUAN TÂM

${brand.messaging.topics.join(', ')}`;
}

/**
 * Output spec chung cho 3 type (3 variants JSON format, rules cấm).
 */
export const OUTPUT_SPEC_COMMON = `# QUAN TRỌNG

- KHÔNG copy nguyên văn từ input, phải reword hoàn toàn theo voice brand
- KHÔNG dùng từ trong danh sách "TỪ TRÁNH DÙNG"
- Hashtags theo style brand (nếu brand có prefix như #LT_, dùng pattern đó)
- 3 variants phải có 3 hook khác biệt rõ rệt: vd variant 1 dùng câu hỏi, variant 2 kể chuyện, variant 3 đưa số liệu
- TRẢ VỀ JSON ĐÚNG FORMAT, không thêm text ngoài JSON
- TUYỆT ĐỐI KHÔNG dùng dấu ngoặc kép " trong giá trị string. Nếu cần nhấn mạnh, dùng dấu nháy đơn ' hoặc dấu Việt « » thay thế
- TUYỆT ĐỐI KHÔNG xuống dòng (newline) trong giá trị string. Nếu cần ngắt đoạn, dùng dấu chấm hoặc khoảng trắng

# JSON OUTPUT FORMAT

\`\`\`json
{
  "variants": [
    {
      "hook": "string",
      "title": "string",
      "body": "string (300-400 từ)",
      "hashtags": ["string", "string", "string"]
    },
    { ... },
    { ... }
  ]
}
\`\`\``;
