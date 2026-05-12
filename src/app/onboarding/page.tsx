import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"

export const dynamic = "force-dynamic"

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check user đã có brand chưa
  const { data: existingBrand } = await supabase
    .from("brands")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle()

  if (existingBrand) {
    redirect("/dashboard")
  }

  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="mb-6 space-y-2 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
          Onboarding
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          Tạo Brand Voice của bạn
        </h1>
        <p className="text-sm text-slate-600">
          8 câu hỏi (~7 phút) để AI hiểu giọng nói thương hiệu của bạn.
        </p>
      </div>
      <OnboardingShell />
    </div>
  )
}
