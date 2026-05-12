"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Slider } from "@/components/ui/slider"
import type { OnboardingFormData } from "@/lib/onboarding/types"

interface SliderConfig {
  name: "formality" | "humor" | "emotion"
  label: string
  leftLabel: string
  rightLabel: string
  samples: Record<number, string>
}

const SLIDERS: SliderConfig[] = [
  {
    name: "formality",
    label: "Trang trọng ←→ Thân mật",
    leftLabel: "Trang trọng",
    rightLabel: "Thân mật",
    samples: {
      0: '"Kính gửi quý khách hàng, công ty trân trọng thông báo..."',
      3: '"Xin chào anh chị, chúng tôi muốn chia sẻ..."',
      6: '"Chào anh chị, em muốn kể anh chị nghe..."',
      9: '"Hey mọi người, mình có cái này hay lắm..."',
    },
  },
  {
    name: "humor",
    label: "Nghiêm túc ←→ Hài hước",
    leftLabel: "Nghiêm túc",
    rightLabel: "Hài hước",
    samples: {
      0: '"Đây là phân tích nghiêm túc về xu hướng thị trường..."',
      3: '"Câu chuyện này có thể bạn quan tâm..."',
      6: '"Nghe có vẻ vô lý nhưng đây là sự thật..."',
      9: '"Ơ kìa, tưởng đùa mà hoá ra đời thật =))"',
    },
  },
  {
    name: "emotion",
    label: "Logic ←→ Cảm xúc",
    leftLabel: "Logic",
    rightLabel: "Cảm xúc",
    samples: {
      0: '"Dữ liệu cho thấy 73% khách hàng phản hồi tích cực..."',
      3: '"Nghiên cứu chỉ ra rằng phương pháp này hiệu quả..."',
      6: '"Em nhớ ngày đầu tiên gặp khách hàng này..."',
      9: '"Em rớt nước mắt khi đọc dòng tin nhắn ấy..."',
    },
  },
]

function getSample(samples: Record<number, string>, value: number): string {
  const keys = Object.keys(samples)
    .map(Number)
    .sort((a, b) => a - b)
  let closest = keys[0]
  for (const k of keys) {
    if (k <= value) closest = k
  }
  return samples[closest]
}

export function Step4Tone() {
  const form = useFormContext<OnboardingFormData>()

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
          Câu 4
        </p>
        <h2 className="text-2xl font-bold text-slate-900">
          Điều chỉnh độ tinh tế của giọng nói
        </h2>
        <p className="text-sm text-slate-600">
          Archetype set base voice, các slider này fine-tune. Mỗi slider 0-10
          với sample text thay đổi realtime.
        </p>
      </header>

      <div className="space-y-8 rounded-lg border border-slate-200 bg-white p-6">
        {SLIDERS.map((cfg) => (
          <FormField
            key={cfg.name}
            control={form.control}
            name={cfg.name}
            render={({ field }) => {
              const value = (field.value as number) ?? 5
              const sample = getSample(cfg.samples, value)
              return (
                <FormItem className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium text-slate-900">
                      {cfg.label}
                    </FormLabel>
                    <span className="text-sm font-bold tabular-nums text-slate-900">
                      {value}/10
                    </span>
                  </div>

                  <div className="rounded-md bg-slate-50 px-3 py-2 text-sm italic text-slate-700">
                    {sample}
                  </div>

                  <FormControl>
                    <Slider
                      min={0}
                      max={10}
                      step={1}
                      value={[value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{cfg.leftLabel}</span>
                    <span>{cfg.rightLabel}</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        ))}
      </div>
    </div>
  )
}
