import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

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
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
          Onboarding
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Tạo Brand Voice của bạn
        </h1>
        <p className="mx-auto max-w-md text-base text-slate-600">
          8 câu hỏi (~7 phút) để AI hiểu giọng nói thương hiệu của bạn và tự
          viết content đúng phong cách.
        </p>
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        🚧 M1 placeholder - M2 sẽ thay bằng form 8 step
      </div>
    </div>
  )
}
