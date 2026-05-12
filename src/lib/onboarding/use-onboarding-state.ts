"use client"

import { useEffect, useState, useCallback } from "react"
import { useForm, UseFormReturn } from "react-hook-form"
import {
  DEFAULT_FORM_DATA,
  type OnboardingDraft,
  type OnboardingFormData,
} from "./types"
import { DRAFT_VERSION, LS_DRAFT_KEY } from "./constants"
import { STEP_SCHEMAS, TOTAL_STEPS, type StepNumber } from "./schemas"

interface UseOnboardingStateReturn {
  form: UseFormReturn<OnboardingFormData>
  currentStep: number
  isHydrated: boolean
  goNext: () => Promise<boolean>
  goBack: () => void
  goToStep: (step: number) => void
  resetDraft: () => void
  saveDraft: () => void
}

const FIELD_MAPS: Record<number, (keyof OnboardingFormData)[]> = {
  1: ["brand_name", "slogan", "industry", "industry_custom"],
  2: ["age_range", "gender_focus", "persona_description"],
  3: ["archetype"],
  4: ["formality", "humor", "emotion"],
  5: ["pain_points"],
  6: ["usp"],
  7: ["topics", "hashtags"],
  8: ["sample_content"],
}

export function useOnboardingState(): UseOnboardingStateReturn {
  const form = useForm<OnboardingFormData>({
    defaultValues: DEFAULT_FORM_DATA,
    mode: "onBlur",
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsHydrated(true)
      return
    }
    try {
      const raw = window.localStorage.getItem(LS_DRAFT_KEY)
      if (raw) {
        const draft = JSON.parse(raw) as OnboardingDraft
        if (draft.version === DRAFT_VERSION && draft.data) {
          form.reset({ ...DEFAULT_FORM_DATA, ...draft.data })
          if (draft.currentStep >= 1 && draft.currentStep <= TOTAL_STEPS) {
            setCurrentStep(draft.currentStep)
          }
        }
      }
    } catch (err) {
      console.warn("[Onboarding] Failed to load draft from localStorage:", err)
    } finally {
      setIsHydrated(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save draft to localStorage
  const saveDraft = useCallback(
    (stepOverride?: number) => {
      if (typeof window === "undefined") return
      try {
        const draft: OnboardingDraft = {
          version: DRAFT_VERSION,
          data: form.getValues(),
          currentStep: stepOverride ?? currentStep,
          updatedAt: new Date().toISOString(),
        }
        window.localStorage.setItem(LS_DRAFT_KEY, JSON.stringify(draft))
      } catch (err) {
        console.warn("[Onboarding] Failed to save draft:", err)
      }
    },
    [form, currentStep],
  )

  // Auto-save on form value change (debounced via React batching)
  useEffect(() => {
    if (!isHydrated) return
    const subscription = form.watch(() => {
      saveDraft()
    })
    return () => subscription.unsubscribe()
  }, [form, saveDraft, isHydrated])

  // Validate current step + advance
  const goNext = useCallback(async (): Promise<boolean> => {
    const stepKey = currentStep as StepNumber
    const schema = STEP_SCHEMAS[stepKey]
    if (!schema) return false

    const fields = FIELD_MAPS[currentStep] || []
    const isValid = await form.trigger(fields)

    if (!isValid) {
      return false
    }

    if (currentStep < TOTAL_STEPS) {
      const next = currentStep + 1
      setCurrentStep(next)
      saveDraft(next)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return true
    }
    return true
  }, [currentStep, form, saveDraft])

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      const prev = currentStep - 1
      setCurrentStep(prev)
      saveDraft(prev)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [currentStep, saveDraft])

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= TOTAL_STEPS) {
        setCurrentStep(step)
        saveDraft(step)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    },
    [saveDraft],
  )

  const resetDraft = useCallback(() => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.removeItem(LS_DRAFT_KEY)
    } catch (err) {
      console.warn("[Onboarding] Failed to clear draft:", err)
    }
    form.reset(DEFAULT_FORM_DATA)
    setCurrentStep(1)
  }, [form])

  return {
    form,
    currentStep,
    isHydrated,
    goNext,
    goBack,
    goToStep,
    resetDraft,
    saveDraft,
  }
}
