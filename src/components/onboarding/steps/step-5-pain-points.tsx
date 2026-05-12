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
import { Textarea } from "@/components/ui/textarea"
import { PAIN_POINT_PLACEHOLDERS } from "@/lib/onboarding/constants"
import type { OnboardingFormData } from "@/lib/onboarding/types"

export function Step5PainPoints() {
  const form = useFormContext<OnboardingFormData>()
  const industry = form.watch("industry")
  const painPoints = form.watch("pain_points") || ""

  const placeholder =
    PAIN_POINT_PLACEHOLDERS[industry] || PAIN_POINT_PLACEHOLDERS.other

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
          Câu 5
        </p>
        <h2 className="text-2xl font-bold text-slate-900">
          Khách hàng tìm đến bạn vì điều gì?
        </h2>
        <p className="text-sm text-slate-600">
          Liệt kê 2-3 vấn đề chính khách hàng muốn giải quyết. AI dùng pain
          points để chọn góc viết bài hấp dẫn.
        </p>
      </header>

      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <FormField
          control={form.control}
          name="pain_points"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Pain points của khách hàng{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder={placeholder}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {painPoints.length}/500 ký tự (tối thiểu 50). Phân cách mỗi
                pain bằng dấu `/` hoặc xuống dòng.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
