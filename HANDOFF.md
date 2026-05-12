# HANDOFF - Auto-Content Factory

## 1. Overview

**Project:** Auto-Content Factory (ACF)
**One-liner:** SaaS giúp SMB Việt Nam tự động hoá viết content social bằng brand voice riêng.
**Owner:** Vũ Hải (Chairman VSE, CEO Ladysfit)
**Started:** 12/05/2026
**Target launch:** Tuần 4 (~09/06/2026)
**Status:** Week 1 Day 3 - Google OAuth flow DONE ✅

## 2. Current State

- ✅ Cursor pack v2.0 active (CLAUDE.md + 4 rules)
- ✅ Next.js 16.2.6 + TypeScript + Tailwind + Turbopack
- ✅ Supabase Pro plan connected (region ap-southeast-1, Singapore)
- ✅ Drizzle ORM + 6 table deployed to production DB
- ✅ GitHub repo `vuhuyhai/auto-content-factory` với 10 commits
- ✅ Supabase Auth helpers (server, client, middleware utility)
- ✅ Middleware bảo vệ /dashboard (redirect 307 về /login nếu chưa auth)
- ✅ Login page email/password + Google OAuth button
- ✅ Signup page email/password + Google OAuth button
- ✅ Confirm-email page (post-signup)
- ✅ Dashboard placeholder hiển thị user email + UUID
- ✅ Google Cloud Console OAuth 2.0 Client ID configured
- ✅ Supabase Google provider enabled (Client ID + Secret paste đúng format)
- ✅ /auth/callback route handler (exchange code → session)
- ✅ Smoke test E2E Day 3 PASS 6/6 (Login UI, Signup UI, Google OAuth flow, Callback error banner, Middleware protect, Email/password regression)
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
- Smoke test E2E qua browser PASS 4/4

**Commits Day 2:**
- `25c6e5f` - feat(week1-day2): add Supabase Auth helpers (server, client, middleware)
- `a13830a` - feat(week1-day2): protect /dashboard route with auth middleware
- `67d6226` - feat(week1-day2): add login page with Server Action + dashboard placeholder
- `08d23b3` - feat(week1-day2): add signup page + confirm-email screen
- `98d1053` - docs(week1-day1): add HANDOFF and SMOKE_TEST, fix pooler comment
- `d50ba32` - docs(handoff): close Day 2 - email/password Auth flow DONE

### Day 3 (12/05/2026)
- Setup Google Cloud Console project `auto-content-factory` + OAuth 2.0 Client ID (Web application)
- Config OAuth Consent Screen (External, test users: fitnessviet@gmail.com)
- Authorized JavaScript origins: http://localhost:3000 + https://autocontent.online
- Authorized redirect URI: https://fnhgtxxuudnqxxmzdpjx.supabase.co/auth/v1/callback
- Paste Client ID + Secret vào Supabase Dashboard → Authentication → Providers → Google → toggle ON
- Tạo `GoogleSignInButton` client component (inline Google G SVG 4 màu, loading state, error state)
- Tạo `/auth/callback/route.ts` route handler (exchange code for session, redirect to next)
- Update login page: Suspense-wrapped `useSearchParams` để đọc callback error
- Update signup page: thêm GoogleSignInButton với label "Đăng ký với Google"
- Fix Suspense boundary cho `useSearchParams` (Next.js 16 prerender requirement)
- Fix Vietnamese encoding (Cursor lưu file bytes corrupt ban đầu, paste lại qua IDE UI)
- Smoke test E2E qua Chrome PASS 6/6:
  - CHECK 1: Login render đúng tiếng Việt có dấu
  - CHECK 2: Signup render đúng label khác
  - CHECK 3: Google OAuth redirect đến accounts.google.com (sau khi fix Supabase Client ID)
  - CHECK 4: Banner `?error=auth_callback_failed` hiển thị đúng
  - CHECK 5: Middleware vẫn protect /dashboard (redirect 307)
  - CHECK 6: Email/password flow KHÔNG bị break (regression test)

**Commits Day 3:**
- (to be added after commit)

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
| Email/password trước, OAuth sau | Cắt scope Day 2, Google OAuth Day 3 |
| Google OAuth qua Supabase Auth | Không tự handle PKCE/state, để Supabase làm; chỉ cần exchange code → session ở callback |
| `useSearchParams` bọc `<Suspense>` boundary | Next.js 16 bắt buộc, không thì prerender fail toàn page |
| Inner component pattern (LoginForm bên trong LoginPage) | Cách nhẹ nhất để Suspense ôm useSearchParams mà giữ page có structure rõ |

## 5. Known Issues

- RLS chưa enable trên 6 table (tất cả UNRESTRICTED) - sẽ enable Day 4 sau khi có Profile trigger
- Supabase maintenance scheduled 13-14/05/2026 (Shared pooler ap-southeast-1)
- PayOS chưa setup (Week 4)
- Resend chưa verify domain (Week 3)
- Cloudflare R2 bucket `acf-assets` chưa tạo (Week 2-3)
- Domain `autocontent.online` chưa point Vercel (Week 4)
- Profile auto-create trigger chưa làm (Day 4) - user signup qua Google OAuth chưa có row trong `public.profiles`
- Next.js 16 warning: `middleware` file convention deprecated → sẽ đổi sang `proxy.ts` (Day 5+ khi research kỹ docs)
- Test user `test-day2@autocontentfactory.com` còn trên Supabase Dashboard - cleanup khi nào hết test
- Playwright MCP sandbox không thấy localhost của máy host - phải test thủ công trong Chrome HOẶC dùng Vercel preview URL

## 6. Next Steps

### Day 4: Profile auto-create trigger + Enable RLS

- Viết SQL trigger function trên `auth.users` INSERT → tự tạo row trong `public.profiles` (push qua Supabase MCP `apply_migration`)
- Test signup flow end-to-end (cả email/password và Google OAuth) → verify profile row tự tạo
- Backfill profile cho user hiện tại trong `auth.users` chưa có entry profile (`test-day2@...` + user Google OAuth Day 3)
- Enable RLS cho 6 table với policy cơ bản (user chỉ đọc/sửa data của mình)
- Test RLS bằng dual-client test (anon vs authenticated, dùng Supabase MCP `execute_sql`)
- Commit + update HANDOFF + smoke test

### Day 5-7: Landing page + Pricing (Bento Grid)

- Add shadcn/ui (init)
- Bento Grid hero + 4 feature cards
- Pricing section 3 tier (Free/Starter/Pro)
- Footer + CTA "Đăng ký free"
- Mobile responsive audit
- Migrate `middleware.ts` → `proxy.ts` (Next.js 16 modern convention, research docs trước)
- Skill `bento-grid` reference trong Project knowledge

### Cuối Week 1: Deploy lần đầu

- Pre-deploy checklist (instruction section 🚦)
- Push Vercel, verify production URL alive
- Connect domain `autocontent.online` qua Vercel (DNS pointing)
- Smoke test production
- Update env Vercel cả 3 environments (production/preview/development)

## 7. Context cho AI

### Stack
- Frontend: Next.js 16.2.6 App Router, TypeScript, Tailwind, shadcn/ui (sẽ add Day 5)
- Backend: Next.js API routes + Server Actions
- DB: Supabase Postgres + Drizzle ORM
- Auth: Supabase Auth (email/password + Google OAuth DONE)
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
- Production URL: https://autocontent.online (chưa connect Vercel - Week 4)
- Vercel project: auto-content-factory (vuhuyhais-projects)
- Supabase: fnhgtxxuudnqxxmzdpjx (Pro plan, ap-southeast-1)
- Admin email: fitnessviet@gmail.com
- Test users:
  - test-day2@autocontentfactory.com (email/password, Day 2)
  - (Có thể thêm user Google OAuth từ Day 3 nếu anh đã click "Allow" trong smoke test)

### Project structure (sau Day 3)
src/
├── middleware.ts (Next.js 16 + src/ folder convention)
├── lib/
│   └── supabase/
│       ├── server.ts (createServerClient cho Server Component)
│       ├── client.ts (createBrowserClient cho Client Component)
│       └── middleware.ts (updateSession utility)
├── components/
│   └── auth/
│       └── google-sign-in-button.tsx (Client component, inline G SVG)
└── app/
├── (auth)/
│   ├── login/
│   │   ├── page.tsx (Suspense + LoginForm + GoogleSignInButton)
│   │   └── actions.ts (Server Action signInWithPassword)
│   └── signup/
│       ├── page.tsx (form + GoogleSignInButton)
│       └── actions.ts (Server Action signUp)
├── auth/
│   ├── callback/
│   │   └── route.ts (GET handler exchange code for session)
│   └── confirm-email/
│       └── page.tsx
└── dashboard/
└── page.tsx

### Google OAuth setup (Day 3 - đã DONE)
- Google Cloud Console project: `auto-content-factory`
- OAuth 2.0 Client ID: `ACF Web Client` (Web application)
- Authorized JavaScript origins:
  - http://localhost:3000
  - https://autocontent.online
- Authorized redirect URI:
  - https://fnhgtxxuudnqxxmzdpjx.supabase.co/auth/v1/callback
- Test users (OAuth Consent Screen): fitnessviet@gmail.com
- Supabase: provider Google enabled, Client ID + Secret đã paste đúng format (Client ID dạng `xxx.apps.googleusercontent.com`)

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

### Bài học Day 3 (quan trọng)
1. **Cursor save file tiếng Việt có thể corrupt encoding** → bytes lưu sai UTF-8, hiển thị mojibake (`ÄÄƒng nháºp` thay vì `Đăng nhập`). Verify bằng `Select-String -Path X -Pattern "Đăng nhập" -Quiet` sau mỗi lần Cursor sửa file có tiếng Việt. Fix: paste lại nội dung qua Cursor IDE (Ctrl+S) thay vì để Cursor agent write.
2. **`useSearchParams()` BẮT BUỘC bọc `<Suspense>`** → Next.js 16 prerender fail nếu không có. Lỗi: "useSearchParams() should be wrapped in a suspense boundary". Pattern fix: tách inner component dùng `useSearchParams`, export page bọc `<Suspense fallback={...}><InnerComponent /></Suspense>`.
3. **Supabase Google provider có 2 thứ cần đúng cùng lúc:** (a) toggle "Enable Sign in with Google" ON, (b) Client IDs đúng format `xxxxxxxxxxxx.apps.googleusercontent.com` (NOT email, NOT text random). Nếu Client IDs sai format → Supabase save nhưng provider thực ra disabled. Verify bằng Supabase MCP `get_logs service=auth` → tìm dòng `provider is not enabled` ở path `/authorize`.
4. **MCP verify sau mỗi setup thao tác tay quan trọng** → trước khi anh báo "Xong cả 2 Google + Supabase", em nên đưa 1 click test nhỏ verify ngay. Fail fast tiết kiệm 30 phút debug.
5. **Playwright MCP Claude Desktop chạy trong sandbox** → KHÔNG thấy localhost của host machine. Smoke test E2E qua Playwright MCP đòi URL public (Vercel preview, ngrok). Local dev → test thủ công Chrome hoặc setup tunnel.
6. **GitHub raw URL có cache CDN** → web_fetch HANDOFF.md từ GitHub có thể trả bản cũ vài phút sau commit/push. Cross-check `git log` local nếu nghi ngờ.
7. **Domain chính xác là `autocontent.online` không phải `autocontentfactory.com`** → update mọi reference (Authorized origins Google, env Vercel sau này).