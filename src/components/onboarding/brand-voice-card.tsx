"use client"

import { CheckCircle2, Pencil, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ARCHETYPES, INDUSTRIES } from "@/lib/onboarding/constants"
import type { ArchetypeKey, OnboardingFormData } from "@/lib/onboarding/types"

interface BrandVoiceCardProps {
  data: OnboardingFormData
  isSubmitting?: boolean
  onConfirm?: () => void
  onEdit?: (step: number) => void
  readonly?: boolean
}

function getIndustryLabel(value: string, custom: string): string {
  if (value === "other" && custom) return custom
  return INDUSTRIES.find((i) => i.value === value)?.label || value
}

function getGenderLabel(value: string): string {
  switch (value) {
    case "female":
      return "Chủ yếu nữ"
    case "male":
      return "Chủ yếu nam"
    case "mixed":
      return "Cả hai cân bằng"
    default:
      return "Chưa xác định"
  }
}

function ToneBar({
  label,
  value,
  leftLabel,
  rightLabel,
}: {
  label: string
  value: number
  leftLabel: string
  rightLabel: string
}) {
  const percent = (value / 10) * 100
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">{leftLabel}</span>
        <span className="font-bold tabular-nums text-slate-900">
          {value}/10
        </span>
        <span className="text-slate-500">{rightLabel}</span>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-slate-900 transition-all"
          style={{ width: `${percent}%` }}
          aria-label={`${label}: ${value}/10`}
        />
      </div>
    </div>
  )
}

export function BrandVoiceCard({
  data,
  isSubmitting = false,
  onConfirm,
  onEdit,
  readonly = false,
}: BrandVoiceCardProps) {
  const archetype = ARCHETYPES[data.archetype as ArchetypeKey]
  const industryLabel = getIndustryLabel(data.industry, data.industry_custom)

  return (
    <div className="space-y-6">
      <header className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-900">
          <Sparkles className="h-3 w-3" />
          AI đã hiểu brand của bạn
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Brand Voice Card của bạn
        </h2>
        <p className="text-sm text-slate-600">
          {readonly
            ? 'Đây là brand voice AI dùng để viết nội dung cho bạn.'
            : 'Xem lại brand voice. Bấm biểu tượng bút chì để sửa từng mục, rồi bấm xác nhận.'}
        </p>
      </header>

      <article className="space-y-5 rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-lg md:p-8">
        {/* Brand basics */}
        <section className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                {data.brand_name}
              </h3>
              {data.slogan && (
                <p className="text-sm italic text-slate-600">{data.slogan}</p>
              )}
              <p className="text-xs uppercase tracking-wider text-slate-500">
                {industryLabel}
              </p>
            </div>
            {!readonly && <EditButton onClick={() => onEdit?.(1)} />}
          </div>
        </section>

        <Separator />

        {/* Audience */}
        <section className="space-y-2">
          <SectionHeader
            icon="👤"
            title="Khách hàng lý tưởng"
            onEdit={() => onEdit?.(2)}
            readonly={readonly}
          />
          <div className="flex flex-wrap gap-1.5 text-xs">
            {data.age_range.map((a) => (
              <span
                key={a}
                className="rounded bg-slate-100 px-2 py-0.5 text-slate-700"
              >
                {a}
              </span>
            ))}
            <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700">
              {getGenderLabel(data.gender_focus)}
            </span>
          </div>
          <p className="text-sm text-slate-700">{data.persona_description}</p>
        </section>

        <Separator />

        {/* Archetype */}
        {archetype && (
          <>
            <section className="space-y-2">
              <SectionHeader
                icon="🎭"
                title="Giọng nói"
                onEdit={() => onEdit?.(3)}
                readonly={readonly}
              />
              <div className="flex items-center gap-3">
                <span className="text-2xl">{archetype.emoji}</span>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {archetype.name}
                  </p>
                  <p className="text-xs text-slate-600">{archetype.tagline}</p>
                </div>
              </div>
            </section>

            <Separator />
          </>
        )}

        {/* Tone */}
        <section className="space-y-3">
          <SectionHeader
            icon="🎚️"
            title="Tone calibration"
            onEdit={() => onEdit?.(4)}
            readonly={readonly}
          />
          <div className="space-y-3">
            <ToneBar
              label="Formality"
              value={data.formality}
              leftLabel="Trang trọng"
              rightLabel="Thân mật"
            />
            <ToneBar
              label="Humor"
              value={data.humor}
              leftLabel="Nghiêm túc"
              rightLabel="Hài hước"
            />
            <ToneBar
              label="Emotion"
              value={data.emotion}
              leftLabel="Logic"
              rightLabel="Cảm xúc"
            />
          </div>
        </section>

        <Separator />

        {/* USP */}
        <section className="space-y-2">
          <SectionHeader
            icon="💎"
            title="Điều khác biệt"
            onEdit={() => onEdit?.(6)}
            readonly={readonly}
          />
          <p className="text-sm text-slate-700">{data.usp}</p>
        </section>

        <Separator />

        {/* Topics + Hashtags */}
        <section className="space-y-3">
          <SectionHeader
            icon="📝"
            title="Chủ đề và Hashtag"
            onEdit={() => onEdit?.(7)}
            readonly={readonly}
          />
          <div>
            <p className="mb-1 text-xs font-medium text-slate-500">
              Sẽ nói về
            </p>
            <p className="text-sm text-slate-700">
              {data.topics.join(" · ")}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-slate-500">Hashtag</p>
            <div className="flex flex-wrap gap-1.5">
              {data.hashtags.map((tag, i) => (
                <span
                  key={`${tag}-${i}`}
                  className="rounded bg-slate-900 px-2 py-0.5 text-xs text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {data.sample_content && data.sample_content.trim().length > 0 && (
          <>
            <Separator />
            <section className="space-y-1">
              <SectionHeader
                icon="✨"
                title="Bài viết mẫu đã cung cấp"
                onEdit={() => onEdit?.(8)}
                readonly={readonly}
              />
              <p className="text-xs italic text-emerald-700">
                AI sẽ học phong cách từ {data.sample_content.length} ký tự
                bạn cung cấp (+30% chất lượng)
              </p>
            </section>
          </>
        )}
      </article>

      {/* Action buttons */}
      {!readonly && (
        <div className="flex flex-col gap-3 md:flex-row-reverse">
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 gap-2"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Đang lưu...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Xác nhận và bắt đầu
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onEdit?.(1)}
            disabled={isSubmitting}
            className="flex-1 gap-2"
            size="lg"
          >
            <Pencil className="h-4 w-4" />
            Sửa lại từ đầu
          </Button>
        </div>
      )}
    </div>
  )
}

function SectionHeader({
  icon,
  title,
  onEdit,
  readonly = false,
}: {
  icon: string
  title: string
  onEdit: () => void
  readonly?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
        <span className="text-base">{icon}</span>
        {title}
      </p>
      {!readonly && <EditButton onClick={onEdit} />}
    </div>
  )
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-m-2 inline-flex h-11 w-11 items-center justify-center rounded text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      aria-label="Sửa"
    >
      <Pencil className="h-3.5 w-3.5" />
    </button>
  )
}
