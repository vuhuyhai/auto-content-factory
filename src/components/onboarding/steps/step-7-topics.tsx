"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { TOPICS_BY_INDUSTRY } from "@/lib/onboarding/constants"
import type { OnboardingFormData } from "@/lib/onboarding/types"

/**
 * Chuyển tên brand thành prefix viết tắt cho hashtag.
 * VD: "Ladysfit" → "LF", "Vietnam Society of Excellence" → "VSE"
 */
function getBrandPrefix(brandName: string): string {
  const cleaned = brandName.trim()
  if (!cleaned) return "BR"
  const words = cleaned.split(/\s+/).filter(Boolean)
  if (words.length === 1) {
    const w = words[0]
    return w.length <= 4 ? w.toUpperCase() : (w[0] + w[w.length - 1]).toUpperCase()
  }
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

/**
 * Chuyển topic Việt thành slug ASCII cho hashtag.
 * VD: "Giảm cân" → "GiamCan", "Tập sau sinh" → "TapSauSinh"
 */
function topicToSlug(topic: string): string {
  return topic
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("")
}

export function Step7Topics() {
  const form = useFormContext<OnboardingFormData>()
  const industry = form.watch("industry")
  const brandName = form.watch("brand_name") || ""
  const selectedTopics = form.watch("topics") || []

  const availableTopics =
    TOPICS_BY_INDUSTRY[industry] || TOPICS_BY_INDUSTRY.other

  // Auto-generate hashtags whenever topics change
  useEffect(() => {
    const prefix = getBrandPrefix(brandName)
    const hashtags = selectedTopics.map(
      (t) => `#${prefix}_${topicToSlug(t)}`,
    )
    form.setValue("hashtags", hashtags, { shouldValidate: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopics.join("|"), brandName])

  const currentHashtags = form.watch("hashtags") || []

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
          Câu 7
        </p>
        <h2 className="text-2xl font-bold text-slate-900">
          Bạn muốn nói về chủ đề gì?
        </h2>
        <p className="text-sm text-slate-600">
          Topics dùng để search news. Hashtags rotate trong content để tránh
          trùng lặp.
        </p>
      </header>

      <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6">
        <FormField
          control={form.control}
          name="topics"
          render={() => (
            <FormItem>
              <FormLabel>
                Chọn 3-5 chủ đề chính{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormDescription>
                Đã chọn: {selectedTopics.length}/5
              </FormDescription>
              <div className="grid gap-2 pt-2 md:grid-cols-2">
                {availableTopics.map((topic) => (
                  <FormField
                    key={topic}
                    control={form.control}
                    name="topics"
                    render={({ field }) => {
                      const checked = field.value?.includes(topic)
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
                                if (current.length >= 5) return
                                field.onChange([...current, topic])
                              } else {
                                field.onChange(
                                  current.filter((t) => t !== topic),
                                )
                              }
                            }}
                          />
                          <span className="text-sm text-slate-700">
                            {topic}
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

        <div className="space-y-2 border-t pt-4">
          <FormLabel>Hashtag tự động</FormLabel>
          <FormDescription>
            ACF tạo từ tên brand và chủ đề đã chọn. Bạn có thể edit sau.
          </FormDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            {currentHashtags.length === 0 ? (
              <p className="text-sm italic text-slate-400">
                Chọn chủ đề ở trên để tự sinh hashtag
              </p>
            ) : (
              currentHashtags.map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-sm text-slate-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      const next = currentHashtags.filter((_, i) => i !== idx)
                      form.setValue("hashtags", next, {
                        shouldValidate: true,
                      })
                    }}
                    className="text-slate-400 hover:text-slate-700"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
