import type { ReactNode } from "react"

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-dvh bg-slate-50">
      <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-6 md:py-12">
        {children}
      </main>
    </div>
  )
}
