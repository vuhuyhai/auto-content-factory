import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { getCurrentUserBrand } from '@/lib/brands/queries'
import { guideToFormData } from '@/lib/brands/converters'
import { BrandVoiceCard } from '@/components/onboarding/brand-voice-card'
import { UpgradeCard } from '@/components/billing/upgrade-card'

export default async function DashboardPage() {
  const brand = await getCurrentUserBrand()

  if (!brand || !brand.brand_voice_guide) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <Sparkles className="h-10 w-10 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Chưa có Brand Voice
          </h2>
          <p className="text-gray-600 mb-6">
            Tạo Brand Voice để bắt đầu viết content tự động.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Tạo Brand Voice ngay
          </Link>
        </div>
      </div>
    )
  }

  const formData = guideToFormData(brand.brand_voice_guide)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Brand Voice của bạn
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Đây là hệ thống giọng văn riêng của brand {brand.name}, dùng để tạo mọi content.
        </p>
      </div>
      <BrandVoiceCard data={formData} readonly />
      <UpgradeCard />
    </div>
  )
}
