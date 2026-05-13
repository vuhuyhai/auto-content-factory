# HANDOFF - Auto-Content Factory

## 1. Overview

**Project:** Auto-Content Factory (ACF)
**One-liner:** SaaS giúp SMB Việt Nam tự động hoá viết content social bằng brand voice riêng.
**Owner:** Vũ Hải (Chairman VSE, CEO Ladysfit)
**Started:** 12/05/2026
**Target launch:** Tuần 4 (~09/06/2026)
**Status:** Week 1 Day 10 - Inngest background job pipeline deployed to production ✅, smoke test fail at fetch-news step (VnExpress block Vercel IP), defer fix Day 11

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

### Day 9 additions (13/05/2026)

- ✅ Anthropic SDK 0.95.2 + rss-parser 3.13.0 + @mozilla/readability 0.6.0 + jsdom 29.1.1 installed
- ✅ Anthropic client singleton tại src/lib/claude/client.ts với model claude-sonnet-4-6 + DEFAULT_MAX_TOKENS 4000
- ✅ News Fetcher Library (src/lib/news/): types.ts + fetcher.ts với Hybrid RSS + Readability strategy
- ✅ Verified VnExpress suc-khoe.rss: 1.34s fetch, 3 articles, 0 errors, tiếng Việt clean
- ✅ Content Generator Library (src/lib/content/): types.ts + prompts.ts + generator.ts
- ✅ buildSystemPrompt inject brand voice (archetype, tone bucket low/mid/high, vocabulary yes/no words, principles, signature_move)
- ✅ generateContent với Claude Sonnet 4.6: 3-stage error handling (api_call / json_parse / schema_validate)
- ✅ Smart quote normalization (U+201C/D, U+2018/9 → ASCII) + markdown code block extraction
- ✅ Zod schema validate response (3 variants, body 200-3000 chars, 2-8 hashtags)
- ✅ Verified first-shot quality: 3 variants distinct (question/story/stat), voice tone Ladysfit match perfect
- ✅ Migration add_variants_to_contents: variants JSONB + selected_variant_index INTEGER DEFAULT 0
- ✅ src/lib/content/queries.ts: insertGeneratedContent + updateWorkflowLastRun (RLS-aware via Supabase client)
- ✅ POST /api/workflows/[id]/run route handler với 8-step flow + maxDuration 60 + runtime nodejs
- ✅ Server Action runWorkflow() trong actions.ts (internal HTTP fetch + cookie forwarding)
- ✅ Workflow card UI: button "Chạy ngay" với Play icon + loading state Loader2 + toast inline (success xanh / error đỏ, auto-dismiss 5s)
- ✅ End-to-end localhost test PASS: workflow "Tin sáng Ladysfit" → 59s → 3 variants → content_id f41f0a16-2cc7-4471-9c08-c1c322e7b84d
- ✅ Brand voice quality verified: "mình", "bạn", "chị em xung quanh mình" tone match perfect everyman archetype
- ✅ Smoke test 5 phases PASS (Pre-flight + TS + Build + DB + Security)
- ⚠️ KHÔNG deploy production - Vercel Hobby timeout 10s blocks 59s Claude generate (Path 1: defer deploy Day 10 với background job)

**Last verified:** 13/05/2026 - Day 9 close - Smoke test all PASS, content generated Ladysfit/VnExpress success, localhost-only

### Day 10 additions (13/05/2026)

- ✅ Inngest SDK 4.4.0 + Inngest Cloud account (vuhai-acf org, auto-content-factory app)
- ✅ Inngest client singleton tại src/inngest/client.ts với app id 'auto-content-factory'
- ✅ Inngest API route serve tại src/app/api/inngest/route.ts (GET/POST/PUT)
- ✅ Supabase admin client tại src/lib/supabase/admin.ts (singleton, service_role bypass RLS)
- ✅ Inngest queries lib tại src/lib/inngest/queries.ts với 2 hàm fetchWorkflowByIdAdmin (JOIN brands user_id verify ownership) + fetchBrandByUserIdAdmin
- ✅ Inngest function workflowRunner tại src/inngest/functions/workflow-runner.ts với 4 step (fetch-workflow-and-brand, fetch-news, generate-content, save-content), concurrency 5, retries 3, trigger event 'workflow/run.requested'
- ✅ Refactor /api/workflows/[id]/run thành trigger endpoint (49 LOC, giảm từ 127 LOC) - chỉ auth + ownership + inngest.send(), response < 1s
- ✅ Server Action runWorkflow update return type thành { success, job_id, message } (từ { content_id, source_article })
- ✅ UI toast workflow-card.tsx update message thành "Đã enqueue. Content sẽ lưu vào DB sau 1-2 phút."
- ✅ Vercel env vars: ANTHROPIC_API_KEY + INNGEST_EVENT_KEY + INNGEST_SIGNING_KEY (3 environments: Production + Preview + Development)
- ✅ Fix lazy import jsdom + @mozilla/readability trong src/lib/news/fetcher.ts (top-level eager import crash Vercel ERR_REQUIRE_ESM)
- ✅ vercel.json config maxDuration 60s cho /api/inngest route (Hobby plan max)
- ✅ Inngest Cloud production sync với https://auto-content-factory.vercel.app/api/inngest (SDK 4.4.0 success 17:21:14 13/5/2026)
- ✅ Localhost end-to-end test M3 PASS: Inngest run completed trong ~70s, content_id 4d2829ce-ab65-4d81-b312-86a1db9de90d
- ⚠️ Production smoke test FAIL ở step fetch-news (3 retries × ~41s mỗi attempt) - VnExpress trả error hoặc Vercel IP bị block. Defer debug Day 11.
- ✅ Production deployment LIVE - Inngest pipeline architect đúng, chỉ còn 1 bug data fetching network-specific.

**Last verified:** 13/05/2026 - Day 10 close - production deploy SUCCESS, smoke test fetch-news fail, defer Day 11

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

### Day 9 (13/05/2026)

**M1: Anthropic SDK + News Fetcher dependencies (~50 phút)**
- Install @anthropic-ai/sdk@0.95.2 + rss-parser@3.13.0 + @mozilla/readability@0.6.0 + jsdom@29.1.1 + @types/jsdom (dev)
- Add ANTHROPIC_API_KEY to .env.local (Vercel env sync Week 2)
- Create src/lib/claude/client.ts: singleton Anthropic + CLAUDE_MODEL constant 'claude-sonnet-4-6' + DEFAULT_MAX_TOKENS 4000
- Add scripts/ to .gitignore (test scripts not committed)
- Debug RULE D9-1 (placeholder env var not replaced) + RULE D9-2 (ES Module hoisting prevents dotenv config order)
- Final fix: `npx tsx --env-file=.env.local scripts/test-claude.ts` (Node 20.6+ flag pattern)
- Smoke test API call verified: claude-sonnet-4-6 callable, key length 108, Vietnamese response clean

**M2: News Fetcher Library (~25 phút)**
- Create src/lib/news/types.ts: NewsArticle + FetchError + FetchNewsResult interfaces
- Create src/lib/news/fetcher.ts: fetchNewsFromSources() với Hybrid RSS + Readability
- Design choices: timeout 8s/source, max 3 articles/source, 24h lookback, partial success pattern, custom User-Agent
- Whitespace cleanup on Readability extracted text
- Verified VnExpress suc-khoe.rss: 1.34s, 3 articles, 0 errors, tiếng Việt clean

**M3: Content Generator với Claude API (~45 phút)**
- Create src/lib/content/types.ts: ContentVariant + SourceArticleRef + GeneratedContent + BrandVoiceGuide (5 interfaces)
- Create src/lib/content/prompts.ts: buildSystemPrompt + buildUserPrompt
  - System prompt inject brand voice: archetype description, tone bucket low/mid/high, vocabulary yes/no, principles, signature_move
  - 3 hook patterns required (question/story/stat) for variant distinction
  - JSON-only output, forbid double quotes + newlines trong string values
- Create src/lib/content/generator.ts: generateContent() với Claude Sonnet 4.6
  - 3-stage error handling: api_call / json_parse / schema_validate via custom ContentGenerationError class
  - Smart quote normalization (U+201C/D, U+2018/9) + markdown code block extraction with brace matching fallback
  - Zod validate: 3 variants, hook 10-300, body 200-3000, hashtags 2-8
  - Full response log to stderr on parse fail (debug aid)
- First-shot quality verified: 3 variants distinct (V1 question, V2 story chị bạn 34 tuổi, V3 5 facts với % data)
- Voice tone match: "mình", "bạn", "chị em", thân mật, no luxury words
- Audience fit: explicitly mentions "văn phòng 34 tuổi" matching Ladysfit persona
- Topic link to fitness without forced selling (CTA mời comment, không hard sell)

**M4: Manual Run Endpoint + UI Button + Schema Migration (~55 phút)**
- Apply migration add_variants_to_contents qua Supabase MCP: ADD COLUMN variants JSONB + selected_variant_index INTEGER DEFAULT 0
- Create src/lib/content/queries.ts: insertGeneratedContent + updateWorkflowLastRun (RLS-aware Supabase client)
- Backward compat: copy variants[0].body to facebook_post column for existing UI patterns
- Create src/app/api/workflows/[id]/run/route.ts: POST endpoint 8-step flow
  - Auth check, workflow ownership via RLS, content_type filter, news_sources extract, brand fetch, news fetch (502 if all fail), Claude generate (500 if fail), DB save
  - runtime = 'nodejs' (jsdom requires Node), maxDuration = 60 (Vercel Pro 60s, Hobby 10s)
- Add Server Action runWorkflow() in actions.ts (internal HTTP fetch with cookie forwarding)
- Update src/components/workflows/workflow-card.tsx: button "Chạy ngay" với Play icon, Loader2 loading, toast inline auto-dismiss 5s
- useTransition isRunning state separate from isPending toggle/delete
- Bug fix: route.ts em assumed workflow.content_type field nhưng thực tế là workflow.type (camelCase WorkflowWithConfig) → fix
- Bug discovered: workflow "Tin sáng Ladysfit" config.news_sources = "https://www.healthandfitness.org/" (HTML homepage, không phải RSS) → update via Supabase MCP sang "https://vnexpress.net/rss/suc-khoe.rss"
- End-to-end localhost test PASS: 59s duration (3851 in + 2680 out tokens, ~$0.055/run), content_id f41f0a16-2cc7-4471-9c08-c1c322e7b84d
- last_run_at workflow updated 2026-05-13 04:51:49 UTC

**M5: Smoke Test + HANDOFF + Path 1 Strategy (~30 phút)**
- Phase 1 Pre-flight: working tree clean ahead origin 4 commits PASS
- Phase 2 Static: npx tsc --noEmit zero error PASS
- Phase 3 Build: npm run build 5.0s success, 11 routes + /api/workflows/[id]/run Dynamic ƒ PASS
- Phase 6 DB via Supabase MCP: migration columns verified, content count 1 last 24h, RLS enabled 3/3 tables PASS
- Phase 7 Security: no .env tracked, no hardcoded ANTHROPIC_API_KEY in src/, scripts/ ignored PASS
- Path 1 selected: localhost-only Day 9, defer production deploy Day 10 after background job pattern
- Update HANDOFF.md closing Day 9

**Commits Day 9 (5 commits + 1 sắp có):**
- `1444146` chore(week1-day9-m1): install anthropic sdk + rss parser dependencies
- `dc3fee7` feat(week1-day9-m2): hybrid rss + readability news fetcher
- `a3e7680` feat(week1-day9-m3): claude api content generator with brand voice prompts
- `4ed2437` feat(week1-day9-m4): manual run endpoint + chay ngay button + content save
- `<sắp có>` docs(handoff): close Day 9 - claude api content generation localhost-only

### Day 10 (13/05/2026)

**M1: Inngest SDK + API endpoint setup (~45 phút)**
- Signup Inngest account, lấy INNGEST_EVENT_KEY + INNGEST_SIGNING_KEY (Production env)
- Install Inngest SDK v4.4.0 (188 packages)
- Create src/inngest/client.ts với Inngest({id: 'auto-content-factory', eventKey})
- Create src/app/api/inngest/route.ts với serve() export GET/POST/PUT
- Add 3 env vars vào .env.local: INNGEST_EVENT_KEY + INNGEST_SIGNING_KEY + INNGEST_DEV=1
- Debug: curl endpoint trả "Unauthorized" → Inngest SDK production mode mặc định, cần INNGEST_DEV=1 cho localhost bypass signature verify (RULE D10-1)
- Verify localhost: function_count 0, mode dev, 2 key loaded

**M2: Refactor /api/workflows/[id]/run thành trigger endpoint nhanh (~25 phút)**
- Endpoint cũ 127 LOC chứa 8 step logic Day 9 (Claude generate 59s) → refactor thành 49 LOC trigger only
- Giữ Step 1 (auth) + Step 2 (workflow ownership) ở Vercel request (có user session)
- Move Step 3-8 sang Inngest function (M3 sẽ tạo)
- Pass userId + workflowId qua event data
- Verify: trigger < 1s, event xuất hiện ở Inngest dashboard, "Functions triggered: No functions triggered" (đúng vì M3 chưa tạo function)
- False alarm: nghi encoding corrupt khi PowerShell display Vietnamese rác - fix bằng `chcp 65001 + -Encoding UTF8`, file thật OK (RULE D10-3)

**M3: Tạo Inngest function workflowRunner với 4 step (~75 phút)**
- Tạo 3 file mới: src/lib/supabase/admin.ts (singleton admin client) + src/lib/inngest/queries.ts (2 fetch hàm) + src/inngest/functions/workflow-runner.ts (function chính)
- Update src/app/api/inngest/route.ts register workflowRunner
- 4 step: fetch-workflow-and-brand → fetch-news → generate-content (chậm nhất 60s) → save-content
- Config: concurrency 5, retries 3
- Debug 3 bug đoán schema/syntax:
  - Bug 1 (TS2554 Expected 2 arguments): Inngest v4 đổi API gộp config + trigger thành 1 object - em đoán sai 2 lần → RULE D10-4 đọc TypeScript signature thật node_modules/inngest trước khi viết
  - Bug 2 (TS2353 never type insert): Supabase admin client không có schema types → fix bằng `as never` type assertion (RULE D10-5)
  - Bug 3 runtime "column workflows.user_id does not exist": workflows table KHÔNG có user_id, chỉ có brand_id → fix bằng INNER JOIN brands user_id (RULE D10-6)
  - Bug 4 runtime "Could not find the 'hashtags' column": contents table KHÔNG có hashtags column, hashtags chứa trong variants JSONB → xoá field hashtags khỏi insert payload (RULE D10-6)
- Localhost end-to-end test PASS: Inngest run 70s, content_id 4d2829ce, variants_count 3, last_run_at workflow update

**M4: UI update workflow card cho async pattern (~20 phút)**
- Update Server Action runWorkflow return type: { content_id, source_title } → { job_id, message }
- Update UI workflow-card.tsx toast message: "Đã tạo content thành công!" → "Đã enqueue. Content sẽ lưu vào DB sau 1-2 phút."
- Verify tsc + grep keyword "enqueue" True + "Đã tạo content thành công" False

**M5: Deploy production + Inngest Cloud sync (~75 phút)**
- Add 3 env vars vào Vercel (ANTHROPIC_API_KEY + INNGEST_EVENT_KEY + INNGEST_SIGNING_KEY) cho 3 environments
- Tạo vercel.json với maxDuration 60s cho /api/inngest
- Build local pass + push origin main
- Deployment build ~67s success, 12 routes có /api/inngest + /api/workflows/[id]/run
- First curl production: HTML 500 with "Failed to load external module jsdom: ERR_REQUIRE_ESM"
- Fix: lazy dynamic import jsdom + readability bên trong fetchArticleContent function (xoá top-level import) → RULE D10-9 Vercel production strict ESM bundling
- Push fix → redeploy → curl production trả {"message":"Unauthorized"} (Inngest production mode, expected, không phải bug)
- Sync Inngest Cloud manually với URL https://auto-content-factory.vercel.app/api/inngest → SUCCESS 17:21:14 13/5/2026, SDK 4.4.0, 1 function (Workflow Runner)
- Smoke test production: trigger endpoint < 1s OK, Inngest run start, step fetch-workflow-and-brand 564ms ✅
- ❌ Step fetch-news FAIL: 3 retries × ~41s, error "No articles fetched" với VnExpress URL. Localhost cùng code pass 1.2s.
- Diagnose: có thể VnExpress block Vercel IP range (Singapore region) hoặc anti-bot. Bug data-specific, không phải code logic.
- Decision: Defer fix Day 11. Production architecture đã verify đúng (Inngest sync OK, endpoint không 500, lazy import fix work, trigger nhanh).

**Commits Day 10 (6 commits + 1 sắp có):**
- `5b15c65` chore(week1-day10-m1): install inngest sdk + setup api endpoint
- `0a34f80` refactor(week1-day10-m2): convert run endpoint to inngest trigger
- `f510bf2` feat(week1-day10-m3): inngest workflow-runner with 4-step background job
- `134fbdf` feat(week1-day10-m4): update ui toast for async enqueue pattern
- `87b4b26` fix(week1-day10-m5): lazy import jsdom + readability for vercel production
- `d86199f` chore(week1-day10-m5): add vercel.json with maxDuration 60 for inngest route
- `<sắp có>` docs(handoff): close Day 10 - inngest deployed, fetch-news bug defer Day 11

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
| **Hybrid RSS + Readability cho news fetching (Day 9)** | Miễn phí, lấy được full content (RSS chỉ có summary 200-300 chars). 1.34s fetch verified VnExpress. Pattern: rss-parser parse XML → @mozilla/readability extract main content từ HTML link. Compatible Vercel serverless (không cần playwright nặng). Day 10 generalize cho mọi báo Việt Nam. |
| **3 hook patterns trong system prompt (question/story/stat) (Day 9)** | Variants tự nhiên distinct, tránh Claude generate 3 hook tương tự nhau. Pattern từ skill `vuhai-content`. First-shot quality verified: 3 hooks không bị duplicate. |
| **Tone bucket low/mid/high cho Claude prompt (Day 9)** | Map 0-10 scale thành 3 bucket dễ hiểu cho LLM. Claude understand "Lịch sự rõ ràng, dùng anh/chị" tốt hơn "formality 8/10". Áp dụng cho cả 3 dimension formality/humor/emotion. |
| **Schema variants JSONB column thay vì TEXT serialize (Day 9)** | Schema Day 1 hardcode facebook_post TEXT lệch spec Day 9 (3 variants). Migration ADD COLUMN nullable JSONB (low-risk, 0 row existing). Pattern matches image_prompts JSONB đã có. Future: user select variant updates selected_variant_index thay vì rewrite data. |
| **Localhost-only Day 9 deploy (Path 1) (Day 9)** | Vercel Hobby timeout 10s không support 59s Claude generate. 3 alternatives: (A) Upgrade Pro $20/mo, (B) Background job Inngest, (C) Streaming response. Chosen Path 1: defer deploy Day 10 với background job pattern - robust nhất, scale tốt, không tốn tiền sớm. |
| **Inngest background job pattern (Day 10)** | Vercel Hobby timeout 10s không support 60s Claude generate. Inngest free tier 50k step/tháng đủ MVP, có dashboard + retry built-in, không cần port code Deno (như Supabase Edge Functions) |
| **4 step.run trong Inngest function thay vì 1 step monolith (Day 10)** | Cached kết quả mỗi step thành công → retry chỉ step fail (không gọi lại Claude API tốn $) + debug dashboard log từng step. Trade-off: 4 webhook call từ Inngest Cloud về Vercel (mỗi step) thay vì 1 |
| **Admin client (service_role) trong Inngest function (Day 10)** | Inngest function chạy ở environment riêng, KHÔNG có user session cookie → RLS-aware client fail. Pattern: filter manual bằng userId từ event payload, JOIN brands cho ownership verify |
| **Lazy dynamic import jsdom + readability (Day 10)** | Vercel production bundle nghiêm ngặt hơn localhost (Turbopack dev). Top-level import jsdom crash ERR_REQUIRE_ESM với transitive dep encoding-lite.js (ESM). Dynamic `await import()` bên trong function tránh bundle ESM khi register function |
| **maxDuration 60s cho /api/inngest route (Day 10)** | Inngest function chia 4 step, mỗi step = 1 webhook call. Step Claude generate 60s, save-content 1s. Vercel Hobby max 60s/function-call. KHÔNG sai khi tổng function 70s vì chia step. |

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

### Issues Day 9 (mới phát sinh)

- **Vercel Hobby timeout 10s blocks production "Chạy ngay":** Claude Sonnet 4.6 generate 3 variants ~30-60s. Hobby plan timeout 10s, Pro plan 60s. Day 9 localhost-only, defer fix Day 10 với background job pattern (Inngest hoặc Vercel Queue).
- **Workflow create form lacks RSS URL validation (RULE D9-5):** Day 8 zod chỉ check .url() pass, KHÔNG check RSS feed format. User tạo workflow với homepage URL → fetcher fail 502. Workaround: update DB qua MCP. Fix Week 2: add regex `.regex(/\.(rss|xml)$|\/rss\/|\/feed\//)` + placeholder example.
- **getBrandPrefix function tạo prefix `LT_` cho "Ladysfit" thay vì `LF_`:** Day 6 known issue persistent. Claude API tự override pattern (dùng `#Ladysfit` thay vì `#LT_GiamCan` trong test M3) → output đúng hơn DB. Defer fix Week 2.
- **signature_move column truncated giữa câu khi Day 6 lưu DB:** Value cắt ở "...toàn q...". JSONB column không có size limit Postgres, có thể là Day 6 onboarding TEXTAREA maxLength HTML attribute. Defer fix Week 2 cùng "Edit Brand Voice".
- **Workflow card có 220 LOC, workflow-card.tsx 291 LOC vượt 200 LOC limit:** CLAUDE.md rule. Cân nhắc tách RunButton + Toast + DeleteDialog thành sub-components. Defer Week 2 refactor.
- **actions.ts có 220 LOC vượt 200 LOC limit:** Cân nhắc tách actions/create.ts + actions/toggle.ts + actions/delete.ts + actions/run.ts + barrel. Defer Week 2.
- **No batch generation:** Day 9 chỉ fetch + generate FIRST article per run. Workflow news_based có thể có 3 nguồn × 3 articles = 9 candidates. Day 10 implement loop generate multiple contents per run.
- **No content review UI:** Content saved status='draft' nhưng chưa có /dashboard/contents page hiển thị. Week 3 build Content Review UI với variant selection (update selected_variant_index).
- **deprecation warning DEP0169 url.parse():** Node v24 deprecation warning từ một transitive dependency (có thể rss-parser hoặc anthropic-sdk). Không break, defer fix khi deps update.

### Issues Day 10 (mới phát sinh)

- **Production fetch-news FAIL với VnExpress URL (HIGH PRIORITY):** Localhost cùng code pass 1.2s, production retry 3 lần × ~41s mỗi attempt → "No articles fetched". Có thể VnExpress trả error hoặc block Vercel iad1/Singapore IP. Day 11 debug: (1) Test với RSS source khác (TuoiTre/Dantri), (2) Verify User-Agent header production, (3) Add fallback dùng RSS description nếu Readability fail.
- **Inngest v4 SDK API breaking từ v3:** `createFunction({...config, triggers: [{event:...}]}, handler)` thay vì v3 `createFunction(config, {event}, handler)`. Em đoán sai 2 lần Day 10 M3. Apply RULE D10-4 cho mọi SDK lạ.
- **vercel.json maxDuration KHÔNG nest functions/api/inngest/route.ts được nhận đúng:** Em set maxDuration 60 nhưng bug fetch-news không phải timeout (mỗi attempt 41s < 60s). Config có thể vẫn ổn cho future, nhưng chưa verify hard limit production thực tế.
- **PowerShell hiển thị Vietnamese rác mặc định trên Windows:** Codepage 850/1252 không render UTF-8 trong `Get-Content`. Pattern fix: `chcp 65001 + -Encoding UTF8`. False alarm encoding corrupt khi PowerShell display lỗi.
- **Vercel env vars chỉ apply cho deployments mới sau khi save (RULE D10-8):** Em paranoia case này nhưng thực ra commit M4 push SAU khi anh save env → OK. Nếu add env sau push, phải redeploy.
- **Supabase admin client không có schema types:** `from('table').insert()` infer thành `never`. Workaround: `as never` cast payload + `as { id: string }` cast result. Pattern dài hạn: chạy `supabase gen types typescript` Day 11+ để generate Database types.

### D5 Gotchas (vẫn áp dụng)
- D5-6: Vercel Framework Preset có thể bị set "Other" - check Settings → Build and Deployment
- D5-7: Đừng dùng `vercel link` với "Pull env now: YES" khi Vercel chưa có env (overwrite .env.local)
- D5-8: Phải add env vào Vercel cho cả 3 environments (Production + Preview + Development)

## 6. Next Steps

### Day 11 / Week 2: Fix production fetch-news bug + Cron handler

**Priority 1 - Fix production smoke test fail:**
- Verify VnExpress block Vercel IP qua test curl từ Vercel function với User-Agent debug
- Test với RSS source khác (TuoiTre, Dantri, CafeBiz) để confirm VnExpress-specific
- Implement fallback: nếu Readability extract fail, dùng RSS description (200-300 chars enough cho Claude prompt)
- Add detailed error logging trong fetcher.ts để Vercel runtime logs show HTTP status code thật
- Validate RSS URL trong workflow create form (RULE D9-5 cũ)

**Priority 2 - Cron handler:**
- Setup Vercel cron schedule cho auto-run workflows
- POST /api/cron/run-workflows endpoint dùng inngest.send() batch cho mọi enabled workflow
- Filter workflow theo schedule_cron + last_run_at để tránh trigger trùng

**Priority 3 - Content review UI:**
- Build /dashboard/contents page list contents generated
- Variant selector UI (3 cards radio) → update selected_variant_index
- Approve/reject UI

### Day 11 / Week 2: Batch generation + Multi-source
- Loop generate multiple content per workflow run (3 nguồn × 3 articles = 3 contents)
- Round-robin hoặc randomize article selection logic
- Test workflow với 2-3 RSS sources Việt Nam (TuoiTre, Dantri, CafeBiz)
- Workflow type 'evergreen' (topic-based, không cần news_sources) + 'promotional' (product CTA strong)

### Week 2-3: Content Review UI + Email delivery
- Build /dashboard/contents page list contents generated
- Variant selector UI (3 cards radio) → update selected_variant_index
- Status workflow: draft → approved → published (manual hoặc auto)
- Approve/reject UI với edit inline
- Resend integration gửi content draft email cho user review
- Cloudflare R2 storage cho media assets

### Week 3: Fix Day 6+7+8+9 known issues
- getBrandPrefix logic fix
- saveError persistent banner trong onboarding
- Add npm run lint script vào package.json
- BrandVoiceCard refactor base/wrapper
- Workflow edit form (reuse create form mode=edit)
- "Edit Brand Voice" button trên dashboard
- workflow-card.tsx + actions.ts refactor < 200 LOC
- Improve signup error message (bubble Supabase API detail)
- signature_move truncation fix (Day 6)

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

### Bài học Day 9 (5 RULES mới)

**RULE D9-1: PLACEHOLDER ENV VAR PHẢI VERIFY REPLACE TRƯỚC KHI DÙNG.**
Khi đưa lệnh `Add-Content` với placeholder text (vd `PASTE_KEY_THAT_VAO_DAY`), user dễ quên paste key thật. Pattern fix:
1. Đưa lệnh add placeholder
2. NHẮC RÕ user mở file paste key thật + save
3. VERIFY placeholder bị xoá bằng `Select-String -Pattern "=PLACEHOLDER" -Quiet` → phải trả `False`
Bug Day 9 M1: Em đưa lệnh add ANTHROPIC_API_KEY=PASTE_KEY_THAT_VAO_DAY, anh tưởng xong nhưng chưa save file thật. Fail test API 3 lần debug mới phát hiện. 5 phút lãng phí.

**RULE D9-2: ES MODULE HOISTING - DOTENV PHẢI LOAD QUA NODE FLAG, KHÔNG QUA `import`.**
ES Module `import` statements được hoist lên TRƯỚC mọi code khác trong file, kể cả `config()` viết phía trên trong source. Khi file được import (vd client.ts) đọc `process.env` ngay khi load, dotenv config từ caller script KHÔNG kịp.
3 cách fix theo độ ưu tiên:
1. **Best (Node 20.6+):** `tsx --env-file=.env.local script.ts` hoặc `node --env-file=.env.local --import tsx script.ts`
2. **OK:** Dynamic `await import()` sau khi `config()` chạy xong
3. **Anti-pattern (KHÔNG dùng):** Static `import` + `config()` trong cùng file - hoisting làm `config()` chạy SAU import
Pattern áp dụng cho mọi script utility chạy ngoài Next.js framework. Next.js auto-load .env.local nên không bị issue này.

**RULE D9-3: CLAUDE API JSON OUTPUT - PHẢI HANDLE EDGE CASES.**
Khi dùng Claude trả JSON, 3 cases phổ biến cần handle:
1. **Markdown wrapper:** Claude thường wrap JSON trong ` ```json ... ``` ` - cần regex extract
2. **Smart quotes:** Claude sometimes dùng `"…"` `'…'` Unicode thay vì ASCII - cần normalize
3. **Embedded quotes/newlines:** Nếu string value có `"` chưa escape hoặc `\n` literal, JSON.parse fail
Pattern fix:
1. Try markdown code block extract first (regex ```json...```)
2. Fallback brace matching `{...}`
3. Replace smart quotes → ASCII
4. JSON.parse
5. Zod validate schema for additional safety
Defer alternative: Anthropic tool use với `input_schema` để force structured output, bypass JSON parse hoàn toàn. Day 9 chỉ cần text parse, refactor sang tool use nếu cần robust hơn.

**RULE D9-4: VERCEL HOBBY TIMEOUT 10S - CLAUDE GENERATE > 10S CẦN BACKGROUND JOB.**
Sonnet 4.6 generate 2-3k output tokens ~30-60s. Vercel Hobby plan timeout 10s, Pro 60s. Manual run endpoint cần xử lý:
- Dev local: OK, không timeout
- Production Hobby: FAIL ngay
- Production Pro: Edge case > 60s vẫn fail
3 patterns recommend (theo priority):
1. **Background job (Inngest / Vercel Queue):** Best, scale tốt
2. **Streaming response:** Robust, UX tốt nhưng phức tạp
3. **Upgrade Pro + retry logic:** Quick fix, monthly cost
Day 9 chosen Path 1: Localhost only, deploy defer Day 10 với background job.

**RULE D9-5: WORKFLOW CREATE FORM PHẢI VALIDATE URL LÀ RSS FEED.**
Day 8 form chỉ check URL valid (zod `.url()`) nhưng KHÔNG check là RSS feed. User dễ paste homepage hoặc article URL → fetcher fail.
Fix Week 2:
1. Add zod regex check `.regex(/\.(rss|xml)$|\/rss\/|\/feed\//, 'URL phải là RSS feed')`
2. Add helpful placeholder: `"vd: https://vnexpress.net/rss/suc-khoe.rss"`
3. Add link "Tìm RSS feed của site phổ biến" với list VnExpress, TuoiTre, ThanhNien
Day 9 workaround: anh update DB qua Supabase MCP. Production cần validate đúng để UX tốt.

### Bài học Day 10 (10 RULES mới)

**RULE D10-1: INNGEST SDK PRODUCTION MODE MẶC ĐỊNH → CẦN `INNGEST_DEV=1` CHO LOCALHOST.** Không có flag dev mode, SDK assume production → curl trả {"message":"Unauthorized"} (demand signing key verify từ Inngest Cloud). Add INNGEST_DEV=1 vào .env.local localhost, KHÔNG add Vercel env production.

**RULE D10-2: POWERSHELL `Get-Content` PARSE `[...]` LÀ WILDCARD.** Path Next.js dynamic route `[id]` bị PowerShell hiểu là pattern matching. Fix: `Get-Content -LiteralPath 'path/[id]/file.ts'` (single quote).

**RULE D10-3: TRƯỚC KHI BÁO ENCODING CORRUPT, CHẠY `chcp 65001` + `-Encoding UTF8`.** PowerShell Windows mặc định codepage 850/1252 không render UTF-8 ở terminal output dù file thật UTF-8. Chỉ alarm corrupt khi `Select-String` match pattern rác (case True).

**RULE D10-4: INNGEST V4 DÙNG `triggers: [{event: '...'}]` (ARRAY).** v3 `createFunction(config, {event}, handler)` 3 args. v4 `createFunction({...config, triggers: [{event}]}, handler)` 2 args. Đọc `node_modules/<pkg>/types` qua Get-Content TRƯỚC khi viết với SDK lạ, KHÔNG đoán dù tự tin.

**RULE D10-5: SUPABASE CLIENT KHÔNG CÓ SCHEMA TYPES → INSERT/UPDATE INFER `NEVER`.** `@supabase/supabase-js` v2 không generate types từ DB → table operations bị `never`. Workaround: `as never` cast payload + cast result. Pattern dài hạn: `supabase gen types typescript` để generate Database types.

**RULE D10-6: VERIFY MỌI CỘT DB TRƯỚC KHI INSERT/UPDATE/SELECT - DÙNG SUPABASE MCP HOẶC ĐỌC SCHEMA.TS.** 3 bug Day 10 vì đoán cột: workflows.user_id, contents.created_at, contents.hashtags. Pattern PRE-WRITE: `SELECT column_name FROM information_schema.columns WHERE table_name = 'X'` hoặc đọc Drizzle schema. KHÔNG đoán dù đã làm với bảng đó.

**RULE D10-7: SYNC INNGEST PRODUCTION CHỈ KHI VERCEL DEPLOYMENT READY.** Code mới push → Vercel build 30-60s → READY → mới sync Inngest. Sync sớm = Inngest gọi URL khi route chưa tồn tại → "Internal server error response from URL" (HTTP 500).

**RULE D10-8: VERCEL ENV VARS CHỈ APPLY CHO DEPLOYMENTS MỚI SAU KHI SAVE.** Thêm env trước push code OK. Thêm sau push thì deployment hiện tại không có env, phải redeploy. Verify timeline "Added X ago" của env var vs `createdAt` deployment.

**RULE D10-9: VERCEL PRODUCTION KHÔNG BUNDLE ES MODULES NHƯ LOCALHOST DEV. LAZY IMPORT MODULE CÓ ESM TRANSITIVE DEPS.** Localhost Turbopack dev bundle ESM/CJS mượt. Vercel production strict → top-level import jsdom crash ERR_REQUIRE_ESM với transitive dep html-encoding-sniffer → encoding-lite.js (ESM). Fix: dynamic `await import()` bên trong function. Trade-off: cold-start +50-100ms.

**RULE D10-10: VERCEL HOBBY MAX_DURATION 60s ÁP DỤNG CHO MỖI INNGEST STEP RIÊNG.** Function 70s tổng OK nếu chia thành 4 step (mỗi step < 60s). Step Claude generate 60s, step save-content 1s. Inngest dashboard hiện duration tổng nhưng Vercel webhook tính từng step. Set `maxDuration: 60` trong vercel.json cho route `/api/inngest`.

### Lưu ý cho chat tiếp theo

- HANDOFF.md raw URL: https://raw.githubusercontent.com/vuhuyhai/auto-content-factory/main/HANDOFF.md
- Em fetch HANDOFF đầu chat. Nếu cache cũ → cross-check git log local
- **Day 10 DEPLOYED production**: 6 commits Day 10 + 5 commits Day 9 đã có trên local, sẽ push origin ở commit HANDOFF cuối. Production URL https://auto-content-factory.vercel.app LIVE với Inngest pipeline architect đúng.
- **Production smoke test STATUS:** Trigger endpoint OK, Inngest function discovered, step fetch-workflow-and-brand PASS, **step fetch-news FAIL** với VnExpress (timeout/block). Day 11 priority 1.
- Commit cuối local nên là `docs(handoff): close Day 10 - inngest deployed, fetch-news bug defer Day 11`
- Day 11 nếu anh tiếp tục: ưu tiên debug fetch-news production trước → test RSS source khác hoặc User-Agent debug
- Inngest Cloud production app `auto-content-factory` đã sync, SDK 4.4.0, function Workflow Runner trigger event `workflow/run.requested`
- Workflow Ladysfit (id b01973cb-7c76-49ec-adf7-6f980d3b7480) news_sources = `https://vnexpress.net/rss/suc-khoe.rss`, schedule 7h sáng - CHƯA có cron handler Day 11 sẽ làm
- DB hiện có 2 contents (Day 9 04:52 + Day 10 M3 09:57), Day 10 M5 production fail nên không có content thứ 3
