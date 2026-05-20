// Footer - 4 cột (logo + 3 nav columns) + bottom bar
// Background slate-900 dark để tách rõ khỏi trang trắng
// Accent token accent-acf chỉ ở hover social

import Link from "next/link";

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12Z" />
    </svg>
  );
}

interface NavLink {
  label: string;
  href: string;
}

interface NavColumn {
  title: string;
  links: NavLink[];
}

const NAV_COLUMNS: NavColumn[] = [
  {
    title: "Sản phẩm",
    links: [
      { label: "Tính năng", href: "/#features" },
      { label: "Bảng giá", href: "/#pricing" },
      { label: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    title: "Tài nguyên",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Hướng dẫn", href: "/docs" },
    ],
  },
  {
    title: "Pháp lý",
    links: [
      { label: "Điều khoản", href: "/terms" },
      { label: "Bảo mật", href: "/privacy" },
      { label: "Liên hệ", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <span className="text-lg font-semibold text-white">Auto-Content Factory</span>
            <p className="text-sm italic text-slate-400 leading-relaxed">
              Tự động hoá content. Giữ giọng brand.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Vận hành bởi Vũ Hải - Vietnam Society of Excellence.
            </p>
          </div>

          {NAV_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col">
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © 2026 Auto-Content Factory. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="https://facebook.com"
              aria-label="Facebook"
              className="text-slate-400 hover:text-accent-acf transition-colors duration-200"
            >
              <FacebookIcon size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
