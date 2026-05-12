"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Info } from "lucide-react"
import { Form } from "@/components/ui/form"
import { OnboardingProgressBar } from "./onboarding-progress-bar"
import { StepNavigation } from "./step-navigation"
import { useOnboardingState } from "@/lib/onboarding/use-onboarding-state"
import { Step1BrandBasics } from "./steps/step-1-brand-basics"
import { Step2Audience } from "./steps/step-2-audience"
import { Step3Archetype } from "./steps/step-3-archetype"
import { Step4Tone } from "./steps/step-4-tone"
import { Step5PainPoints } from "./steps/step-5-pain-points"
import { Step6USP } from "./steps/step-6-usp"
import { Step7Topics } from "./steps/step-7-topics"
import { Step8Sample } from "./steps/step-8-sample"

export function OnboardingShell() {
  const { form, currentStep, isHydrated, goBack, goNext } =
    useOnboardingState()

  if (!isHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      </div>
    )
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

      {/* Form content */}
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full"
            >
              <StepRenderer step={currentStep} />
            </motion.div>
          </AnimatePresence>

          <StepNavigation
            currentStep={currentStep}
            onBack={goBack}
            onNext={goNext}
          />
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
