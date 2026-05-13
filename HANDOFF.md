# HANDOFF - Auto-Content Factory

## 1. Overview

**Project:** Auto-Content Factory (ACF)
**One-liner:** SaaS giúp SMB Việt Nam tự động hoá viết content social bằng brand voice riêng.
**Owner:** Vũ Hải (Chairman VSE, CEO Ladysfit)
**Started:** 12/05/2026
**Target launch:** Tuần 4 (~09/06/2026)
**Status:** Week 1 Day 8 - Workflow CRUD (List + Create + Toggle + Delete) DONE ✅, READY TO DEPLOY

## 2. Current State

- ✅ Cursor pack v2.0 active
- ✅ Next.js 16.2.6 + TypeScript + Tailwind v4 + Turbopack
- ✅ Supabase Pro plan connected (region ap-southeast-1)
- ✅ Drizzle ORM + 6 table với RLS enabled 6/6
- ✅ GitHub repo `vuhuyhai/auto-content-factory` với 19 commits (Day 6 close)
- ✅ Supabase Auth (email/password + Google OAuth)
- ✅ Middleware/Proxy bảo vệ /dashboard + force redirect /onboarding nếu chưa có brand
- ✅ Login + Signup + Confirm-email pages
- ✅ Dashboard placeholder (Day 7 sẽ build thật)
- ✅ Schema profiles: 8 cột, trigger `handle_new_user` auto-create
- ✅ RLS verified dual-client SQL + UI smoke test
- ✅ shadcn/ui base 12 components (Button, Card, Badge, Separator, Input, Textarea, Label, Slider, Form, Checkbox, RadioGroup, Select - tất cả manual paste do Node v24)
- ✅ Landing page 7 sections (Bento Grid + BRIDGE Framework)
- ✅ Production: ✅ LIVE - https://auto-content-factory.vercel.app
- ✅ **Onboarding flow 8 câu hỏi hoàn chỉnh:**
  - Multi-step form Typeform style với Framer Motion slide transitions
  - localStorage auto-save (RULE D6-1 fix: pass nextStep explicit)
  - Validation zod tiếng Việt 29 i18n messages
  - 8 step components: Brand basics, Audience, Archetype 6 cards, Tone 3 sliders, Pain points, USP, Topics + auto-hashtag, Sample content
  - BrandVoiceCard preview với inline edit buttons từng section
  - Server Action saveBrandVoice với RLS-enforced insert
  - Field-level error display (RULE D6-3) với label tiếng Việt + câu số
  - First brand "Ladysfit" saved successfully (8/8 JSON keys verified)
- ✅ `npm run build` PASS - 8 routes (Static `/`, Dynamic `/onboarding` `/dashboard`)
- ✅ TypeScript zero error
- ✅ Migrate middleware.ts → proxy.ts (Next.js 16 idiom, no deprecation warning)
- ✅ Dashboard layout với sidebar collapsible (desktop) + mobile drawer (shadcn Sheet)
- ✅ 4 dashboard components: dashboard-shell, sidebar, mobile-drawer, sidebar-nav
- ✅ 3 sidebar nav items: Brand Voice (active /dashboard), Workflows, Settings
- ✅ shadcn/ui Avatar + DropdownMenu components (manual paste, RULE D5-3)
- ✅ User avatar dropdown với email + Logout button (Server + Client composition for Radix Portal)
- ✅ signOut Server Action tại src/app/(auth)/logout/actions.ts
- ✅ Brand Voice Card readonly display trên /dashboard
- ✅ BrandVoiceCard component nhận optional prop readonly?: boolean (backward compat Day 6)
- ✅ src/lib/brands/queries.ts với getCurrentUserBrand() (Supabase client, RLS-aware, 12-field type Brand snake_case match DB)
- ✅ src/lib/brands/converters.ts với guideToFormData() convert BrandVoiceGuide → OnboardingFormData
- ✅ Workflow CRUD layer hoàn chỉnh: types + constants + zod schemas + Supabase queries (4 file src/lib/workflows/)
- ✅ Workflow list page `/dashboard/workflows` với empty state + workflow card (Server Component fetch RLS-aware)
- ✅ Workflow create form `/dashboard/workflows/new` (react-hook-form 7.75 + zod 4.4, 5 field, conditional news_sources)
- ✅ 3 Server Actions: createWorkflow + toggleWorkflowEnabled + deleteWorkflow (auth check + RLS insert/update/delete + revalidatePath)
- ✅ Workflow card với toggle switch (optimistic update + revert on fail) + delete confirm dialog (shadcn AlertDialog)
- ✅ shadcn/ui AlertDialog component (manual paste, RULE D5-3 Node v24, @radix-ui/react-alert-dialog 1.1.6)
- ✅ Workflow lưu DB: name + news_sources lưu trong config JSONB (không migration), brand_id link RLS-aware
- ✅ 5 schedule preset cron + 3 content type (news_based / evergreen / promotional)
- ✅ Field-level error display (pattern RULE D6-3): banner đỏ list lỗi với label tiếng Việt
- ✅ Workflow "Tin sáng Ladysfit" verified DB qua Supabase MCP (id b01973cb-7c76-49ec-adf7-6f980d3b7480)
- **Last verified:** 13/05/2026 - Day 8 close - Smoke test Phase 1-3+6-7 PASS, build 4.2s success, RLS 4 policies workflows verified

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
- LANDING_CONTENT.md - BRIDGE Framework 8 phần đầy đủ (skill bridge-framework-vuhai)
- shadcn/ui base init - MANUAL PASTE 4 components (CLI fail Node v24)
- Build 7 landing sections theo BRIDGE flow
- Polish 4 vấn đề: hero card height, pricing align, bonus spacing, total value baseline
- Deploy production - https://auto-content-factory.vercel.app LIVE

**Commits Day 5:** `cbe77ee`, `d585d67`, `1a2fdc3`, `56a6805`, `2dcd994`, `a52ff0c`, `0cd077f`, `f1a9198`, deploy commit

### Day 6 (12/05/2026)

**M1: Foundation**
- Sync Drizzle schema: add BrandVoiceGuide TypeScript interface for brand_voice_guide JSONB
- Install 4 npm deps: react-hook-form 7.75, @hookform/resolvers 5.2, zod 4.4, framer-motion 12.38
- Install 5 Radix deps: react-slider, react-label, react-select, react-radio-group, react-checkbox
- Add 5 shadcn components manual paste: input, textarea, label, slider, form
- Create onboarding lib: types.ts, constants.ts (12 industries + 6 archetypes + topics per industry + pain point placeholders), archetype-mapping.ts (rule-based synthesizer)
- Create route skeleton: src/app/onboarding/{layout,page}.tsx
- Update middleware: force redirect to /onboarding if user signed in but no brand

**M2: Form Engine**
- Add zod schemas per step + full schema with TypeScript inference
- Add 3 shadcn UI components manual paste: checkbox, radio-group, select
- Build OnboardingShell with Framer Motion slide transitions
- Add OnboardingProgressBar (animated 0-100%) + StepNavigation
- Custom hook useOnboardingState: form + localStorage autosave + step navigation
- Fix RULE D6-1 bug: pass nextStep explicit to saveDraft (avoid React state staleness)
- 8 step components:
  - Step 1: Brand basics (Input + Select 12 industries + conditional custom field)
  - Step 2: Audience (Checkbox age max 2 + Radio gender + Textarea persona)
  - Step 3: Archetype card selector (6 cards với active ring)
  - Step 4: Tone sliders (3 sliders với live sample text)
  - Step 5: Pain points (Textarea với industry-specific placeholder)
  - Step 6: USP (Textarea với min 30 chars - RULE D6-4)
  - Step 7: Topics multi-select + auto hashtag generator (Vietnamese slug)
  - Step 8: Sample content (optional, +30% quality badge)

**M4: Brand Voice Card Preview + Server Action Save**
- Add Server Action saveBrandVoice với auth check + zod validation + RLS insert
- Build BrandVoiceCard component (9KB) - 7 sections preview với inline edit buttons
- Wire showPreview state in useOnboardingState (step 8 finish reveals card)
- Add field-level error display (RULE D6-3) với label tiếng Việt + câu số
- Migrate fullOnboardingSchema messages to Vietnamese (29 i18n strings)
- Lower USP min length 50 to 30 chars (RULE D6-4: tighter for Vietnamese)
- Handle confirmation flow: server save → resetDraft → router.push(/dashboard)
- Verified: brand "Ladysfit" saved với full JSON brand_voice_guide đúng 8/8 keys

**M5: Smoke Test + Deploy**
- Smoke test 7 phases PASS (Pre-flight + TS + Build + Runtime + DB + Security)
- Update HANDOFF.md
- Deploy production

**Commits Day 6 (3 commits + 1 sắp có):**
- `616378c` feat(week1-day6-m1): foundation for onboarding flow
- `5f8c648` feat(week1-day6-m2): build 8-step onboarding form engine
- `c21251e` feat(week1-day6-m4): brand voice card preview + server action save
- `<sắp có>` docs(handoff): close Day 6 - onboarding flow deployed

### Day 7 (13/05/2026)

**M1: Migrate middleware → proxy (Next.js 16)**
- Rename src/middleware.ts → src/proxy.ts
- Rename function `middleware` → `proxy` (Next.js 16 export contract)
- Verified: dev server log `proxy.ts: XXXms`, curl 307 redirect /login, no deprecation warning
- Time: ~30 min (vì em hoảng vụ Incognito cookie leak, không phải bug)

**M2: Dashboard layout với sidebar + mobile drawer**
- Install @radix-ui/react-dialog@1.1.6
- Manual paste shadcn/ui Sheet component (RULE D5-3 Node v24)
- Build 4 components: sidebar-nav.tsx (client), sidebar.tsx (server), mobile-drawer.tsx (client, Sheet wrapper), dashboard-shell.tsx (server root)
- Wire DashboardShell vào src/app/dashboard/layout.tsx
- Tested: desktop sidebar 240px fixed, mobile drawer slide animation + auto-close, active nav state

**M3: Avatar dropdown + Logout**
- Install @radix-ui/react-avatar@1.1.3 + @radix-ui/react-dropdown-menu@2.1.6
- Manual paste shadcn/ui Avatar + DropdownMenu (manual paste, RULE D5-3)
- Create signOut Server Action at src/app/(auth)/logout/actions.ts
- Build Server + Client composition: user-menu.tsx (server fetch user) + user-menu-client.tsx (client UI + onSelect handler)
- First implementation dùng <form action={signOut}> FAIL (hydration mismatch + form submission canceled - root cause: Radix Portal tách button khỏi form parent)
- Fix bằng onSelect + void signOut() pattern (chuẩn shadcn docs)
- Tested: click avatar → dropdown → Đăng xuất → redirect /login + clear cookie

**M4: Brand Voice Card readonly display**
- Create src/lib/brands/queries.ts với getCurrentUserBrand() - 4 sai schema schema → final dùng Supabase client (RLS-aware) + 12-field snake_case type Brand đúng chính xác DB
- Create src/lib/brands/converters.ts với guideToFormData() (nested camelCase JSON → flat snake_case form shape)
- Modify BrandVoiceCard: add optional `readonly?: boolean` prop (default false, backward compat Day 6 onboarding)
- Conditional render: 7 Pencil edit buttons + Confirm/Reset action buttons ẩn khi readonly=true
- Rewrite src/app/dashboard/page.tsx: remove Day 2 placeholder, fetch brand via Server Component, render BrandVoiceCard readonly
- Empty state defensive (proxy đã handle redirect /onboarding nếu chưa có brand)
- Tested: brand "Ladysfit" hiện đủ 7 sections readonly, KHÔNG có Pencil/Confirm buttons

**M5: Smoke test + HANDOFF update + Deploy**
- Smoke test Phase 1-3 PASS (Pre-flight git clean + tsc zero error + npm run build 4.8s success)
- Build route table: `/dashboard` Dynamic (M4 đúng), `/_not-found` Static, `ƒ Proxy (Middleware)` đúng (M1 đúng), 9/9 static pages
- Update HANDOFF.md (in progress)
- Deploy: push origin main → Vercel auto-deploy

**Commits Day 7 (5 commits + HANDOFF + deploy):**
- `e42c382` chore(week1-day7-m1): migrate middleware.ts to proxy.ts (Next.js 16)
- `b0e3bfd` feat(week1-day7-m2): build dashboard layout with sidebar + mobile drawer
- `57031ef` feat(week1-day7-m3): add user avatar dropdown with logout
- `06b110e` feat(week1-day7-m4): display brand voice card readonly on dashboard
- `<sắp có>` docs(handoff): close Day 7 - dashboard + brand voice readonly deployed

### Day 8 (13/05/2026)

**M1: Workflows lib foundation**
- Verify schema workflows trong DB qua Supabase MCP (8 cột, 5 NOT NULL, name lưu trong config JSONB không cần migration)
- Create src/lib/workflows/types.ts: WorkflowFormData + ContentType + ScheduleCronValue + WorkflowConfig + WorkflowWithConfig + DEFAULT_WORKFLOW_FORM_DATA
- Create src/lib/workflows/constants.ts: 3 CONTENT_TYPES + 5 SCHEDULE_PRESETS + helper getScheduleLabel/getContentTypeLabel
- Create src/lib/workflows/schemas.ts: zod 4 syntax workflowFormSchema với superRefine (news_based requires news_sources) - fix RULE D8-1 zod 3 vs 4 API
- Create src/lib/workflows/queries.ts: getCurrentUserWorkflows + getWorkflowById dùng Supabase client RLS-aware (pattern Day 7 RULE D7-6)

**M2: List page + empty state**
- Verify sidebar-nav.tsx đã link /dashboard/workflows từ Day 7 (không cần sửa)
- Create src/components/workflows/workflow-empty-state.tsx (icon Workflow + button "Tạo workflow đầu tiên")
- Create src/components/workflows/workflow-card.tsx readonly v1 (Server Component-compatible, icon theo type, badge enabled, format relative time tiếng Việt)
- Create src/app/dashboard/workflows/page.tsx (Server Component fetch via getCurrentUserWorkflows, conditional render empty/list)
- Smoke runtime: sidebar nav active state đúng, empty state hiện đẹp với button CTA hồng

**M3: Create form + Server Action**
- Create src/app/dashboard/workflows/actions.ts: Server Action createWorkflow với auth check + zod validate + fetch brand_id + insert + revalidatePath + redirect
- Create src/app/dashboard/workflows/new/page.tsx Server Component check brand exists (redirect /onboarding nếu chưa có brand)
- Create src/app/dashboard/workflows/new/workflow-form.tsx Client Component (react-hook-form 7.75 + zod resolver, fix RULE D8-2 useForm<Input, Context, Output> generic 3 slot cho zod 4 default)
- 5 field: name (input), type (radio cards), scheduleCron (select preset), newsSources (URL list add/remove, conditional theo type), enabled (checkbox)
- Field-level error display banner đỏ với label tiếng Việt (pattern Day 6 RULE D6-3)
- Smoke runtime: validation client-side + server-side hoạt động, URL invalid bị reject, submit thành công redirect về list, workflow "Tin tức mớ về giảm cân" verified DB qua Supabase MCP

**M4: Toggle enabled + Delete**
- Install @radix-ui/react-alert-dialog 1.1.6
- Manual paste shadcn/ui AlertDialog component vào src/components/ui/alert-dialog.tsx (RULE D5-3 Node v24, fix RULE D8-3 verify dep trước khi viết import, RULE D8-4 phân biệt Format C vs Format A)
- Add 2 Server Action vào actions.ts: toggleWorkflowEnabled (update enabled) + deleteWorkflow (hard delete) - cả 2 auth check + RLS-aware
- Rewrite workflow-card.tsx thành Client Component: useState cho optimistic update toggle, useTransition cho async action, custom Switch button + Trash2 icon
- AlertDialog confirm xoá: title "Xoá workflow?" + description chứa tên workflow in đậm + button "Huỷ" outline / "Xoá" đỏ + loading state
- Smoke runtime 4 case PASS: render UI mới, toggle optimistic working, dialog confirm clean, delete xoá khỏi DB
- Workflow test "Tin tức mớ về giảm cân" delete thành công, workflow "Tin sáng Ladysfit" re-insert qua Supabase MCP (id b01973cb-7c76-49ec-adf7-6f980d3b7480)

**M5: Smoke test 5 phases + HANDOFF update**
- Phase 1 Pre-flight: working tree clean, ahead origin 4 commits, Node v24, npm v11.9.0 PASS
- Phase 2 Static: npx tsc --noEmit zero error PASS
- Phase 3 Build: npm run build 4.2s success, 10 routes + Proxy middleware, /dashboard/workflows và /new đều Dynamic ƒ PASS
- Phase 6 DB: RLS enabled true, 4 policy CRUD workflows, workflow "Tin sáng Ladysfit" verified link đúng brand Ladysfit PASS
- Phase 7 Security: .gitignore cover .env*.local, không leak Stripe/Supabase service token pattern PASS
- Update HANDOFF.md với Day 8 closure

**Commits Day 8 (4 commits + 1 sắp có):**
- `798b312` feat(week1-day8-m1): create workflows lib (types, constants, schemas, queries)
- `498f4e4` feat(week1-day8-m2): workflow list page with empty state + workflow card
- `3a4c7b3` feat(week1-day8-m3): workflow create form + server action
- `d094c77` feat(week1-day8-m4): workflow toggle enabled + delete with confirm dialog
- `<sắp có>` docs(handoff): close Day 8 - workflow CRUD deployed

## 4. Architecture Decisions

| Decision | Lý do |
|---|---|
| Next.js 16.2.6 App Router + Turbopack | Default stack, SSR/SSG, Vercel native |
| Supabase Auth + Postgres + Drizzle ORM | Free tier OK 100 user đầu, type-safe |
| RLS 6/6 bảng với subquery pattern | MVP < 1000 user không cần optimize |
| Tailwind v4 + @theme inline | Next.js 16 default, syntax mới khác v3 |
| shadcn/ui MANUAL PASTE (không qua CLI) | shadcn CLI v4.7.0 fail với Node v24 (@babel/parser bug) |
| 12 shadcn components base only | KISS, không thêm component chưa dùng |
| Server Components cho TẤT CẢ landing sections | Static prerender → SEO + speed |
| Content first (BRIDGE) trước design | Không thiết kế xong rồi nhồi chữ |
| **Multi-step form Typeform style cho onboarding** | Conversion rate +15-25% vs single page (Day 6) |
| **localStorage primary + 1 final DB save** | 0 network call giữa steps → UX mượt mobile (Day 6) |
| **Rule-based archetype mapping (không Claude API ở Day 6)** | Speed > polish MVP, Claude API defer Week 2 |
| **6 archetype thay vì 12 Jung gốc** | Rút gọn cho SMB Việt Nam, avoid paralysis (Day 6) |
| **1 brand per user trong MVP** | Đơn giản hoá validation + UX, multi-brand defer Week 4 |
| **Force redirect onboarding nếu chưa có brand** | Core flow của ACF, không có voice = không generate content |
| **Vietnamese typography: whiteSpace nowrap cho từ ghép** | Tránh cắt "đều đặn", "giọng brand", "tự viết" |
| **Server + Client composition cho Radix Portal + Server Action** | Day 7 M3 phát hiện: <form action> trong DropdownMenu Portal gây hydration mismatch + form canceled. Pattern fix: Server Component fetch data → Client Component nhận props + onSelect handler |
| **Supabase client cho DB queries thay vì Drizzle** | Day 7 M4 thử Drizzle nhưng fail "password authentication failed for user ASUS" (DATABASE_URL chưa setup) + Drizzle bypass RLS. Rollback Supabase client (Day 2-6 pattern) - RLS-aware, không cần env config thêm |
| **Type Brand inline snake_case (manual sync DB schema) thay vì Drizzle $inferSelect** | Drizzle dùng camelCase nhưng Supabase client trả snake_case → conflict. Inline type snake_case match exact 12 fields DB |
| **BrandVoiceCard readonly prop optional thay vì refactor base/wrapper components** | Day 6 component đã verified pass, em chọn add prop để minimize risk regression. Week 2 refactor cùng Claude API integration |
| **Workflow name lưu trong config JSONB thay vì migration thêm column** | Day 8 M1: tránh migration giữa milestone, JSONB đã nullable sẵn, đủ flexibility cho future fields (news_sources, content_tone_override). Trade-off: query lọc theo name phải dùng `config->>'name'` thay vì column index. Đủ MVP < 1000 user. |
| **5 schedule cron preset thay vì cron string raw input** | Day 8 M1: SMB Việt Nam 30-50 tuổi không biết cron syntax. Preset 5 option (sáng 7h, tối 8h, 2 lần/ngày, thứ Hai 9h, T246 9h) đủ 80% use case. Cron raw defer Phase 2 nếu user request. |
| **Optimistic UI update cho toggle thay vì block UI đợi server response** | Day 8 M4: UX mượt mobile, perceived latency 0. Trade-off: phải revert state nếu server fail (đã handle). Pattern phù hợp với action không critical (toggle on/off khác hẳn delete). |

## 5. Known Issues

### Issues Day 5 (vẫn outstanding)
- Git history thừa 1 commit hero (1a2fdc3 + 56a6805 cùng message) - không critical
- shadcn CLI fail Node v24 - manual paste workaround vẫn dùng
- Lucide-react brand icons removed - inline SVG Facebook trong footer
- Next.js 16 warning middleware → proxy (Day 7 sẽ migrate)
- Supabase maintenance scheduled 13-14/05/2026 - có thể ảnh hưởng deploy
- PayOS chưa setup (Week 4)
- Resend chưa verify domain (Week 3)
- Cloudflare R2 bucket acf-assets chưa tạo (Week 2-3)
- contents.brand_id denormalized có nguy cơ drift - cần CHECK constraint (Day 7+)
- CTA "Xem cách hoạt động" trong Hero link tới /#how-it-works - chưa có section đó

### Issues Day 6 (mới phát sinh)
- **getBrandPrefix logic sai cho single-word brand:** "Ladysfit" → `LT_` thay vì `LF_` (lấy first+last letter). Fix Week 2.
- **saveError banner persistent:** Sau khi user edit + click "Xác nhận" lần 2, banner đỏ cũ vẫn hiển thị mặc dù validation đã pass. UX issue. Fix Week 2.
- **`npm run lint` script missing trong package.json:** TypeScript đã clean, build chứa lint ngầm. Add script Week 2.
- **Claude API chưa integrate cho synthesize brand voice:** Day 6 dùng rule-based mapping (theo plan). Week 2 sẽ thay bằng Claude API để JSON quality cao hơn.

### Issues Day 7 (mới phát sinh)
- **Signup error message quá generic ("Khong the tao tai khoan. Vui long thu lai.")** - Day 2 swallow Supabase API error trong try/catch. User không biết lý do (email exists / password short / etc). Cần fix Week 2: bubble error chi tiết
- **Onboarding flow Day 6 không test live sau M4 modification** - Backward compat verified qua tsc + build PASS, BrandVoiceCard add OPTIONAL prop. Defer test full signup flow Week 2 (sau khi fix signup error message)
- **Sub-header "Xem lại và confirm. Bạn có thể edit từng phần nếu cần." trong BrandVoiceCard không hợp ngữ cảnh dashboard readonly** - Day 6 copy không update khi readonly. Defer Week 2 refactor cùng Claude API
- **Drizzle client chưa setup DATABASE_URL env** - Khi cần Drizzle ORM cho features khác (vd workflow query) cần config DATABASE_URL trong .env.local + Vercel env

### Issues Day 8 (mới phát sinh)
- **Workflow card không có button "Sửa workflow":** Day 8 chỉ có toggle + delete, chưa có edit (đổi tên / đổi nguồn / đổi schedule). Defer Day 10 hoặc Week 2 cùng "Edit Brand Voice".
- **`getCurrentUserBrand` query không match Type Brand 12 fields chuẩn:** Khi truy cập `brand.brand_voice_guide?.brand_basics?.name` trong new/page.tsx em assume field tồn tại. Hoạt động vì Day 7 query select đầy đủ. Nếu Day 9+ refactor query để optimize, có thể break. Cần thêm select() explicit hoặc dùng zod parse runtime.
- **Vercel Cron handler chưa wire-up:** Workflow tạo ra với schedule cron, nhưng chưa có endpoint cron consume. Day 9 sẽ implement /api/cron/run-workflows. Hiện workflow chỉ là metadata, không có execution.
- **Workflow type 'evergreen' và 'promotional' chưa có content config:** Day 8 chỉ news_based có news_sources. 2 type còn lại có thể cần fields khác (topic_focus, product_link...). Defer khi build Claude API content generation Day 9-10.
- **Delete workflow không cascade contents:** Schema có FK `contents.workflow_id ON DELETE CASCADE` nhưng chưa test với data thật vì contents chưa có row. Verify Day 9 sau khi cron sinh content.

### D5 Gotchas (vẫn áp dụng)
- D5-6: Vercel Framework Preset có thể bị set "Other" - check Settings → Build and Deployment
- D5-7: Đừng dùng `vercel link` với "Pull env now: YES" khi Vercel chưa có env (overwrite .env.local)
- D5-8: Phải add env vào Vercel cho cả 3 environments (Production + Preview + Development)

## 6. Next Steps

### Ngay sau Day 8 close (HÔM NAY): DEPLOY production
- Pre-deploy checklist verify
- `git push origin main` → Vercel auto-deploy 5 commits Day 8
- Smoke test production: dashboard + onboarding + workflow CRUD trên Vercel URL
- Verify workflow "Tin sáng Ladysfit" hiện trong list, toggle + delete hoạt động trên prod

### Day 9 / Week 2: Cron handler + Claude API content generation
- Setup vercel.json với cron schedule (hit endpoint mỗi giờ hoặc 7h sáng UTC+7)
- Build /api/cron/run-workflows endpoint với CRON_SECRET auth
- Query workflows enabled = true + filter cron string match now()
- Integrate Claude API Sonnet 4.6: fetch news từ news_sources → generate content với brand voice guide → insert vào contents
- Update workflows.last_run_at sau mỗi run
- Replace rule-based archetype mapping bằng Claude API (lift Brand Voice quality 80%)
- Test cron trigger thực tế với workflow Ladysfit

### Day 10 / Week 2-3: Workflow edit + Brand Voice edit + fix known issues
- Build edit workflow form (reuse create form với mode=edit + pre-fill data)
- "Edit Brand Voice" button trên dashboard → /onboarding?mode=edit pre-fill từ DB
- Fix Day 6+7+8 known issues: getBrandPrefix, saveError persistent, npm run lint script, signup generic error, BrandVoiceCard refactor base/wrapper, workflow type config (evergreen/promotional)

### Week 3: Content review + Email delivery
- Build /dashboard/contents page list content generated
- Approve/reject UI workflow
- Resend integration gửi content draft email cho user review
- Cloudflare R2 storage cho media assets

### Week 4: Payment + Polish + Launch
- PayOS integration cho 3 tier (Free/Starter/Pro)
- Stripe trial flow (14 ngày guarantee per landing)
- Sentry monitoring
- Domain autocontent.online connect Vercel
- Multi-brand support (relax MVP rule "1 brand per user")

## 7. Context cho AI

### Stack
- Frontend: Next.js 16.2.6 App Router, TypeScript, Tailwind v4, shadcn/ui (12 components manual)
- Forms: react-hook-form 7.75 + zod 4.4 + @hookform/resolvers 5.2 + framer-motion 12.38
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
- Production URL: https://auto-content-factory.vercel.app (autocontent.online connect Week 4)
- Vercel project: auto-content-factory (vuhuyhais-projects)
- Supabase: fnhgtxxuudnqxxmzdpjx (Pro plan, ap-southeast-1)
- Admin email: fitnessviet@gmail.com
- Node version: v24.14.0 (lưu ý shadcn CLI + npx shadcn fail)
- npm package manager

### Onboarding structure (Day 6)
src/
├── app/onboarding/
│   ├── layout.tsx (full-screen wrapper)
│   ├── page.tsx (auth check + brand existence check)
│   └── actions.ts (Server Action saveBrandVoice)
├── components/onboarding/
│   ├── onboarding-shell.tsx (orchestrator)
│   ├── onboarding-progress-bar.tsx (animated 0-100%)
│   ├── step-navigation.tsx (Back/Next buttons)
│   ├── brand-voice-card.tsx (Card preview 7 sections)
│   └── steps/
│       ├── step-1-brand-basics.tsx
│       ├── step-2-audience.tsx
│       ├── step-3-archetype.tsx
│       ├── step-4-tone.tsx
│       ├── step-5-pain-points.tsx
│       ├── step-6-usp.tsx
│       ├── step-7-topics.tsx
│       └── step-8-sample.tsx
├── lib/onboarding/
│   ├── types.ts (OnboardingFormData + DEFAULT_FORM_DATA)
│   ├── constants.ts (12 industries + 6 archetypes + topics per industry + LS_DRAFT_KEY)
│   ├── schemas.ts (zod step schemas + fullOnboardingSchema)
│   ├── archetype-mapping.ts (rule-based synthesizer)
│   └── use-onboarding-state.ts (custom hook)
└── lib/db/schema.ts (Drizzle + BrandVoiceGuide TypeScript interface)

### Brand Voice Profile JSON schema (lưu vào brands.brand_voice_guide)
{
  version: "1.0",
  brand_basics: { name, slogan?, industry },
  audience: { age_range: string[], gender_focus, persona_description },
  voice: {
    archetype: ArchetypeKey,
    tone: { formality, humor, emotion } (0-10),
    principles: string[]
  },
  messaging: {
    pain_points: string[],
    usp, topics: string[], hashtags: string[]
  },
  vocabulary: { yes_words: string[], no_words: string[] },
  signature_move: string,
  example_hooks: string[],
  sample_content_provided: boolean,
  sample_content_analysis?: { ... },
  created_at, last_updated
}

### Mental model
- Productized Service first, SaaS second
- Vietnamese SMB owner 30-50 tuổi, mobile-first
- Quality over quantity
- Speed over polish (MVP scrappy hơn beautiful broken)
- Content first - design after (BRIDGE Framework chuẩn)
- 1 brand = 1 voice = 1 source of truth cho mọi content engine sau này

### Bài học Day 5 (RULES vẫn áp dụng)

**RULE D5-1:** VERIFY CURSOR OUTPUT BẰNG GREP KEYWORD CỤ THỂ, KHÔNG TIN CAM KẾT "ĐÃ CHÈN ĐÚNG".

**RULE D5-2:** POWERSHELL HERE-STRING KHÔNG SAFE VỚI TYPESCRIPT GENERIC `<T>`. Dùng Cursor Composer paste.

**RULE D5-3:** SHADCN CLI v4.7.0 FAIL VỚI NODE v24. Manual paste workaround.

**RULE D5-4:** TASK PLAN PHẢI CÓ "CONTENT FIRST" TRƯỚC "DESIGN AFTER".

**RULE D5-5:** NEXT.JS 16 KHÔNG SHOW BUNDLE SIZE Ở BUILD OUTPUT.

### Bài học Day 6 (4 RULES mới)

**RULE D6-1: REACT STATE UPDATES KHÔNG SYNCHRONOUS.** Khi gọi `setState(x)` rồi gọi function khác đọc state cùng tick, function đó vẫn đọc giá trị CŨ. Fix: pass value mới explicit như parameter, KHÔNG dựa vào state đọc lại.
*Bug Day 6:* F5 ở step 6 → quay về step 5 vì `saveDraft()` đọc currentStep stale từ closure cũ.
*Fix:* `saveDraft(stepOverride?: number)` với param explicit.

**RULE D6-2: PowerShell `Get-ChildItem -Filter` chỉ nhận 1 string, không nhận array.** Dùng `-Include "*.ts","*.tsx" -Recurse` thay thế nếu muốn match nhiều pattern.

**RULE D6-3: SERVER ACTION VALIDATION ERROR CẦN FIELD-LEVEL DETAILS.** Generic "Dữ liệu không hợp lệ" frustrate user. Pattern: `schema.safeParse` → map issues thành `Record<field, message>` → client display list với label tiếng Việt rõ ràng kèm câu số.
*Bug Day 6:* User không biết quay step nào để fix lỗi → field details + label "Câu N" mở fix nhanh.

**RULE D6-4: SCHEMA VALIDATION THRESHOLD PHẢI TEST VỚI REAL VIETNAMESE DATA.** Min 50 ký tự ổn với English, nhưng tiếng Việt cô đọng - 30 ký tự có thể đủ ý.
*Bug Day 6:* USP "Môi trường thân thiện và phương pháp đơn giản" (45 chars) bị reject. Lower threshold 50→30.

### Bài học Day 7 (4 RULES mới)

**RULE D7-1: `git add <file>` KHÔNG TỰ STAGE DELETION.**
Khi rename file thủ công bằng `Move-Item`, phải dùng `git add -A` hoặc `git add <old-file>` để git biết file cũ đã xoá. Nếu không, commit sẽ chỉ có file mới, gây duplicate trong working tree.

**RULE D7-2: INCOGNITO CHROME KHÔNG TỰ XOÁ COOKIE GIỮA CÁC TAB CÙNG SESSION.**
Test logout/auth flow phải XOÁ cookie ở DevTools hoặc ĐÓNG HẾT cửa sổ Incognito trước. Mở 2 tab Incognito = cùng cookie session. Em đã hoảng tưởng có security bug khi /dashboard trong Incognito hiện User ID - thực ra Incognito còn cookie từ session cũ.

**RULE D7-3: KHÔNG dùng `<form action={serverAction}>` với button bên trong Radix Portal.**
Radix DropdownMenu, Dialog, Popover render content qua React Portal - DOM node bị tách khỏi form parent. Browser tìm form chứa submit button không thấy → "Form submission canceled because the form is not connected". Đồng thời asChild + Portal gây hydration mismatch.
Fix pattern (chuẩn shadcn docs):
- Tách Server Component (fetch data) + Client Component (UI + handlers)
- Server pass data qua props
- Client dùng onSelect của DropdownMenuItem: { onSelect={(e) => { e.preventDefault(); void serverAction() }} }

**RULE D7-4: KHÔNG ĐOÁN SCHEMA DB. VERIFY SCHEMA.TS + ACTIONS.TS TRƯỚC KHI VIẾT TYPE.**
Em đã sai 4 lần trong M4: thêm `industry_custom`, `brand_prefix`, `updated_at` vào type Brand (không có trong DB), và đoán BrandVoiceCard là default export (thực ra named export).
Pattern đúng: Đọc src/lib/db/schema.ts (Drizzle table definition) + src/app/<feature>/actions.ts (xem code insert/update field gì) TRƯỚC khi viết type. KHÔNG thêm field "có vẻ logic". KHÔNG tin trí nhớ về 30 dòng đầu file - dùng Select-String verify thật.

**RULE D7-5: PowerShell `Select-String` mặc định match per line.**
Pattern multi-line bị xuống dòng (Cursor format Drizzle chain `db\n    .select()`) sẽ KHÔNG match. Workaround: pattern ngắn match từng phần (`.select`, `.from`, `.where`) thay vì `db.select`.
Bonus: pattern chứa `"` phải bọc bằng single quote bên ngoài (`'@/lib/db"'`), không dùng escape `\"`.

**RULE D7-6: KHÔNG đổi DB access mechanism (Drizzle vs Supabase client) giữa milestone.**
Em đã refactor sang Drizzle ORM ở M4 vì nghĩ "type cleaner". Bug: 1) Day 6 chưa setup DATABASE_URL nên Drizzle fail auth → fallback Windows username "ASUS". 2) Drizzle bypass RLS (security regression). 3) Cần config Vercel env mới.
Default: dùng pattern feature trước đó đã pass. Day 2-6 dùng Supabase client → M4 cũng dùng Supabase client. Đổi tech stack giữa chừng = bug.

### Bài học Day 8 (4 RULES mới)

**RULE D8-1: VERIFY THƯ VIỆN VERSION TRƯỚC KHI VIẾT SYNTAX MỚI.**
Zod 4 đổi API: gộp `required_error` + `invalid_type_error` thành `message` duy nhất. `z.enum(VALUES, { required_error: '...' })` zod 3 → `z.enum(VALUES, { message: '...' })` zod 4. Pattern đúng: `Get-Content package.json | Select-String -Pattern '"zod"'` để confirm major version TRƯỚC khi viết schema.
*Bug Day 8 M1:* 3 lỗi tsc trong schemas.ts vì em viết zod 3 syntax trong khi project dùng zod 4. Fix: đổi sang `message` key. Bài học bổ sung: đáng lẽ đọc file `src/lib/onboarding/schemas.ts` Day 6 làm reference thay vì đoán.

**RULE D8-2: ZOD 4 + react-hook-form CẦN useForm<Input, Context, Output> RÕ RÀNG.**
Trong zod 4, `.default()` + `.optional()` tạo Input type ≠ Output type (input có optional field, output đã apply default). `useForm<Schema>` 1-slot default ngầm Schema=Output → khi user gõ form (input partial) mismatch. Pattern đúng:
```ts
type Input = z.input<typeof schema>;
type Output = z.output<typeof schema>;
useForm<Input, unknown, Output>({ resolver, defaultValues });
function onSubmit(values: Output) { ... }
```
*Bug Day 8 M3:* 2 lỗi tsc trong workflow-form.tsx. Day 6 onboarding không gặp vì không dùng `.default()` ở optional field.

**RULE D8-3: VERIFY SHADCN COMPONENT TỒN TẠI TRƯỚC KHI VIẾT IMPORT.**
Day 8 M4 em đưa prompt rewrite workflow-card.tsx import AlertDialog TRƯỚC khi anh chạy prompt verify file alert-dialog.tsx có chưa. May Cursor flag được, nhưng nếu Cursor không flag thì build fail.
Pattern đúng: với mỗi shadcn component import mới, chạy `Get-ChildItem src\components\ui\<name>.tsx` + `Get-Content package.json | Select-String "<radix-package>"` TRƯỚC khi viết code dùng.

**RULE D8-4: PHÂN BIỆT RÕ FORMAT C `[PASTE VÀO FILE]` VS FORMAT A `[POWERSHELL]`.**
Format C = tạo file mới trong Cursor (Right-click → New File → paste nội dung qua editor). KHÔNG paste vào terminal PowerShell vì PowerShell parse code TypeScript như command → 10+ syntax error.
*Bug Day 8 M4:* Em đưa prompt format C nhưng anh paste vào PowerShell, terminal trả về 9 ParserError. Fix bằng Format B (PROMPT CURSOR) - Cursor tự tạo file + fill nội dung trong 1 thao tác, an toàn hơn vì không qua terminal.
Pattern em sẽ dùng cho mọi shadcn paste sau này: **Format B chứ không phải Format C**.

### Lưu ý cho chat tiếp theo

- HANDOFF.md raw URL: https://raw.githubusercontent.com/vuhuyhai/auto-content-factory/main/HANDOFF.md
- Em fetch HANDOFF đầu chat. Nếu cache cũ → cross-check git log local, commit cuối nên là `docs(handoff): close Day 6 - onboarding flow deployed`
- Day 7 nếu anh tiếp tục: ưu tiên migrate middleware → proxy.ts modern + dashboard build thật + display Brand Voice Card readonly
- Day 6 verified production-ready, brand "Ladysfit" đã saved DB với JSON đúng 8/8 keys
- Day 8 nếu anh tiếp tục: ưu tiên build workflow creation form + integrate Claude API + fix Day 6+7 known issues
