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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { INDUSTRIES } from "@/lib/onboarding/constants"
import type { OnboardingFormData } from "@/lib/onboarding/types"

export function Step1BrandBasics() {
  const form = useFormContext<OnboardingFormData>()
  const industry = form.watch("industry")
  const isOther = industry === "other"

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
          Câu 1
        </p>
        <h2 className="text-2xl font-bold text-slate-900">
          Giới thiệu doanh nghiệp
        </h2>
        <p className="text-sm text-slate-600">
          AI cần biết tên thương hiệu và ngành nghề để viết content đúng vocabulary.
        </p>
      </header>

      <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-6">
        <FormField
          control={form.control}
          name="brand_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tên thương hiệu <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="VD: Ladysfit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slogan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slogan / Tagline</FormLabel>
              <FormControl>
                <Input
                  placeholder="VD: Phòng tập dành riêng cho phụ nữ"
                  {...field}
                />
              </FormControl>
              <FormDescription>Tuỳ chọn, tối đa 150 ký tự</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Ngành nghề <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ngành nghề..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind.value} value={ind.value}>
                      {ind.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isOther && (
          <FormField
            control={form.control}
            name="industry_custom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên ngành cụ thể <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="VD: Nông sản hữu cơ"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  )
}
