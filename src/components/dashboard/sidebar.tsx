import { Sparkles } from "lucide-react"

import SidebarNav from "./sidebar-nav"

interface SidebarProps {
  draftCount?: number
}

export default function Sidebar({ draftCount = 0 }: SidebarProps) {
  return (
    <aside className="hidden md:flex md:flex-col md:w-60 md:fixed md:inset-y-0 md:left-0 md:border-r md:border-gray-200 md:bg-white md:z-30">
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        <Sparkles className="h-5 w-5 text-red-600" />
        <span className="ml-2 text-base font-bold text-gray-900">
          Auto Content
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SidebarNav draftCount={draftCount} />
      </div>
    </aside>
  )
}
