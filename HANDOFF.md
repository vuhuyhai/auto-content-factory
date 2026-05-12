# HANDOFF - Auto-Content Factory

## 1. Overview

**Project:** Auto-Content Factory (ACF)
**One-liner:** SaaS giúp SMB Việt Nam tự động hoá viết content social bằng brand voice riêng.
**Owner:** Vũ Hải (Chairman VSE, CEO Ladysfit)
**Started:** 12/05/2026
**Target launch:** Tuần 4 (~09/06/2026)
**Status:** Week 1 Day 2 - Auth flow email/password DONE ✅

## 2. Current State

- ✅ Cursor pack v2.0 active (CLAUDE.md + 4 rules)
- ✅ Next.js 16.2.6 + TypeScript + Tailwind + Turbopack
- ✅ Supabase Pro plan connected (region ap-southeast-1, Singapore)
- ✅ Drizzle ORM + 6 table deployed to production DB
- ✅ GitHub repo `vuhuyhai/auto-content-factory` với 7 commits
- ✅ Supabase Auth helpers (server, client, middleware utility)
- ✅ Middleware bảo vệ /dashboard (redirect 307 về /login nếu chưa auth)
- ✅ Login page email/password với Server Action + useActionState
- ✅ Signup page với email verification flow
- ✅ Confirm-email page (post-signup)
- ✅ Dashboard placeholder hiển thị user email + UUID
- ✅ Smoke test E2E Day 2 PASS 4/4 (Landing, Middleware, Signup, Login → Dashboard)
- ⏳ Google OAuth provider (Day 3 đầu giờ)
- ⏳ Profile auto-create trigger (Day 4)
- ⏳ RLS enable cho 6 table (Day 4)
- ⏳ Landing page bento design (Day 5-7)

## 3. Done So Far

### Day 1 (12/05/2026)
- Cài Cursor pack v2.0 (CLAUDE.md + .cursor/rules/*.mdc)
- Init Next.js 16.2.6 với TypeScript, Tailwind, src-dir, App Router
- Install 33 packages: Supabase SDK + Drizzle ORM + Postgres driver + UI utilities
- Setup `.env.local` với 5 biến core (Supabase + Anthropic)
- Tạo schema 6 table: profiles, brands, workflows, contents, content_logs, subscriptions
- Push migration lên Supabase production thành công
- Smoke test localhost OK (browser load `http://localhost:3000`)

**Commits Day 1:**
- `81a10bd` - Initial commit from Create Next App
- `b6c2bc3` - chore: add Cursor pack v2.0 and core dependencies
- `bae7638` - feat(week1-day1): add Drizzle ORM schema with 6 tables and Supabase migration

### Day 2 (12/05/2026)
- Setup Supabase Auth helpers (server, client, middleware utility) trong `src/lib/supabase/`
- Tạo middleware ở `src/middleware.ts` (KHÔNG phải root - quy ước Next.js 16 với src/)
- Build Login page với Server Action `signInWithPassword` + useActionState + Vietnamese UI
- Build Signup page với Server Action `signUp` + validation password 8+ ký tự
- Build Confirm-email page (post-signup screen)
- Build Dashboard placeholder hiển thị user email + UUID từ Supabase server client
- Tạo test user `test-day2@autocontentfactory.com` trên Supabase Dashboard (Auto Confirm)
- Smoke test E2E qua browser PASS 4/4:
  - Landing `/` 200 OK
  - `/dashboard` chưa auth → 307 → `/login` (middleware redirect chuẩn)
  - `/signup` render đúng form 2 input + button + link
  - Login flow: điền credentials → vào `/dashboard` → thấy email + UUID đúng

**Commits Day 2:**
- `25c6e5f` - feat(week1-day2): add Supabase Auth helpers (server, client, middleware)
- `a13830a` - feat(week1-day2): protect /dashboard route with auth middleware
- `67d6226` - feat(week1-day2): add login page with Server Action + dashboard placeholder
- `08d23b3` - feat(week1-day2): add signup page + confirm-email screen

## 4. Architecture Decisions

| Decision | Lý do |
|---|---|
| Next.js 16.2.6 App Router | Default stack instruction, SSR/SSG, Vercel native |
| Supabase Auth + Postgres | Free tier OK 100 customer đầu, không cần Clerk |
| Drizzle ORM (không Prisma) | Type-safe, light, better DX với TypeScript |
| Postgres Session Pooler port 5432 | Mạng Việt Nam IPv4 only, Transaction Pooler IPv6 fail |
| 1 brand/user trong MVP | Cắt scope, Phase 2 multi-brand |
| 3 tier: Free/Starter/Pro | Cắt từ 5 tier xuống |
| PayOS (không Stripe) | VND-native, QR payment phù hợp SMB VN |
| Bento Grid design | Apple discipline + mobile-first |
| Middleware ở `src/middleware.ts` (không root) | Next.js 16 + folder src/ requires this path |
| Route group `(auth)` cho login/signup | Gom auth pages, share layout sau này, URL gọn `/login` không phải `/auth/login` |
| Server Action + useActionState | Pattern Next.js 16 chuẩn cho form, không cần API route riêng |
| Email/password trước, OAuth sau | Cắt scope Day 2, Google OAuth dời Day 3 (cần thao tác tay Google Cloud Console) |

## 5. Known Issues

- RLS chưa enable trên 6 table (tất cả UNRESTRICTED) - sẽ enable Week 2 Day 4 sau khi có Profile trigger
- Supabase maintenance scheduled 13-14/05/2026 (Shared pooler ap-southeast-1)
- PayOS chưa setup (Week 4)
- Resend chưa verify domain (Week 3)
- Cloudflare R2 bucket `acf-assets` chưa tạo (Week 2-3)
- Domain `autocontentfactory.com` chưa point Vercel (Week 4)
- Google OAuth chưa setup (Day 3 đầu giờ - cần Google Cloud Console OAuth 2.0 Client ID)
- Next.js 16 warning: `middleware` file convention deprecated → sẽ đổi sang `proxy.ts` (Day 5+ khi research kỹ docs)
- Test user `test-day2@autocontentfactory.com` còn trên Supabase Dashboard - cleanup khi nào hết test

## 6. Next Steps

### Day 3: Google OAuth + Profile auto-create chuẩn bị

**Phase 1 - Google OAuth setup (anh + em phối hợp):**
- Anh tạo Google Cloud Console project + OAuth 2.0 Client ID (thao tác tay)
- Anh setup Authorized redirect URI: `https://fnhgtxxuudnqxxmzdpjx.supabase.co/auth/v1/callback`
- Anh paste Client ID + Secret vào Supabase Dashboard → Authentication → Providers → Google
- Em viết code thêm nút "Sign in with Google" vào login/signup page (gọi `supabase.auth.signInWithOAuth({ provider: 'google' })`)
- Em viết callback handler `/auth/callback/route.ts` xử lý OAuth code exchange

**Phase 2 - Smoke test OAuth:**
- Test luồng Google OAuth end-to-end qua browser
- Verify session cookie set đúng sau khi callback

### Day 4: Profile auto-create trigger + Enable RLS

- Viết SQL trigger function trên `auth.users` INSERT → tự tạo row trong `public.profiles`
- Push migration qua Supabase MCP
- Test signup flow end-to-end → verify profile row tự tạo
- Enable RLS cho 6 table với policy cơ bản (user chỉ đọc/sửa data của mình)
- Test RLS bằng dual-client test (anon vs authenticated)

### Day 5-7: Landing page + Pricing (Bento Grid)

- Bento Grid hero + 4 feature cards
- Pricing section 3 tier (Free/Starter/Pro)
- Footer + CTA "Đăng ký free"
- Mobile responsive audit
- Skill `bento-grid` reference trong Project knowledge

## 7. Context cho AI

### Stack
- Frontend: Next.js 16.2.6 App Router, TypeScript, Tailwind, shadcn/ui (sẽ add Day 5)
- Backend: Next.js API routes + Server Actions
- DB: Supabase Postgres + Drizzle ORM
- Auth: Supabase Auth (email/password DONE, Google OAuth pending Day 3)
- AI: Claude API Sonnet 4.6 (brand voice tiếng Việt)
- Email: Resend (Week 3)
- Cron: Vercel Cron
- Payment: PayOS
- Storage: Cloudflare R2 (bucket acf-assets)
- Hosting: Vercel
- Monitoring: Sentry

### Working Environment
- OS: Windows 11
- Project root: D:\auto-content-factory
- Repo: https://github.com/vuhuyhai/auto-content-factory
- Production URL: https://autocontentfactory.com (chưa connect Vercel)
- Vercel project: auto-content-factory (vuhuyhais-projects)
- Supabase: fnhgtxxuudnqxxmzdpjx (Pro plan, ap-southeast-1)
- Admin email: fitnessviet@gmail.com
- Test user (Day 2): test-day2@autocontentfactory.com

### Project structure (sau Day 2)
```
src/
├── middleware.ts (Next.js 16 + src/ folder convention)
├── lib/
│   └── supabase/
│       ├── server.ts (createServerClient cho Server Component)
│       ├── client.ts (createBrowserClient cho Client Component)
│       └── middleware.ts (updateSession utility)
└── app/
    ├── (auth)/
    │   ├── login/
    │   │   ├── page.tsx
    │   │   └── actions.ts
    │   └── signup/
    │       ├── page.tsx
    │       └── actions.ts
    ├── auth/
    │   └── confirm-email/
    │       └── page.tsx
    └── dashboard/
        └── page.tsx
```

### Mental model
- Productized Service first, SaaS second
- Vietnamese SMB owner 30-50 tuổi, mobile-first
- Quality over quantity (1 bài tốt > 10 bài mediocre)
- Speed over polish (MVP scrappy hơn beautiful broken)
- Brand voice không "AI-generated" feeling

### Proven pattern reference
- File `03_VSE_News_Auto_Writer.md` trong Project knowledge = workflow đã chạy production
- Port pattern này sang web app trong Week 2-3

### Scope cắt khỏi MVP (Phase 2 sẽ làm)
- ❌ Multi-brand per user
- ❌ Workflow types (chỉ news_based)
- ❌ Tier Business + Enterprise
- ❌ Auto-post Facebook/LinkedIn
- ❌ Image gen tự động (chỉ tạo text prompt)
- ❌ Brand voice training từ bài cũ
- ❌ i18n English toggle
- ❌ PostHog analytics

### Bài học Day 1 (quan trọng)
1. **Mạng Việt Nam IPv4 only** → KHÔNG dùng Transaction Pooler (IPv6), PHẢI dùng Session Pooler (IPv4)
2. **Paste DATABASE_URL cẩn thận** → tránh thừa `DATABASE_URL=` trong giá trị
3. **Password leak vào chat** → rotate ngay, không tiếc

### Bài học Day 2 (quan trọng)
1. **Next.js 16 + folder `src/`** → middleware PHẢI ở `src/middleware.ts`, KHÔNG phải root project. Hậu quả nếu sai: file middleware hoàn toàn không được pick up, không có log, request đi thẳng vào route handler. Verify với docs Next.js official trước khi tạo file config-related.
2. **PowerShell `taskkill /PID` không đáng tin** → có thể báo "process not found" nhưng process vẫn chiếm port. Dùng `Get-NetTCPConnection -LocalPort N -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }` để kill theo port (robust hơn).
3. **PowerShell parse `()` thành subexpression** → path chứa `(auth)` phải quote bằng `"..."`: `Test-Path "src\app\(auth)\..."`. Luôn quote path có ký tự đặc biệt (`(`, `)`, `[`, `]`, space, `&`, `$`).
4. **Sau khi tạo/move middleware → BẮT BUỘC restart `npm run dev`** → Turbopack không hot-reload thay đổi structure middleware. Tương tự cho mọi file Next.js config (`next.config.ts`, `tsconfig.json`, route group folder mới).
5. **Curl alias trong PowerShell** → `curl -I` parse sai (gọi `Invoke-WebRequest`). Dùng `curl.exe -I` để gọi curl thật của Windows 10 1804+.
6. **Server Action redirect không return** → dùng `redirect('/path')` trực tiếp, KHÔNG `return redirect(...)`. `redirect` throws internally.
7. **Next.js 16 deprecate `middleware` → `proxy`** → warning hiện ra ở build time nhưng vẫn chạy được. Sẽ migrate Day 5+.
