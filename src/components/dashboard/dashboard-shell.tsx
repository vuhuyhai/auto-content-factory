import type { ReactNode } from "react"

import Sidebar from "./sidebar"
import MobileDrawer from "./mobile-drawer"

interface DashboardShellProps {
  children: ReactNode
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <header className="md:hidden h-16 flex items-center justify-between px-4 bg-white border-b border-gray-200 sticky top-0 z-20">
        <MobileDrawer />
        <span className="text-base font-bold text-gray-900">Auto Content</span>
        <div className="w-10" />
      </header>

      <main className="md:pl-60">
        <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
      </main>
    </div>
  )
}
