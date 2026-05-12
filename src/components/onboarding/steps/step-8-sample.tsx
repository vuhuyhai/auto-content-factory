"use client"

import { Sparkles } from "lucide-react"
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

export function Step8Sample() {
  const form = useFormContext<OnboardingFormData>()
  const sample = form.watch("sample_content") || ""

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
          Câu 8 - Tuỳ chọn
        </p>
        <h2 className="text-2xl font-bold text-slate-900">
          Bài viết hay nhất bạn đã đăng
        </h2>
        <p className="text-sm text-slate-600">
          Paste 1-3 bài Facebook/blog bạn hài lòng nhất. AI sẽ học phong cách
          viết và áp dụng cho content tương lai.
        </p>
      </header>

      <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <Sparkles className="h-4 w-4 shrink-0" />
        <p>
          <span className="font-semibold">+30% chất lượng</span> nếu paste 3
          bài mẫu. Có thể thêm sau ở Settings.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <FormField
          control={form.control}
          name="sample_content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bài viết mẫu (tuỳ chọn)</FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  placeholder="Paste 1-3 bài viết tại đây. Phân cách mỗi bài bằng dòng trống hoặc dấu ---"
                  className="font-mono text-xs"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {sample.length}/5000 ký tự. Để trống nếu chưa có bài mẫu.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
