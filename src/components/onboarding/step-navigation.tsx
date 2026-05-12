"use client"

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TOTAL_STEPS } from "@/lib/onboarding/schemas"

interface StepNavigationProps {
  currentStep: number
  onBack: () => void
  onNext: () => void
  isSubmitting?: boolean
  nextLabel?: string
  isNextDisabled?: boolean
}

export function StepNavigation({
  currentStep,
  onBack,
  onNext,
  isSubmitting = false,
  nextLabel,
  isNextDisabled = false,
}: StepNavigationProps) {
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === TOTAL_STEPS

  const finalNextLabel =
    nextLabel || (isLastStep ? "Hoàn thành" : "Tiếp tục")

  return (
    <div className="mt-8 flex w-full items-center justify-between gap-3">
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        disabled={isFirstStep || isSubmitting}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Button>
      <Button
        type="button"
        onClick={onNext}
        disabled={isSubmitting || isNextDisabled}
        className="min-w-[140px] gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            {finalNextLabel}
            {!isLastStep && <ArrowRight className="h-4 w-4" />}
          </>
        )}
      </Button>
    </div>
  )
}
