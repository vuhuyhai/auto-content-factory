import type { BrandVoiceGuide } from "@/lib/db/types"

// ============================================================================
// ARCHETYPE TYPES
// ============================================================================

export type ArchetypeKey =
  | "caregiver"
  | "sage"
  | "explorer"
  | "everyman"
  | "hero"
  | "creator"

export interface ArchetypeData {
  key: ArchetypeKey
  emoji: string
  name: string
  tagline: string
  examples: string
  voice_principles: string[]
  vocabulary_yes: string[]
  vocabulary_no: string[]
  sample_hook: string
}

// ============================================================================
// ONBOARDING FORM DATA (raw input from 8 steps)
// ============================================================================

export type GenderFocus = "male" | "female" | "mixed"

export interface OnboardingFormData {
  // Step 1: Brand basics
  brand_name: string
  slogan: string
  industry: string
  industry_custom: string

  // Step 2: Audience
  age_range: string[]
  gender_focus: GenderFocus | ""
  persona_description: string

  // Step 3: Archetype
  archetype: ArchetypeKey | ""

  // Step 4: Tone calibration
  formality: number
  humor: number
  emotion: number

  // Step 5: Pain points
  pain_points: string

  // Step 6: USP
  usp: string

  // Step 7: Topics & Hashtags
  topics: string[]
  hashtags: string[]

  // Step 8: Sample content (optional)
  sample_content: string
}

// ============================================================================
// LOCAL STORAGE STATE
// ============================================================================

export interface OnboardingDraft {
  version: string
  data: Partial<OnboardingFormData>
  currentStep: number
  updatedAt: string
}

// ============================================================================
// RE-EXPORT FROM SCHEMA
// ============================================================================

export type { BrandVoiceGuide }

// ============================================================================
// DEFAULT VALUES (cho react-hook-form initialization)
// ============================================================================

export const DEFAULT_FORM_DATA: OnboardingFormData = {
  // Step 1
  brand_name: "",
  slogan: "",
  industry: "",
  industry_custom: "",

  // Step 2
  age_range: [],
  gender_focus: "",
  persona_description: "",

  // Step 3
  archetype: "",

  // Step 4 (default từ Questionnaire spec)
  formality: 6,
  humor: 4,
  emotion: 5,

  // Step 5
  pain_points: "",

  // Step 6
  usp: "",

  // Step 7
  topics: [],
  hashtags: [],

  // Step 8
  sample_content: "",
}
