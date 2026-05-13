"use client"

import { useState } from "react"
import { Menu, Sparkles } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import SidebarNav from "./sidebar-nav"

interface MobileDrawerProps {
  draftCount?: number
}

export default function MobileDrawer({ draftCount = 0 }: MobileDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Mở menu"
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-gray-100"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <Sparkles className="h-5 w-5 text-red-600" />
          <span className="ml-2 text-base font-bold text-gray-900">
            Auto Content
          </span>
        </div>
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SidebarNav onItemClick={() => setOpen(false)} draftCount={draftCount} />
      </SheetContent>
    </Sheet>
  )
}
