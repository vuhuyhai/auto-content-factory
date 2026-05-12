"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Info } from "lucide-react"
import { Form } from "@/components/ui/form"
import { OnboardingProgressBar } from "./onboarding-progress-bar"
import { StepNavigation } from "./step-navigation"
import { BrandVoiceCard } from "./brand-voice-card"
import { useOnboardingState } from "@/lib/onboarding/use-onboarding-state"
import { saveBrandVoice } from "@/app/onboarding/actions"
import { Step1BrandBasics } from "./steps/step-1-brand-basics"
import { Step2Audience } from "./steps/step-2-audience"
import { Step3Archetype } from "./steps/step-3-archetype"
import { Step4Tone } from "./steps/step-4-tone"
import { Step5PainPoints } from "./steps/step-5-pain-points"
import { Step6USP } from "./steps/step-6-usp"
import { Step7Topics } from "./steps/step-7-topics"
import { Step8Sample } from "./steps/step-8-sample"

export function OnboardingShell() {
  const {
    form,
    currentStep,
    isHydrated,
    showPreview,
    goBack,
    goNext,
    goToStep,
    exitPreview,
    resetDraft,
  } = useOnboardingState()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveFieldErrors, setSaveFieldErrors] = useState<Record<string, string>>({})

  if (!isHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      </div>
    )
  }

  const handleConfirm = () => {
    setSaveError(null)
    setSaveFieldErrors({})
    const formData = form.getValues()
    startTransition(async () => {
      const result = await saveBrandVoice(formData)
      if (result.success) {
        resetDraft()
        router.push("/dashboard")
        router.refresh()
      } else {
        setSaveError(result.error || "Có lỗi xảy ra, vui lòng thử lại")
        if (result.fieldErrors) {
          setSaveFieldErrors(result.fieldErrors)
        }
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    })
  }

  return (
    <div className="flex w-full flex-col">
      {/* Warning banner */}
      <div className="mb-6 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Tiến trình lưu trên trình duyệt này. Bạn nên hoàn thành trong 1 lần
          (~7 phút).
        </p>
      </div>

      {/* Progress bar */}
      <OnboardingProgressBar currentStep={currentStep} />

      {saveError && (
        <div className="mb-4 space-y-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <p className="font-medium">{saveError}</p>
          {Object.keys(saveFieldErrors).length > 0 && (
            <ul className="ml-4 list-disc space-y-1 text-xs">
              {Object.entries(saveFieldErrors).map(([field, msg]) => (
                <li key={field}>
                  <span className="font-medium">{getFieldLabel(field)}:</span>{" "}
                  {msg}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Form content */}
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          <AnimatePresence mode="wait" initial={false}>
            {showPreview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full"
              >
                <BrandVoiceCard
                  data={form.getValues()}
                  isSubmitting={isPending}
                  onConfirm={handleConfirm}
                  onEdit={(step) => {
                    exitPreview()
                    goToStep(step)
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full"
              >
                <StepRenderer step={currentStep} />
              </motion.div>
            )}
          </AnimatePresence>

          {!showPreview && (
            <StepNavigation
              currentStep={currentStep}
              onBack={goBack}
              onNext={goNext}
              isSubmitting={isPending}
            />
          )}
        </form>
      </Form>
    </div>
  )
}

function StepRenderer({ step }: { step: number }) {
  switch (step) {
    case 1:
      return <Step1BrandBasics />
    case 2:
      return <Step2Audience />
    case 3:
      return <Step3Archetype />
    case 4:
      return <Step4Tone />
    case 5:
      return <Step5PainPoints />
    case 6:
      return <Step6USP />
    case 7:
      return <Step7Topics />
    case 8:
      return <Step8Sample />
    default:
      return null
  }
}

function getFieldLabel(field: string): string {
  const map: Record<string, string> = {
    brand_name: "Tên thương hiệu (Câu 1)",
    slogan: "Slogan (Câu 1)",
    industry: "Ngành nghề (Câu 1)",
    industry_custom: "Tên ngành cụ thể (Câu 1)",
    age_range: "Độ tuổi (Câu 2)",
    gender_focus: "Giới tính chủ đạo (Câu 2)",
    persona_description: "Mô tả khách hàng (Câu 2)",
    archetype: "Archetype giọng nói (Câu 3)",
    formality: "Mức trang trọng (Câu 4)",
    humor: "Mức hài hước (Câu 4)",
    emotion: "Mức cảm xúc (Câu 4)",
    pain_points: "Pain points (Câu 5)",
    usp: "Điểm khác biệt USP (Câu 6)",
    topics: "Chủ đề (Câu 7)",
    hashtags: "Hashtag (Câu 7)",
    sample_content: "Bài viết mẫu (Câu 8)",
  }
  return map[field] || field
}
