import type { ReactNode } from "react"

import Sidebar from "./sidebar"
import MobileDrawer from "./mobile-drawer"
import UserMenu from "./user-menu"

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
        <UserMenu />
      </header>

      <main className="md:pl-60">
        <header className="hidden md:flex md:h-16 md:items-center md:justify-end md:px-8 md:border-b md:border-gray-200 md:bg-white md:sticky md:top-0 md:z-20">
          <UserMenu />
        </header>

        <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
      </main>
    </div>
  )
}
