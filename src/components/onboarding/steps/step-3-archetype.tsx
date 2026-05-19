"use client"

import { useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { ARCHETYPES } from "@/lib/onboarding/constants"
import type { ArchetypeKey, OnboardingFormData } from "@/lib/onboarding/types"

const ARCHETYPE_LIST: ArchetypeKey[] = [
  "caregiver",
  "sage",
  "explorer",
  "everyman",
  "hero",
  "creator",
]

export function Step3Archetype() {
  const form = useFormContext<OnboardingFormData>()

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
          Câu 3
        </p>
        <h2 className="text-2xl font-bold text-slate-900">
          Giọng nói thương hiệu của bạn giống ai nhất?
        </h2>
        <p className="text-sm text-slate-600">
          Đây là quyết định quan trọng nhất. Hình mẫu thương hiệu này định hình
          giọng nền cho mọi bài viết AI tạo ra sau này.
        </p>
      </header>

      <FormField
        control={form.control}
        name="archetype"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Hình mẫu thương hiệu</FormLabel>
            <FormDescription className="text-sm text-slate-500">
              Chọn 1 trong 6 hình mẫu thương hiệu. Bạn có thể đổi sau.
            </FormDescription>
            <div className="grid gap-3 pt-2 md:grid-cols-2">
              {ARCHETYPE_LIST.map((key) => {
                const arch = ARCHETYPES[key]
                const isSelected = field.value === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => field.onChange(key)}
                    className={
                      "group relative rounded-lg border bg-white p-4 text-left transition " +
                      (isSelected
                        ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2"
                        : "border-slate-200 hover:border-slate-400")
                    }
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{arch.emoji}</span>
                      <div className="flex-1 space-y-1">
                        <h3 className="text-sm font-bold tracking-tight text-slate-900">
                          {arch.name}
                        </h3>
                        <p className="text-xs leading-relaxed text-slate-600">
                          {arch.tagline}
                        </p>
                        <p className="pt-1 text-[11px] italic text-slate-500">
                          {arch.examples}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
