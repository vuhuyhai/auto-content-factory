import type { BrandVoiceGuide } from "@/lib/db/schema"

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
