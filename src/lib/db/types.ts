/**
 * DB Types - Auto-Content Factory
 *
 * Database row types và JSONB shape definitions.
 * Trước Day 26 dùng Drizzle inferSelect, sau Day 26 thay bằng plain interface
 * vì app query 100% qua Supabase client (không cần Drizzle runtime).
 */

// ============================================================================
// DATABASE ROW TYPES (khớp public schema hiện tại - verified Day 26)
// ============================================================================

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  plan: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  last_digest_sent_at: string | null;
}

export interface Brand {
  id: string;
  user_id: string;
  name: string;
  slogan: string | null;
  industry: string | null;
  audience_persona: string | null;
  voice_archetype: string | null;
  brand_voice_guide: BrandVoiceGuide | null;
  hashtags: string[] | null;
  logo_url: string | null;
  status: string;
  created_at: string;
}

export interface Workflow {
  id: string;
  brandId: string;
  type: string;
  scheduleCron: string;
  enabled: boolean;
  config: unknown | null;
  lastRunAt: string | null;
  createdAt: string;
}

export interface Content {
  id: string;
  workflow_id: string;
  brand_id: string;
  status: string;
  source_url: string | null;
  source_title: string | null;
  source_tier: number | null;
  facebook_post: string | null;
  linkedin_post: string | null;
  image_prompts: unknown | null;
  error_message: string | null;
  generated_at: string;
  sent_email_at: string | null;
  variants: unknown | null;
  selected_variant_index: number | null;
}

export interface ContentLog {
  id: string;
  brand_id: string;
  topic_keywords: string[] | null;
  hashtag: string | null;
  source_url: string | null;
  generated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: string;
  status: string;
  trial_start: string | null;
  trial_end: string | null;
  current_period_end: string | null;
  payos_order_code: number | null;
  created_at: string;
  updated_at: string;
  reminder_d3_sent_at: string | null;
  reminder_d1_sent_at: string | null;
}

// ============================================================================
// JSONB TYPE DEFINITIONS
// ============================================================================

/**
 * Brand Voice Guide structure stored in brands.brand_voice_guide JSONB column.
 * Generated from 8-question onboarding flow.
 * Version: 1.0
 */
export interface BrandVoiceGuide {
  version: string;
  brand_basics: {
    name: string;
    slogan?: string;
    industry: string;
  };
  audience: {
    age_range: string[];
    gender_focus: 'male' | 'female' | 'mixed';
    persona_description: string;
  };
  voice: {
    archetype: 'caregiver' | 'sage' | 'explorer' | 'everyman' | 'hero' | 'creator';
    tone: {
      formality: number;
      humor: number;
      emotion: number;
    };
    principles: string[];
  };
  messaging: {
    pain_points: string[];
    usp: string;
    topics: string[];
    hashtags: string[];
  };
  vocabulary: {
    yes_words: string[];
    no_words: string[];
  };
  signature_move: string;
  example_hooks: string[];
  sample_content_provided: boolean;
  sample_content_analysis?: {
    avg_length_chars: number;
    common_hooks: string[];
    ending_pattern: string;
  };
  created_at: string;
  last_updated: string;
}
