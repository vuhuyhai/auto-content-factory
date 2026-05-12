"use client"

import { motion } from "framer-motion"
import { TOTAL_STEPS } from "@/lib/onboarding/schemas"

interface OnboardingProgressBarProps {
  currentStep: number
}

export function OnboardingProgressBar({
  currentStep,
}: OnboardingProgressBarProps) {
  const progress = Math.round((currentStep / TOTAL_STEPS) * 100)

  return (
    <div className="mb-8 w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-900">
          Câu {currentStep}/{TOTAL_STEPS}
        </span>
        <span className="text-slate-500">{progress}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <motion.div
          className="h-full rounded-full bg-slate-900"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
