import { z } from "zod"

// ============================================================================
// SHARED VALIDATORS
// ============================================================================

const requiredString = (fieldName: string, minLength = 1) =>
  z
    .string({ message: `${fieldName} là bắt buộc` })
    .trim()
    .min(minLength, {
      message:
        minLength === 1
          ? `${fieldName} là bắt buộc`
          : `${fieldName} phải có ít nhất ${minLength} ký tự`,
    })

// ============================================================================
// STEP 1: BRAND BASICS
// ============================================================================

export const step1Schema = z.object({
  brand_name: requiredString("Tên thương hiệu", 2).max(100, {
    message: "Tên thương hiệu tối đa 100 ký tự",
  }),
  slogan: z
    .string()
    .trim()
    .max(150, { message: "Slogan tối đa 150 ký tự" })
    .optional()
    .or(z.literal("")),
  industry: requiredString("Ngành nghề"),
  industry_custom: z
    .string()
    .trim()
    .max(100, { message: "Tên ngành tối đa 100 ký tự" })
    .optional()
    .or(z.literal("")),
})

export type Step1Data = z.infer<typeof step1Schema>

// Custom refine: nếu industry = "other" thì industry_custom phải có
export const step1SchemaWithRefine = step1Schema.refine(
  (data) => {
    if (data.industry === "other") {
      return data.industry_custom && data.industry_custom.length >= 2
    }
    return true
  },
  {
    message: "Vui lòng nhập tên ngành nghề của bạn",
    path: ["industry_custom"],
  },
)

// ============================================================================
// STEP 2: AUDIENCE PERSONA
// ============================================================================

export const step2Schema = z.object({
  age_range: z
    .array(z.string())
    .min(1, { message: "Chọn ít nhất 1 độ tuổi" })
    .max(2, { message: "Chỉ chọn tối đa 2 độ tuổi" }),
  gender_focus: z.enum(["male", "female", "mixed"], {
    message: "Chọn giới tính chủ đạo",
  }),
  persona_description: requiredString("Mô tả khách hàng", 20).max(300, {
    message: "Mô tả tối đa 300 ký tự",
  }),
})

export type Step2Data = z.infer<typeof step2Schema>

// ============================================================================
// STEP 3: ARCHETYPE
// ============================================================================

export const step3Schema = z.object({
  archetype: z.enum(
    ["caregiver", "sage", "explorer", "everyman", "hero", "creator"],
    { message: "Chọn 1 archetype giọng nói" },
  ),
})

export type Step3Data = z.infer<typeof step3Schema>

// ============================================================================
// STEP 4: TONE CALIBRATION
// ============================================================================

export const step4Schema = z.object({
  formality: z.number().min(0).max(10).int(),
  humor: z.number().min(0).max(10).int(),
  emotion: z.number().min(0).max(10).int(),
})

export type Step4Data = z.infer<typeof step4Schema>

// ============================================================================
// STEP 5: PAIN POINTS
// ============================================================================

export const step5Schema = z.object({
  pain_points: requiredString("Pain points", 50).max(500, {
    message: "Pain points tối đa 500 ký tự",
  }),
})

export type Step5Data = z.infer<typeof step5Schema>

// ============================================================================
// STEP 6: USP
// ============================================================================

export const step6Schema = z.object({
  usp: requiredString("Điểm khác biệt", 30).max(300, {
    message: "Điểm khác biệt tối đa 300 ký tự",
  }),
})

export type Step6Data = z.infer<typeof step6Schema>

// ============================================================================
// STEP 7: TOPICS & HASHTAGS
// ============================================================================

export const step7Schema = z.object({
  topics: z
    .array(z.string())
    .min(3, { message: "Chọn ít nhất 3 chủ đề" })
    .max(5, { message: "Chỉ chọn tối đa 5 chủ đề" }),
  hashtags: z
    .array(z.string().trim().min(2))
    .min(3, { message: "Cần ít nhất 3 hashtag" })
    .max(8, { message: "Tối đa 8 hashtag" }),
})

export type Step7Data = z.infer<typeof step7Schema>

// ============================================================================
// STEP 8: SAMPLE CONTENT (optional)
// ============================================================================

export const step8Schema = z.object({
  sample_content: z
    .string()
    .trim()
    .max(5000, { message: "Sample content tối đa 5000 ký tự" })
    .optional()
    .or(z.literal("")),
})

export type Step8Data = z.infer<typeof step8Schema>

// ============================================================================
// FULL SCHEMA (cho final save server-side)
// ============================================================================

export const fullOnboardingSchema = z.object({
  // Step 1
  brand_name: z
    .string()
    .trim()
    .min(2, { message: "Tên thương hiệu phải có ít nhất 2 ký tự" })
    .max(100, { message: "Tên thương hiệu tối đa 100 ký tự" }),
  slogan: z
    .string()
    .trim()
    .max(150, { message: "Slogan tối đa 150 ký tự" })
    .optional(),
  industry: z
    .string()
    .trim()
    .min(1, { message: "Ngành nghề là bắt buộc" }),
  industry_custom: z
    .string()
    .trim()
    .max(100, { message: "Tên ngành tối đa 100 ký tự" })
    .optional(),

  // Step 2
  age_range: z
    .array(z.string())
    .min(1, { message: "Chọn ít nhất 1 độ tuổi" })
    .max(2, { message: "Chỉ chọn tối đa 2 độ tuổi" }),
  gender_focus: z.enum(["male", "female", "mixed"]),
  persona_description: z
    .string()
    .trim()
    .min(20, { message: "Mô tả khách hàng phải có ít nhất 20 ký tự" })
    .max(300, { message: "Mô tả tối đa 300 ký tự" }),

  // Step 3
  archetype: z.enum([
    "caregiver",
    "sage",
    "explorer",
    "everyman",
    "hero",
    "creator",
  ]),

  // Step 4
  formality: z.number().min(0).max(10).int(),
  humor: z.number().min(0).max(10).int(),
  emotion: z.number().min(0).max(10).int(),

  // Step 5
  pain_points: z
    .string()
    .trim()
    .min(50, { message: "Pain points phải có ít nhất 50 ký tự" })
    .max(500, { message: "Pain points tối đa 500 ký tự" }),

  // Step 6
  usp: z
    .string()
    .trim()
    .min(30, { message: "USP phải có ít nhất 30 ký tự" })
    .max(300, { message: "USP tối đa 300 ký tự" }),

  // Step 7
  topics: z
    .array(z.string())
    .min(3, { message: "Chọn ít nhất 3 chủ đề" })
    .max(5, { message: "Chỉ chọn tối đa 5 chủ đề" }),
  hashtags: z
    .array(z.string().trim().min(2))
    .min(3, { message: "Cần ít nhất 3 hashtag" })
    .max(8, { message: "Tối đa 8 hashtag" }),

  // Step 8
  sample_content: z
    .string()
    .trim()
    .max(5000, { message: "Sample content tối đa 5000 ký tự" })
    .optional(),
})

export type FullOnboardingData = z.infer<typeof fullOnboardingSchema>

// ============================================================================
// STEP NUMBER → SCHEMA MAP (dùng cho validation từng step)
// ============================================================================

export const STEP_SCHEMAS = {
  1: step1SchemaWithRefine,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
  5: step5Schema,
  6: step6Schema,
  7: step7Schema,
  8: step8Schema,
} as const

export type StepNumber = keyof typeof STEP_SCHEMAS

export const TOTAL_STEPS = 8 as const
