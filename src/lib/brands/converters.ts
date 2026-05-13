import type { BrandVoiceGuide } from "@/lib/db/schema"
import type { OnboardingFormData } from "@/lib/onboarding/types"

export function guideToFormData(guide: BrandVoiceGuide): OnboardingFormData {
  return {
    brand_name: guide.brand_basics.name,
    slogan: guide.brand_basics.slogan ?? "",
    industry: guide.brand_basics.industry,
    industry_custom: "",

    age_range: guide.audience.age_range,
    gender_focus: guide.audience.gender_focus,
    persona_description: guide.audience.persona_description,

    archetype: guide.voice.archetype,

    formality: guide.voice.tone.formality,
    humor: guide.voice.tone.humor,
    emotion: guide.voice.tone.emotion,

    pain_points: guide.messaging.pain_points.join("\n"),

    usp: guide.messaging.usp,

    topics: guide.messaging.topics,
    hashtags: guide.messaging.hashtags,

    sample_content: "",
  }
}
