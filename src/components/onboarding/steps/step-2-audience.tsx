"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { AGE_RANGES } from "@/lib/onboarding/constants"
import type { OnboardingFormData } from "@/lib/onboarding/types"

const GENDER_OPTIONS = [
  { value: "female", label: "Chủ yếu nữ" },
  { value: "male", label: "Chủ yếu nam" },
  { value: "mixed", label: "Cả hai cân bằng" },
] as const

export function Step2Audience() {
  const form = useFormContext<OnboardingFormData>()
  const persona = form.watch("persona_description") || ""

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
          Câu 2
        </p>
        <h2 className="text-2xl font-bold text-slate-900">
          Khách hàng lý tưởng của bạn
        </h2>
        <p className="text-sm text-slate-600">
          AI dùng thông tin này để chọn tone và ví dụ phù hợp với độc giả.
        </p>
      </header>

      <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6">
        <FormField
          control={form.control}
          name="age_range"
          render={() => (
            <FormItem>
              <FormLabel>
                Độ tuổi <span className="text-red-500">*</span>
              </FormLabel>
              <FormDescription>Chọn 1-2 nhóm tuổi chủ yếu</FormDescription>
              <div className="grid gap-2 pt-2 md:grid-cols-2">
                {AGE_RANGES.map((age) => (
                  <FormField
                    key={age.value}
                    control={form.control}
                    name="age_range"
                    render={({ field }) => {
                      const checked = field.value?.includes(age.value)
                      return (
                        <label
                          className={
                            "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 transition " +
                            (checked
                              ? "border-slate-900 bg-slate-50"
                              : "border-slate-200 hover:border-slate-300")
                          }
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(value) => {
                              const current = field.value || []
                              if (value) {
                                if (current.length >= 2) return
                                field.onChange([...current, age.value])
                              } else {
                                field.onChange(
                                  current.filter((v) => v !== age.value),
                                )
                              }
                            }}
                          />
                          <span className="text-sm text-slate-700">
                            {age.label}
                          </span>
                        </label>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender_focus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Giới tính chủ đạo <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  className="grid gap-2 pt-2 md:grid-cols-3"
                >
                  {GENDER_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={
                        "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 transition " +
                        (field.value === opt.value
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 hover:border-slate-300")
                      }
                    >
                      <RadioGroupItem value={opt.value} />
                      <span className="text-sm text-slate-700">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="persona_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mô tả khách hàng lý tưởng trong 1-2 câu{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="VD: Phụ nữ 28-45 đã có con, đi làm văn phòng, muốn giảm cân an toàn sau sinh nhưng không có thời gian tự tập"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {persona.length}/300 ký tự (tối thiểu 20)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
