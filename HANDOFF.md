# HANDOFF - Auto-Content Factory

## 1. Overview

**Project:** Auto-Content Factory (ACF)
**One-liner:** SaaS giúp SMB Việt Nam tự động hoá viết content social bằng brand voice riêng.
**Owner:** Vũ Hải (Chairman VSE, CEO Ladysfit)
**Started:** 12/05/2026
**Target launch:** Tuần 4 (~09/06/2026)
**Status:** Week 1 Day 4 - Profile auto-create trigger + RLS DONE ✅

## 2. Current State

- ✅ Cursor pack v2.0 active (CLAUDE.md + 4 rules)
- ✅ Next.js 16.2.6 + TypeScript + Tailwind + Turbopack
- ✅ Supabase Pro plan connected (region ap-southeast-1, Singapore)
- ✅ Drizzle ORM + 6 table deployed to production DB
- ✅ GitHub repo `vuhuyhai/auto-content-factory` với 11 commits (Day 3 close), Day 4 +5 commits dự kiến
- ✅ Supabase Auth helpers (server, client, middleware utility)
- ✅ Middleware bảo vệ /dashboard (redirect 307 về /login nếu chưa auth)
- ✅ Login page email/password + Google OAuth button
- ✅ Signup page email/password + Google OAuth button
- ✅ Confirm-email page (post-signup)
- ✅ Dashboard placeholder hiển thị user email + UUID
- ✅ Google Cloud Console OAuth 2.0 Client ID configured
- ✅ Supabase Google provider enabled
- ✅ /auth/callback route handler
- ✅ Smoke test E2E Day 3 PASS 6/6
- ✅ **Schema profiles: 8 cột (thêm avatar_url + updated_at Day 4)**
- ✅ **Function `handle_new_user()` SECURITY DEFINER trên auth.users INSERT**
- ✅ **Trigger `on_auth_user_created` active - profile tự tạo cho signup mới**
- ✅ **RLS enabled 6/6 bảng với tổng 16 policy (verified dual-client SQL test PASS + smoke test UI thật PASS)**
- ✅ **Test-day2 user retired - DB chỉ còn fitnessviet@gmail.com là user thật**
- ⏳ Landing page bento design (Day 5-7)
- ⏳ Migrate middleware.ts → proxy.ts (Next.js 16 modern convention)

## 3. Done So Far

### Day 1 (12/05/2026)
- Cài Cursor pack v2.0
- Init Next.js 16.2.6 + TypeScript + Tailwind
- Install 33 packages
- Setup `.env.local` (Supabase + Anthropic)
- Schema 6 table: profiles, brands, workflows, contents, content_logs, subscriptions
- Push migration lên Supabase production
- Smoke test localhost OK

**Commits Day 1:** `81a10bd`, `b6c2bc3`, `bae7638`

### Day 2 (12/05/2026)
- Setup Supabase Auth helpers
- Middleware `src/middleware.ts` protect /dashboard
- Login + Signup page với Server Action
- Confirm-email page
- Dashboard placeholder
- Test user `test-day2@autocontentfactory.com` tạo trên Supabase Dashboard
- Smoke test E2E PASS 4/4

**Commits Day 2:** `25c6e5f`, `a13830a`, `67d6226`, `08d23b3`, `98d1053`, `d50ba32`

### Day 3 (12/05/2026)
- Google Cloud Console OAuth 2.0 Client ID + Consent Screen
- Supabase Google provider enabled
- `GoogleSignInButton` component (inline G SVG, loading state)
- `/auth/callback/route.ts` route handler
- Fix Suspense boundary cho `useSearchParams`
- Fix Vietnamese encoding (Cursor save corrupt → paste lại qua IDE)
- Smoke test E2E Chrome PASS 6/6
- Domain corrected to `autocontent.online`

**Commits Day 3:** `ab31bb3`, `f970116`

### Day 4 (12/05/2026)
- **Schema migration**: thêm `avatar_url text` + `updated_at timestamptz NOT NULL DEFAULT now()` vào bảng `profiles`
- **Drizzle schema sync**: update `src/lib/db/schema.ts` thêm 2 field tương ứng (avatarUrl, updatedAt mode 'date' consistent với createdAt)
- **Generate Drizzle migration**: `drizzle/0001_curious_silver_surfer.sql`
- **Function `handle_new_user()`**: tạo + fix - bug schema mismatch lần 1 (`full_name` không tồn tại → dùng `name`)
- **Trigger `on_auth_user_created`**: AFTER INSERT trên `auth.users`, gọi function SECURITY DEFINER
- **Test trigger giả lập**: insert 2 user test (email/password + Google OAuth metadata) → verify profile tự tạo đúng spec → cleanup
- **Backfill 2 user thật** (test-day2 + fitnessviet) với schema mới
- **Enable RLS 6/6 bảng** chia 3 wave:
  - Wave 7A: profiles (2 policy: SELECT, UPDATE)
  - Wave 7B: brands (4 CRUD) + subscriptions (1 SELECT)
  - Wave 7C: workflows (4) + contents (4) + content_logs (1) - bug schema mismatch lần 2 (`content_id` không tồn tại trong content_logs, fix bằng JOIN trực tiếp qua brand_id)
- **Dual-client SQL test** với seed 1 brand + 1 workflow + 1 content + 1 log mỗi user: anon=0, fitnessviet thấy 1, test-day2 thấy 1, không leak - bug schema mismatch lần 3 (`voice_description` không tồn tại trong brands, dùng cột minimal)
- **Cleanup seed test data** 8 row theo thứ tự FK child→parent
- **Dump test-day2 user** (email domain không tồn tại thật, không reset password được, RLS đã verified qua SQL test nên không cần email/password user nữa)
- **Smoke test UI Google OAuth thật**: dashboard render đúng email + UUID + RLS không block
- **4 SQL snapshot files** trong `supabase/migrations/manual_day4/` làm audit trail

**Commits Day 4 (dự kiến):**
- `feat(week1-day4): sync Drizzle schema with avatar_url + updated_at`
- `feat(week1-day4): add handle_new_user trigger for profile auto-create`
- `feat(week1-day4): enable RLS on all 6 public tables with 16 policies`
- `docs(week1-day4): snapshot manual migrations applied via Supabase MCP`
- `docs(handoff): close Day 4 - profile trigger + RLS DONE`

## 4. Architecture Decisions

| Decision | Lý do |
|---|---|
| Next.js 16.2.6 App Router | Default stack, SSR/SSG, Vercel native |
| Supabase Auth + Postgres | Free tier OK 100 user đầu |
| Drizzle ORM | Type-safe, light, better DX |
| Postgres Session Pooler port 5432 | IPv4 only cho mạng VN |
| 1 brand/user trong MVP | Cắt scope |
| 3 tier: Free/Starter/Pro | Cắt từ 5 tier |
| PayOS | VND-native, phù hợp SMB VN |
| Bento Grid design | Apple discipline + mobile-first |
| Middleware ở `src/middleware.ts` | Next.js 16 + src/ folder convention |
| Route group `(auth)` cho login/signup | Gom auth pages |
| Server Action + useActionState | Pattern Next.js 16 chuẩn |
| Email/password trước, OAuth sau | Cắt scope Day 2 |
| Google OAuth qua Supabase Auth | Không tự handle PKCE |
| `useSearchParams` bọc `<Suspense>` | Next.js 16 prerender requirement |
| **`SECURITY DEFINER` cho trigger function** | Bypass RLS khi auth.users trigger insert public.profiles (role supabase_auth_admin không có quyền vào public schema) |
| **Hướng 1 RLS: subquery EXISTS thay vì denormalize user_id** | MVP <1000 user không cần optimize, subquery 1-hop đủ nhanh |
| **Dùng `contents.brand_id` (denormalized) cho RLS contents** | 1-hop JOIN thay vì 2-hop qua workflows, đơn giản + nhanh hơn |
| **content_logs immutable từ user side** | Audit log pattern write-once read-many, INSERT do system qua Service Role |
| **subscriptions chỉ SELECT cho user** | Tránh bug "user tự update plan=pro" bypass payment |
| **KHÔNG có INSERT policy cho profiles** | Trigger SECURITY DEFINER tự handle, user không tự insert |

## 5. Known Issues

- Supabase maintenance scheduled 13-14/05/2026 (Shared pooler ap-southeast-1) - có thể ảnh hưởng Day 5 sáng
- PayOS chưa setup (Week 4)
- Resend chưa verify domain (Week 3)
- Cloudflare R2 bucket `acf-assets` chưa tạo (Week 2-3)
- Domain `autocontent.online` chưa point Vercel (Week 4)
- Next.js 16 warning: `middleware` file convention deprecated → đổi sang `proxy.ts` (Day 5+ khi research kỹ docs)
- Playwright MCP sandbox không thấy localhost - test thủ công Chrome HOẶC Vercel preview URL
- **`contents.brand_id` denormalized có nguy cơ drift khỏi `workflows.brand_id`** → cần thêm CHECK constraint hoặc trigger sync ở Day 5+
- **Bảng `brands` có schema nhiều cột hơn dự đoán** (slogan, industry, audience_persona, voice_archetype, brand_voice_guide, hashtags, logo_url, status) - cần update Drizzle schema khi build feature Brand creation Week 2

## 6. Next Steps

### Day 5-7: Landing page + Pricing (Bento Grid)

- Add shadcn/ui (init)
- Bento Grid hero + 4 feature cards (skill `bento-grid` reference trong Project knowledge)
- Pricing section 3 tier (Free/Starter/Pro)
- Footer + CTA "Đăng ký free"
- Mobile responsive audit
- Migrate `middleware.ts` → `proxy.ts` (Next.js 16 modern convention)
- Thêm CHECK constraint `contents.brand_id = workflows.brand_id` (chống denormalize drift)
- Sync Drizzle schema cho bảng `brands` (thêm 7 cột còn thiếu)

### Cuối Week 1: Deploy lần đầu

- Pre-deploy checklist (instruction section 🚦)
- Push Vercel, verify production URL alive
- Connect domain `autocontent.online` qua Vercel (DNS pointing)
- Smoke test production
- Update env Vercel cả 3 environments (production/preview/development)

## 7. Context cho AI

### Stack
- Frontend: Next.js 16.2.6 App Router, TypeScript, Tailwind, shadcn/ui (sẽ add Day 5)
- Backend: Next.js Server Actions + API routes
- DB: Supabase Postgres + Drizzle ORM (RLS enabled 6/6 tables)
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
- Test users: chỉ còn 1 user thật - fitnessviet@gmail.com (Google OAuth, "Vũ Hải", avatar Google CDN)

### RLS Coverage (6/6 bảng, 16 policies total)

| Bảng | Policy count | Pattern |
|---|---|---|
| profiles | 2 (SELECT, UPDATE) | `auth.uid() = id` |
| brands | 4 (full CRUD) | `auth.uid() = user_id` |
| workflows | 4 (full CRUD) | JOIN qua `brands.user_id` (1-hop) |
| contents | 4 (full CRUD) | JOIN qua `brands.user_id` via `contents.brand_id` (1-hop) |
| content_logs | 1 (SELECT only) | JOIN qua `brands.user_id` (1-hop) |
| subscriptions | 1 (SELECT only) | `auth.uid() = user_id` |

### Bypass RLS qua đâu (cần nhớ Week 2+)

- Trigger `handle_new_user`: `SECURITY DEFINER` → bypass RLS
- Webhook PayOS update subscriptions: dùng `SUPABASE_SERVICE_ROLE_KEY` (server-side env)
- Cron job insert content_logs: dùng `SUPABASE_SERVICE_ROLE_KEY` (server-side env)
- KHÔNG bao giờ leak SERVICE_ROLE_KEY ra client bundle

### Project structure (sau Day 4)
src/
├── middleware.ts
├── lib/
│   ├── db/
│   │   └── schema.ts (Drizzle, profiles có 8 cột)
│   └── supabase/
│       ├── server.ts
│       ├── client.ts
│       └── middleware.ts
├── components/
│   └── auth/
│       └── google-sign-in-button.tsx
└── app/
    ├── (auth)/
    │   ├── login/ (page.tsx + actions.ts)
    │   └── signup/ (page.tsx + actions.ts)
    ├── auth/
    │   ├── callback/route.ts
    │   └── confirm-email/page.tsx
    └── dashboard/page.tsx

supabase/migrations/
├── manual_day4/ (4 SQL snapshot từ Supabase MCP apply_migration)
│   ├── 0001_profile_auto_create_trigger.sql
│   ├── 0002_add_avatar_url_and_updated_at_to_profiles.sql
│   ├── 0003_fix_handle_new_user_use_name_column.sql
│   └── 0004_enable_rls_all_tables.sql

drizzle/
├── 0001_curious_silver_surfer.sql (Drizzle generate, đã apply via Supabase MCP)
└── meta/...

### Mental model
- Productized Service first, SaaS second
- Vietnamese SMB owner 30-50 tuổi, mobile-first
- Quality over quantity
- Speed over polish (MVP scrappy hơn beautiful broken)
- Brand voice không "AI-generated" feeling

### Proven pattern reference
- `03_VSE_News_Auto_Writer.md` = workflow production VSE, port sang web app Week 2-3

### Scope cắt khỏi MVP (Phase 2)
- ❌ Multi-brand per user
- ❌ Workflow types (chỉ news_based)
- ❌ Tier Business + Enterprise
- ❌ Auto-post Facebook/LinkedIn
- ❌ Image gen tự động
- ❌ Brand voice training từ bài cũ
- ❌ i18n English toggle
- ❌ PostHog analytics

### Bài học Day 1
1. **Mạng VN IPv4 only** → KHÔNG Transaction Pooler, PHẢI Session Pooler
2. **Paste DATABASE_URL cẩn thận** → tránh thừa `DATABASE_URL=` trong giá trị
3. **Password leak vào chat** → rotate ngay

### Bài học Day 2
1. **Next.js 16 + `src/`** → middleware PHẢI ở `src/middleware.ts`
2. **PowerShell `taskkill /PID` không đáng tin** → dùng `Get-NetTCPConnection -LocalPort N | Stop-Process -Force`
3. **PowerShell parse `()`** → quote path có ký tự đặc biệt
4. **Sau tạo/move middleware → restart `npm run dev`** (Turbopack không hot-reload)
5. **Curl alias PowerShell** → dùng `curl.exe -I`
6. **Server Action redirect không return** → `redirect()` throws internally
7. **Next.js 16 deprecate `middleware` → `proxy`** → warning ở build, sẽ migrate Day 5+

### Bài học Day 3
1. **Cursor save tiếng Việt corrupt** → verify bằng `Select-String -Pattern` sau mỗi sửa
2. **`useSearchParams()` BẮT BUỘC `<Suspense>`** → Next.js 16 prerender requirement
3. **Supabase Google provider 2 điều kiện**: toggle ON + Client ID đúng format `xxx.apps.googleusercontent.com`
4. **MCP verify sau setup thao tác tay** → fail fast tiết kiệm debug
5. **Playwright MCP sandbox không thấy localhost host** → test Chrome thủ công
6. **GitHub raw URL cache CDN** → cross-check `git log` local nếu nghi
7. **Domain đúng là `autocontent.online`** không phải `autocontentfactory.com`

### Bài học Day 4 (RULES, không phải Lessons)

**RULE D4-1: VERIFY-FIRST PROTOCOL khi viết SQL chứa tên cột.**
Trong Day 4 vi phạm rule này 3 LẦN (full_name không tồn tại, content_id không tồn tại, voice_description không tồn tại). Mỗi lần đều phải rollback + viết lại. Pattern BẮT BUỘC trước khi viết SQL chứa tên cột bảng nào:
```sql
-- Step 1: Verify columns
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = '<bảng>'
order by ordinal_position;

-- Step 2: Verify FK relationships nếu cần
select kcu.column_name, ccu.table_name, ccu.column_name
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu on tc.constraint_name = kcu.constraint_name
join information_schema.constraint_column_usage ccu on tc.constraint_name = ccu.constraint_name
where tc.table_schema = 'public' and tc.constraint_type = 'FOREIGN KEY' and tc.table_name = '<bảng>';
```
KHÔNG có exception. Ngay cả khi "vừa thấy schema 1 phút trước" - context có thể đã thay đổi.

**RULE D4-2: Drizzle schema = source of truth, KHÔNG sửa DDL trực tiếp DB.**
Pattern chuẩn: (1) Update Drizzle file → (2) `npm run db:generate` → (3) Review SQL → (4) Apply qua Supabase MCP. Không skip bước generate vì Drizzle giữ snapshot journal trong `drizzle/meta/`, skip = lệch snapshot, lần sau generate sẽ dirty.

**RULE D4-3: Postgres transaction atomic = safety net.**
Migration fail 1 statement → toàn bộ rollback. Tận dụng pattern này: gom tất cả ALTER + CREATE POLICY của 1 wave vào 1 migration. Sai = rollback sạch, không có state "half-applied".

**RULE D4-4: SECURITY DEFINER cho function trigger trên auth.users.**
Trigger fire context có role `supabase_auth_admin`, role này KHÔNG có quyền insert vào schema `public`. Phải dùng `SECURITY DEFINER` + `SET search_path = public` để function chạy với quyền owner (postgres).

**RULE D4-5: Test RLS bằng dual-client SQL TRƯỚC khi smoke test UI.**
Dual-client test (set role + jwt.claims) verify policy logic độc lập với app code. Smoke test UI verify integration. Nếu dual-client fail = policy sai, fix migration. Nếu dual-client PASS mà UI fail = code app sai (client config, server component query syntax). Phân tách 2 vấn đề, debug nhanh hơn.

**RULE D4-6: Schema mismatch lặp 3 lần = pattern problem, không phải accident.**
Lessons đọc cho biết, Rules buộc làm. Khi viết bài học không tự kỷ luật được → escalate thành RULE với protocol cụ thể (verify query, checklist), không chỉ "nhớ check schema".
