# HANDOFF - Auto-Content Factory

## 1. Overview

**Project:** Auto-Content Factory (ACF)
**One-liner:** SaaS giúp SMB Việt Nam tự động hoá viết content social bằng brand voice riêng.
**Owner:** Vũ Hải (Chairman VSE, CEO Ladysfit)
**Started:** 12/05/2026
**Target launch:** Tuần 4 (~09/06/2026)
**Status:** Week 1 Day 5 - Landing page Bento Grid + Pricing DONE ✅, READY TO DEPLOY

## 2. Current State

- ✅ Cursor pack v2.0 active
- ✅ Next.js 16.2.6 + TypeScript + Tailwind v4 + Turbopack
- ✅ Supabase Pro plan connected (region ap-southeast-1)
- ✅ Drizzle ORM + 6 table với RLS enabled 6/6
- ✅ GitHub repo `vuhuyhai/auto-content-factory` với 16 commits (Day 5 close)
- ✅ Supabase Auth (email/password + Google OAuth)
- ✅ Middleware/Proxy bảo vệ /dashboard
- ✅ Login + Signup + Confirm-email pages
- ✅ Dashboard placeholder
- ✅ Schema profiles: 8 cột, trigger `handle_new_user` auto-create
- ✅ RLS verified dual-client SQL + UI smoke test
- ✅ **shadcn/ui base 4 components (Button, Card, Badge, Separator) - manual paste**
- ✅ **CSS variables shadcn full structure trong globals.css (light + dark + @theme inline + --accent-acf #E63946)**
- ✅ **LANDING_CONTENT.md - BRIDGE Framework 8 phần đầy đủ (content first)**
- ✅ **Landing page 7 sections theo BRIDGE flow:**
  - Hero (Bento Pattern A Hero-Left)
  - Pain (3 lớp - bên ngoài, bên trong, triết lý)
  - Consequence (3 timeline - 6m, 1y, 5y)
  - Pricing (3 tier - Free/Starter/Pro, Pro highlighted)
  - Bonus + Guarantee + Scarcity + Total Value (dark slate-900)
  - Final CTA + PS italic
  - Footer (4 cột dark slate-900)
- ✅ **npm run build PASS - Static for `/`, Dynamic for /dashboard /auth/***
- ✅ TypeScript zero error
- ⏳ Migrate middleware.ts → proxy.ts modern (Day 5+ - Next.js 16 đã tự dùng proxy.ts)
- ✅ **Production: ✅ LIVE - https://auto-content-factory.vercel.app render OK**
- ⏳ Connect domain autocontent.online qua Vercel
- **Last verified:** 12/05/2026 - Day 5 close - 200 OK + Vercel Cache HIT

## 3. Done So Far

### Day 1 (12/05/2026)
- Cài Cursor pack v2.0
- Init Next.js 16.2.6 + TypeScript + Tailwind + Turbopack
- Install 33 packages, setup `.env.local`
- Schema 6 table + push migration lên Supabase production
- Smoke test localhost OK

**Commits Day 1:** `81a10bd`, `b6c2bc3`, `bae7638`

### Day 2 (12/05/2026)
- Supabase Auth helpers + middleware protect /dashboard
- Login + Signup page với Server Action
- Confirm-email + Dashboard placeholder
- Smoke test E2E PASS 4/4

**Commits Day 2:** `25c6e5f`, `a13830a`, `67d6226`, `08d23b3`, `98d1053`, `d50ba32`

### Day 3 (12/05/2026)
- Google OAuth setup (Console + Supabase provider + callback)
- GoogleSignInButton component + Suspense fix
- Fix Vietnamese encoding corrupt
- Smoke test E2E Chrome PASS 6/6
- Domain corrected to autocontent.online

**Commits Day 3:** `ab31bb3`, `f970116`

### Day 4 (12/05/2026)
- Schema migration: thêm avatar_url + updated_at
- Function handle_new_user SECURITY DEFINER + trigger on_auth_user_created
- Enable RLS 6/6 bảng với 16 policies tổng
- Dual-client SQL test pass + UI smoke test pass
- Cleanup test-day2 user

**Commits Day 4:** `0102af8`, `b4096cd`, `e2a3a13`, `398c329`, `8b2c3ff`

### Day 5 (12/05/2026)
- **LANDING_CONTENT.md - BRIDGE Framework 8 phần đầy đủ** (skill bridge-framework-vuhai)
  + Phần 1: Nhân vật (SMB Việt + đặc biệt fitness/F&B/làm đẹp)
  + Phần 2: Vấn đề 3 lớp (4-6h/tuần + 3 lựa chọn đắt + marketing bòn rút)
  + Phần 3: Hậu quả 5 năm cộng dồn
  + Phần 4: Người dẫn đường (Vũ Hải + 18 năm + Ladysfit +30 cơ sở + 25 doanh nghiệp + H-OE)
  + Phần 5: Kế hoạch 3 bước
  + Phần 6: Tương lai 2 ngả
  + Phần 7: Lời chào (3 tier + 3 bonus + 14 days guarantee + scarcity 30/06/2026)
  + Phần 8: Hành động + PS đắt giá
- **shadcn/ui base init - MANUAL PASTE** (CLI fail với Node v24)
  + 4 components: Button, Card, Badge, Separator
  + Install 5 deps: cva, clsx, tailwind-merge, lucide-react, @radix-ui/react-slot
  + globals.css rewrite với full structure shadcn + --accent-acf
- **Build 7 landing sections theo BRIDGE flow:**
  + hero-section.tsx (Bento Pattern A Hero-Left, 99 LOC)
  + pain-section.tsx (3 pain card với eyebrow + icon, 86 LOC)
  + consequence-section.tsx (3 timeline vertical với số nổi bật, 104 LOC)
  + pricing-section.tsx (3 tier card, Pro highlighted với badge + scale, 152 LOC)
  + bonus-guarantee-section.tsx (3 bonus + Guarantee + Scarcity + Total Value dark, 133 LOC)
  + final-cta-section.tsx (CTA callout center + PS italic, 52 LOC)
  + footer.tsx (4 cột dark + inline Facebook SVG, 112 LOC)
- **Polish 4 vấn đề:**
  + Hero feature cards bỏ md:row-span-2 (không rỗng)
  + Pricing cards thêm h-full + mt-auto (align CTA bottom)
  + Bonus section py-16 → py-20 md:py-32 (spacing rộng hơn)
  + Total Value items-center → items-baseline (typography align)
- **Production build PASS:** `/` Static, `/dashboard` Dynamic, 0 TypeScript error

**Commits Day 5 (9 commits):**
- `cbe77ee` docs(week1-day5): add BRIDGE framework landing content
- `d585d67` feat(week1-day5): init shadcn/ui base with 4 components (manual paste)
- `1a2fdc3` feat(week1-day5): hero section bento grid pattern A
- `56a6805` feat(week1-day5): hero section bento grid pattern A (cleanup backup)
- `2dcd994` feat(week1-day5): pain + consequence sections (BRIDGE phan 2-3)
- `a52ff0c` feat(week1-day5): pricing + bonus-guarantee sections (BRIDGE phan 7)
- `0cd077f` feat(week1-day5): final CTA + footer sections (BRIDGE phan 8)
- `f1a9198` polish(week1-day5): fix hero card height, pricing align, bonus spacing
- `<sắp có>` docs(handoff): close Day 5 - landing page ready to deploy

## 4. Architecture Decisions

| Decision | Lý do |
|---|---|
| Next.js 16.2.6 App Router + Turbopack | Default stack, SSR/SSG, Vercel native |
| Supabase Auth + Postgres + Drizzle ORM | Free tier OK 100 user đầu, type-safe |
| RLS 6/6 bảng với subquery pattern | MVP < 1000 user không cần optimize |
| **Tailwind v4 + @theme inline** | Next.js 16 default, syntax mới khác v3 |
| **shadcn/ui MANUAL PASTE (không qua CLI)** | shadcn CLI v4.7.0 fail với Node v24 (@babel/parser bug) |
| **4 components base only** (Button, Card, Badge, Separator) | KISS, không thêm component chưa dùng |
| **CSS variable `--accent-acf: 355 78% 56%` cho color #E63946** | shadcn pattern, dễ override dark mode |
| **Server Components cho TẤT CẢ landing sections** | Static prerender → SEO + speed |
| **Content first (BRIDGE) trước design** | Không thiết kế xong rồi nhồi chữ |
| **Bento Pattern A Hero-Left cho Hero** | Apple discipline, asymmetric balance |
| **3 tier pricing Free/Starter/Pro 0đ/399K/999K** | Vietnamese SMB price-sensitive, Free để thử |
| **Pro card highlighted với border + scale + badge** | Drive conversion to Pro tier |
| **3 bonus cho 100 người Pro đầu** (giá trị 5.5tr) | Scarcity + value framing |
| **14 days refund guarantee** | Reduce friction, build trust |
| **Footer dark slate-900** | Tách rõ khỏi white content, professional |
| **Vietnamese typography: whiteSpace nowrap cho từ ghép** | Tránh cắt "đều đặn", "giọng brand", "tự viết" |

## 5. Known Issues

- **Git history thừa 1 commit hero (1a2fdc3 + 56a6805 cùng message)** - không critical, để vậy, không rebase giữa milestone
- **shadcn CLI fail Node v24** - manual paste workaround, sau này thêm component cần copy thủ công hoặc dùng pnpm dlx
- **Lucide-react brand icons removed** - inline SVG Facebook trong footer, sau cần Twitter/Instagram sẽ tách file `src/components/icons/social.tsx`
- **Next.js 16 warning middleware → proxy** - Next.js đã tự dùng proxy.ts (build output thấy `ƒ Proxy (Middleware)`), warning vẫn xuất hiện vì có cả 2 file
- **Supabase maintenance scheduled 13-14/05/2026** - có thể ảnh hưởng Day 6 sáng
- **PayOS chưa setup** (Week 4)
- **Resend chưa verify domain** (Week 3)
- **Cloudflare R2 bucket acf-assets chưa tạo** (Week 2-3)
- **Domain autocontent.online chưa point Vercel** (làm hôm nay sau deploy)
- **contents.brand_id denormalized có nguy cơ drift** - cần CHECK constraint (Day 6+)
- **Bảng brands có schema nhiều cột hơn dự đoán** - sync Drizzle khi build Brand creation Week 2
- **CTA "Xem cách hoạt động" trong Hero link tới /#how-it-works** - chưa có section đó, cần thêm Week 2 hoặc bỏ button

### D5-6: Vercel Framework Preset bị set "Other" mặc định
- Triệu chứng: Build PASS trên Vercel, URL trả 404 với `X-Vercel-Error: NOT_FOUND`
- Nguyên nhân: Khi import GitHub repo lần đầu, Vercel có thể auto-detect framework SAI thành "Other"
- Fix: Settings → Build and Deployment → Framework Preset → đổi thành "Next.js" → Save → Redeploy với "Use existing Build Cache" UNCHECKED
- Cách kiểm tra nhanh: vào `https://vercel.com/[team]/[project]/settings/build-and-deployment`

### D5-7: KHÔNG dùng `vercel link` với option "Pull env now: YES" khi Vercel server chưa có env
- Triệu chứng: Sau khi chạy `npx vercel link` và chọn YES cho "Pull environment variables now" + YES cho "Overwrite .env.local", file `.env.local` local bị overwrite, mất hết env values, chỉ còn `VERCEL_OIDC_TOKEN`
- Nguyên nhân: Vercel CLI pull env từ environment "Development" trên Vercel server. Nếu server chưa có env, CLI download file rỗng và ghi đè lên `.env.local` local
- Workflow đúng:
  1. Push env từ `.env.local` lên Vercel TRƯỚC (qua Dashboard hoặc CLI `vercel env add`)
  2. Sau đó mới `vercel link` để sync
  3. Hoặc: Khi prompt "Overwrite .env.local? (Y/n)", LUÔN chọn **n**
- Recovery: Lấy lại env từ source service Dashboard (Supabase, Resend, PayOS, Anthropic)

### D5-8: Phải add env vào Vercel cho cả 3 environments
- Triệu chứng: MIDDLEWARE_INVOCATION_FAILED (HTTP 500) trên production
- Nguyên nhân: middleware đọc `process.env.NEXT_PUBLIC_SUPABASE_URL`, nếu Vercel chưa có env thì undefined → createServerClient crash
- Fix: Vercel Dashboard → Settings → Environment Variables → Add 3 Supabase env (URL + anon + service_role), check ALL Environments (Production + Preview + Development)
- Note: Recovery file `.env.local` lưu ý PHẢI giữ lại `VERCEL_OIDC_TOKEN` do CLI auto-manage

## 6. Next Steps

### Ngay sau Day 5 close (HÔM NAY): DEPLOY production

- Pre-deploy checklist
- `git push origin main` → Vercel auto-deploy
- Verify production URL alive (auto-content-factory.vercel.app)
- Connect domain autocontent.online qua Vercel
- Sync env Vercel cả 3 environments (production/preview/development)
- Smoke test production

### Day 6-7 (tuần này): Tech debt + Polish

- Migrate middleware.ts → proxy.ts modern (xoá file middleware.ts cũ)
- Thêm CHECK constraint contents.brand_id = workflows.brand_id
- Sync Drizzle schema cho bảng brands (thêm 7 cột còn thiếu)
- Mobile audit chi tiết 3 viewport nếu có time
- Bỏ hoặc làm /#how-it-works section trong Hero

### Week 2: Brand voice creation flow

- Build dashboard layout
- Build form khai báo brand voice 8 câu hỏi
- Save brand profile vào DB (table brands)
- Bắt đầu integrate Claude API

## 7. Context cho AI

### Stack
- Frontend: Next.js 16.2.6 App Router, TypeScript, Tailwind v4, shadcn/ui (4 components manual)
- Backend: Next.js Server Actions + API routes
- DB: Supabase Postgres + Drizzle ORM (RLS 6/6 bảng)
- Auth: Supabase Auth (email/password + Google OAuth)
- AI: Claude API Sonnet 4.6 (Week 2-3)
- Email: Resend (Week 3)
- Cron: Vercel Cron
- Payment: PayOS (Week 4)
- Storage: Cloudflare R2 bucket acf-assets (Week 2-3)
- Hosting: Vercel
- Monitoring: Sentry (Week 4+)

### Working Environment
- OS: Windows 11
- Project root: D:\auto-content-factory
- Repo: https://github.com/vuhuyhai/auto-content-factory
- Production URL: https://autocontent.online (connect Vercel sau Day 5 deploy)
- Vercel project: auto-content-factory (vuhuyhais-projects)
- Supabase: fnhgtxxuudnqxxmzdpjx (Pro plan, ap-southeast-1)
- Admin email: fitnessviet@gmail.com
- Node version: v24.14.0 (lưu ý shadcn CLI fail)
- npm package manager

### Landing page structure (sau Day 5)
src/
├── middleware.ts (sẽ migrate proxy.ts Day 6)
├── lib/
│   ├── db/schema.ts (Drizzle, profiles 8 cột, sẽ thêm brands fields Week 2)
│   ├── supabase/ (server, client, middleware)
│   └── utils.ts (cn function shadcn)
├── components/
│   ├── ui/ (Button, Card, Badge, Separator - shadcn manual)
│   ├── auth/google-sign-in-button.tsx
│   └── landing/
│       ├── hero-section.tsx (Bento Pattern A)
│       ├── pain-section.tsx
│       ├── consequence-section.tsx
│       ├── pricing-section.tsx
│       ├── bonus-guarantee-section.tsx
│       ├── final-cta-section.tsx
│       └── footer.tsx
└── app/
    ├── page.tsx (import 7 sections)
    ├── globals.css (Tailwind v4 + shadcn vars + --accent-acf)
    ├── (auth)/login + signup
    ├── auth/callback + confirm-email
    └── dashboard

LANDING_CONTENT.md ở root (BRIDGE Framework reference)

### Design System landing
- **Accent color:** #E63946 (HSL 355 78% 56%) via CSS var --accent-acf
- **Border radius:** rounded-[20px] (single value cho mọi card)
- **Gap:** gap-6 desktop (24px), gap-4 mobile (16px)
- **Container max-width:** max-w-7xl mx-auto px-4 md:px-12
- **Section padding:** py-16 md:py-24 (đa số), py-20 md:py-32 (Bonus, spacing rộng hơn)
- **Vietnamese typography:** style={{ wordBreak: "keep-all" }} + <span style={{ whiteSpace: "nowrap" }}> cho cụm từ ghép
- **Background rhythm:** slate-50 → white → slate-100 → white → slate-50 → white → slate-900 (footer)
- **Pattern array + map() cho repeating elements** (3 pain card, 3 timeline, 3 pricing tier, 3 bonus)

### Mental model
- Productized Service first, SaaS second
- Vietnamese SMB owner 30-50 tuổi, mobile-first
- Quality over quantity
- Speed over polish (MVP scrappy hơn beautiful broken)
- Content first - design after (BRIDGE Framework chuẩn)

### Bài học Day 5 (RULES không phải Lessons)

**RULE D5-1: VERIFY CURSOR OUTPUT BẰNG GREP KEYWORD CỤ THỂ, KHÔNG TIN CAM KẾT "ĐÃ CHÈN ĐÚNG".**
Trong Day 5 Cursor báo "đã chèn NBSP \\u00A0 vào 3 vị trí trong H1" nhưng thực tế chèn space thường `{" "}`. Verify bằng grep ASCII match thấy "giọng brand" không có (False) trong khi cam kết là có NBSP. Pattern BẮT BUỘC sau khi Cursor sửa file có ký tự đặc biệt (NBSP, unicode escape, escape sequence):
1. Yêu cầu Cursor báo lại tổng số dòng VÀ verify keyword cụ thể đã chèn
2. PowerShell grep bằng pattern match chính xác (kể cả invisible char)
3. Browser test cuối cùng để confirm render đúng

**RULE D5-2: POWERSHELL HERE-STRING KHÔNG SAFE VỚI TYPESCRIPT GENERIC `<T>`.**
Khi paste code TypeScript có `React.forwardRef<HTMLDivElement, ...>` qua PowerShell here-string `@'...'@`, dấu `<` có thể bị PowerShell ăn mất (especially trong file lớn paste cuối). File card.tsx trong Day 5 mất 6 dấu `<` ở 6 chỗ forwardRef. Pattern BẮT BUỘC:
1. Code TypeScript có generic → DÙNG CURSOR Composer paste, KHÔNG dùng PowerShell here-string
2. Sau khi tạo file có generic → verify bằng `Select-String -Pattern "forwardRef<"`
3. CSS, JSON, markdown vẫn safe với here-string (không có dấu `<` của generic)

**RULE D5-3: SHADCN CLI v4.7.0 FAIL VỚI NODE v24.**
Bug `@babel/parser` ESM resolver. Workaround: manual paste code shadcn từ docs, hoặc dùng pnpm dlx, hoặc downgrade Node v22. Day 5 dùng manual paste 4 component cơ bản, công thức an toàn cho future.

**RULE D5-4: TASK PLAN PHẢI CÓ "CONTENT FIRST" TRƯỚC "DESIGN AFTER".**
Day 5 ban đầu định build UI ngay → anh dừng yêu cầu skill bridge-framework-vuhai → đúng quy trình. LANDING_CONTENT.md trở thành source of truth cho mọi section. Cursor không phải đoán content, chỉ render. Lessons: với mọi project có content-heavy (landing, brochure, doc), LUÔN viết content trước UI.

**RULE D5-5: NEXT.JS 16 KHÔNG SHOW BUNDLE SIZE Ở BUILD OUTPUT.**
Turbopack 16 output đơn giản hơn webpack: chỉ có route type (Static/Dynamic), không có Size + First Load JS như Next.js 15. Để check bundle size phải dùng Vercel Analytics post-deploy hoặc `@next/bundle-analyzer` plugin.

### Lưu ý cho chat tiếp theo

- HANDOFF.md raw URL: https://raw.githubusercontent.com/vuhuyhai/auto-content-factory/main/HANDOFF.md
- Em fetch HANDOFF đầu chat. Nếu cache cũ → cross-check git log local, commit cuối nên là commit `docs(handoff): close Day 5 - landing page deployed` (sau khi anh deploy + commit)
- Day 6 nếu anh tiếp tục: ưu tiên migrate middleware → proxy.ts, sau đó brand voice form
- Day 5 đã verify production build pass, mọi component Server Component, route `/` static SEO-ready
