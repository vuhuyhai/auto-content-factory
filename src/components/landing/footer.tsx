// Footer - 4 cột (logo + 3 nav columns) + bottom bar
// Background slate-900 dark để tách rõ khỏi trang trắng
// Accent token accent-acf chỉ ở hover social

import Link from "next/link";

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
          {/* TODO: Hien lai icon Facebook khi co fanpage chinh thuc cua ACF */}
        </div>
      </div>
    </footer>
  );
}
