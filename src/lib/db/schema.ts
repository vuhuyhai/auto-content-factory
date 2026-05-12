import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

// PROFILES - extends Supabase auth.users
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  plan: varchar('plan', { length: 20 }).default('free').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// BRANDS - 1 user 1 brand trong MVP
export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  slogan: text('slogan'),
  industry: varchar('industry', { length: 100 }),
  audiencePersona: text('audience_persona'),
  voiceArchetype: varchar('voice_archetype', { length: 50 }),
  brandVoiceGuide: jsonb('brand_voice_guide').$type<BrandVoiceGuide>(),
  hashtags: text('hashtags').array(),
  logoUrl: varchar('logo_url', { length: 500 }),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// WORKFLOWS - cron schedule cho mỗi brand
export const workflows = pgTable('workflows', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 30 }).default('news_based').notNull(),
  scheduleCron: varchar('schedule_cron', { length: 50 }).notNull(),
  enabled: boolean('enabled').default(true).notNull(),
  config: jsonb('config'),
  lastRunAt: timestamp('last_run_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// CONTENTS - output mỗi run
export const contents = pgTable('contents', {
  id: uuid('id').primaryKey().defaultRandom(),
  workflowId: uuid('workflow_id').notNull().references(() => workflows.id, { onDelete: 'cascade' }),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 20 }).default('generating').notNull(),
  sourceUrl: varchar('source_url', { length: 500 }),
  sourceTitle: text('source_title'),
  sourceTier: integer('source_tier'),
  facebookPost: text('facebook_post'),
  linkedinPost: text('linkedin_post'),
  imagePrompts: jsonb('image_prompts'),
  errorMessage: text('error_message'),
  generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow().notNull(),
  sentEmailAt: timestamp('sent_email_at', { withTimezone: true }),
});

// CONTENT LOGS - anti-duplicate
export const contentLogs = pgTable('content_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  topicKeywords: text('topic_keywords').array(),
  hashtag: varchar('hashtag', { length: 100 }),
  sourceUrl: varchar('source_url', { length: 500 }),
  generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow().notNull(),
});

// SUBSCRIPTIONS - billing PayOS
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  plan: varchar('plan', { length: 20 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
  payosOrderCode: varchar('payos_order_code', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Type exports cho TypeScript
export type Profile = typeof profiles.$inferSelect;
export type Brand = typeof brands.$inferSelect;
export type Workflow = typeof workflows.$inferSelect;
export type Content = typeof contents.$inferSelect;
export type ContentLog = typeof contentLogs.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;

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
