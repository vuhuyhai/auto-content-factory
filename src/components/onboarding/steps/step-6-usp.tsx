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
import type { OnboardingFormData } from "@/lib/onboarding/types"

export function Step6USP() {
  const form = useFormContext<OnboardingFormData>()
  const usp = form.watch("usp") || ""

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
          Câu 6
        </p>
        <h2 className="text-2xl font-bold text-slate-900">
          Điều gì khiến bạn khác biệt?
        </h2>
        <p className="text-sm text-slate-600">
          USP (Unique Selling Point) sẽ được AI nhắc đến tự nhiên trong content,
          giúp brand nổi bật so với đối thủ.
        </p>
      </header>

      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <FormField
          control={form.control}
          name="usp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Bạn giúp khách hàng tốt hơn đối thủ ở điểm nào?{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="VD: Chúng tôi là phòng tập duy nhất chỉ dành cho phụ nữ với PT nữ 100%, không có nam khách trong khu vực tập"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {usp.length}/300 ký tự (tối thiểu 30)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
