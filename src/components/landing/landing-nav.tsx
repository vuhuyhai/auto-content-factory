// Landing Nav - sticky top bar voi scroll detection + mobile menu
// Client Component vi can theo doi scroll position
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Tính năng", href: "#features" },
  { label: "Bảng giá", href: "#pricing" },
  { label: "Bonus", href: "#bonus" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="font-bold text-base text-slate-900">
          <span className="md:hidden">ACF</span>
          <span className="hidden md:inline">Auto-Content Factory</span>
        </Link>

        {/* Nav links - desktop only */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA - desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Đăng nhập</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-accent-acf hover:bg-[#d12d3a] text-white"
          >
            <Link href="/signup">Bắt đầu Free</Link>
          </Button>
        </div>

        {/* CTA - mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            asChild
            size="sm"
            className="bg-accent-acf hover:bg-[#d12d3a] text-white"
          >
            <Link href="/signup">Bắt đầu Free</Link>
          </Button>
          <button
            type="button"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden origin-top animate-[slideDown_0.2s_ease-out] border-t border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-2 py-3 text-sm text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-200 pt-3">
              <Button asChild variant="outline" className="w-full">
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  Đăng nhập
                </Link>
              </Button>
              <Button
                asChild
                className="w-full bg-accent-acf hover:bg-[#d12d3a] text-white"
              >
                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  Bắt đầu Free
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
