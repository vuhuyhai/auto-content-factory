import { ARCHETYPES } from "./constants"
import type {
  ArchetypeKey,
  BrandVoiceGuide,
  OnboardingFormData,
} from "./types"

/**
 * Tổng hợp Brand Voice Profile từ form data 8 câu hỏi.
 * Day 6 dùng rule-based mapping (Claude API defer Week 2).
 *
 * Logic:
 * - Archetype quyết định voice_principles + vocabulary (yes/no) + example_hooks
 * - Tone sliders ghi nguyên vào tone object
 * - Pain points / USP / topics ghi từ user input
 * - Signature move auto-generate đơn giản từ archetype + USP
 */
export function synthesizeBrandVoice(
  data: OnboardingFormData,
): BrandVoiceGuide {
  const archetypeKey = data.archetype as ArchetypeKey
  const archetype = ARCHETYPES[archetypeKey]

  if (!archetype) {
    throw new Error(`Invalid archetype: ${data.archetype}`)
  }

  const industry =
    data.industry === "other" && data.industry_custom
      ? data.industry_custom
      : data.industry

  const painPointsList = data.pain_points
    .split(/[\n/]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5)

  const now = new Date().toISOString()

  const profile: BrandVoiceGuide = {
    version: "1.0",
    brand_basics: {
      name: data.brand_name.trim(),
      slogan: data.slogan?.trim() || undefined,
      industry,
    },
    audience: {
      age_range: data.age_range,
      gender_focus: (data.gender_focus || "mixed") as
        | "male"
        | "female"
        | "mixed",
      persona_description: data.persona_description.trim(),
    },
    voice: {
      archetype: archetypeKey,
      tone: {
        formality: data.formality,
        humor: data.humor,
        emotion: data.emotion,
      },
      principles: archetype.voice_principles,
    },
    messaging: {
      pain_points: painPointsList,
      usp: data.usp.trim(),
      topics: data.topics,
      hashtags: data.hashtags,
    },
    vocabulary: {
      yes_words: archetype.vocabulary_yes,
      no_words: archetype.vocabulary_no,
    },
    signature_move: generateSignatureMove(archetype.name, data.usp),
    example_hooks: [
      archetype.sample_hook,
      `Đây là sai lầm em thấy 80% ${getAudienceLabel(data.gender_focus)} mắc phải...`,
      "Em không định nói điều này, nhưng...",
    ],
    sample_content_provided: Boolean(data.sample_content?.trim()),
    created_at: now,
    last_updated: now,
  }

  if (profile.sample_content_provided && data.sample_content) {
    profile.sample_content_analysis = analyzeSampleContent(
      data.sample_content,
    )
  }

  return profile
}

/**
 * Generate signature move câu mô tả tuyên ngôn brand voice.
 * Đơn giản: kết hợp archetype + USP keywords.
 */
function generateSignatureMove(
  archetypeName: string,
  usp: string,
): string {
  const uspShort = usp.length > 80 ? usp.slice(0, 80) + "..." : usp
  return `Giọng ${archetypeName.toLowerCase()} kết hợp với điểm khác biệt: ${uspShort}`
}

/**
 * Convert gender focus thành label tiếng Việt dùng trong hook.
 */
function getAudienceLabel(gender: string): string {
  if (gender === "female") return "chị em"
  if (gender === "male") return "anh em"
  return "mọi người"
}

/**
 * Phân tích cơ bản sample content (rule-based, không gọi AI).
 * Week 2 sẽ thay bằng Claude API.
 */
function analyzeSampleContent(content: string): {
  avg_length_chars: number
  common_hooks: string[]
  ending_pattern: string
} {
  const posts = content.split(/\n{3,}|---+/).filter((p) => p.trim().length > 50)
  const avgLength =
    posts.length > 0
      ? Math.round(
          posts.reduce((sum, p) => sum + p.length, 0) / posts.length,
        )
      : content.length

  const firstLines = posts
    .map((p) => p.split("\n")[0].trim())
    .filter(Boolean)
    .slice(0, 3)

  return {
    avg_length_chars: avgLength,
    common_hooks: firstLines.length > 0 ? firstLines : ["(chưa phân tích)"],
    ending_pattern: "(chưa phân tích, Week 2 sẽ upgrade)",
  }
}
