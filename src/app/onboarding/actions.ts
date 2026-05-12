"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { synthesizeBrandVoice } from "@/lib/onboarding/archetype-mapping"
import { fullOnboardingSchema } from "@/lib/onboarding/schemas"
import type { OnboardingFormData } from "@/lib/onboarding/types"

export interface SaveBrandVoiceResult {
  success: boolean
  brandId?: string
  error?: string
  fieldErrors?: Record<string, string>
}

/**
 * Save Brand Voice Profile to database.
 *
 * Flow:
 * 1. Auth check (user must be signed in)
 * 2. Validate full form data with zod
 * 3. Check user doesn't already have a brand (1 brand per user in MVP)
 * 4. Synthesize Brand Voice JSON from form data (rule-based)
 * 5. Insert into brands table (RLS enforces user_id = auth.uid())
 * 6. Revalidate /dashboard path
 *
 * Returns: { success, brandId } or { success: false, error }
 */
export async function saveBrandVoice(
  rawData: unknown,
): Promise<SaveBrandVoiceResult> {
  try {
    // 1. Auth check
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để hoàn thành onboarding",
      }
    }

    // 2. Validate
    const parsed = fullOnboardingSchema.safeParse(rawData)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".")
        fieldErrors[path] = issue.message
      }
      return {
        success: false,
        error: "Dữ liệu form không hợp lệ. Vui lòng kiểm tra lại các bước.",
        fieldErrors,
      }
    }

    const formData = parsed.data as OnboardingFormData

    // 3. Check existing brand (MVP: 1 user = 1 brand)
    const { data: existing } = await supabase
      .from("brands")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle()

    if (existing) {
      return {
        success: false,
        error:
          "Bạn đã có Brand Voice. Vui lòng vào Dashboard để xem hoặc edit.",
      }
    }

    // 4. Synthesize Brand Voice JSON
    const brandVoiceGuide = synthesizeBrandVoice(formData)

    // 5. Insert into brands table
    const industry =
      formData.industry === "other" && formData.industry_custom
        ? formData.industry_custom
        : formData.industry

    const { data: newBrand, error: insertError } = await supabase
      .from("brands")
      .insert({
        user_id: user.id,
        name: formData.brand_name.trim(),
        slogan: formData.slogan?.trim() || null,
        industry,
        audience_persona: formData.persona_description.trim(),
        voice_archetype: formData.archetype,
        brand_voice_guide: brandVoiceGuide,
        hashtags: formData.hashtags,
        status: "active",
      })
      .select("id")
      .single()

    if (insertError) {
      console.error("[saveBrandVoice] Insert error:", insertError)
      return {
        success: false,
        error: `Lỗi lưu vào database: ${insertError.message}`,
      }
    }

    // 6. Revalidate dashboard
    revalidatePath("/dashboard")
    revalidatePath("/onboarding")

    return {
      success: true,
      brandId: newBrand.id,
    }
  } catch (err) {
    console.error("[saveBrandVoice] Unexpected error:", err)
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Có lỗi không xác định, vui lòng thử lại",
    }
  }
}
