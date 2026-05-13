"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, Zap, FileText, Settings } from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Brand Voice", icon: Sparkles, key: "brand" },
  { href: "/dashboard/workflows", label: "Workflows", icon: Zap, key: "workflows" },
  { href: "/dashboard/contents", label: "Nội dung", icon: FileText, key: "contents" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, key: "settings" },
] as const

interface SidebarNavProps {
  onItemClick?: () => void
  draftCount?: number
}

export default function SidebarNav({ onItemClick, draftCount = 0 }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 p-4">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href))
        const showBadge = item.key === "contents" && draftCount > 0
        const badgeText = draftCount > 99 ? "99+" : String(draftCount)

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {showBadge && (
              <span className="inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 font-mono text-xs font-semibold text-white">
                {badgeText}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
