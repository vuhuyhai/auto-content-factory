# HANDOFF - Auto-Content Factory

## 1. Overview

**Project:** Auto-Content Factory (ACF)
**One-liner:** SaaS giúp SMB Việt Nam tự động hoá viết content social bằng brand voice riêng.
**Owner:** Vũ Hải (Chairman VSE, CEO Ladysfit)
**Started:** 12/05/2026
**Target launch:** Tuần 4 (~09/06/2026)
**Status:** Week 1 Day 6 - Onboarding flow 8 câu hỏi DONE ✅, READY TO DEPLOY

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
- ⏳ Migrate middleware.ts → proxy.ts modern (Day 7+)
- **Last verified:** 12/05/2026 - Day 6 close - Smoke test 6/6 phases PASS

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

### D5 Gotchas (vẫn áp dụng)
- D5-6: Vercel Framework Preset có thể bị set "Other" - check Settings → Build and Deployment
- D5-7: Đừng dùng `vercel link` với "Pull env now: YES" khi Vercel chưa có env (overwrite .env.local)
- D5-8: Phải add env vào Vercel cho cả 3 environments (Production + Preview + Development)

## 6. Next Steps

### Ngay sau Day 6 close (HÔM NAY): DEPLOY production

- Pre-deploy checklist verify
- `git push origin main` → Vercel auto-deploy
- Smoke test production: test full onboarding flow trên Vercel URL
- Verify brand "Ladysfit" còn trên DB sau deploy

### Day 7: Dashboard build thật + Brand Voice display

- Build dashboard layout với sidebar (Workflows + Settings)
- Display Brand Voice Card readonly view (đọc từ DB)
- "Edit Brand Voice" button → reuse onboarding flow với pre-fill data
- Migrate middleware.ts → proxy.ts modern (Next.js 16 native)

### Week 2: Workflow creation + Claude API integration

- Build form tạo Workflow gắn với brand (schedule cron, news source, content type)
- Save workflow vào table `workflows`
- Integrate Claude API Sonnet 4.6 cho content generation
- Replace rule-based archetype mapping bằng Claude API synthesize brand voice (lift quality 80%)
- Fix Day 6 known issues: getBrandPrefix, saveError persistent, npm run lint

### Week 3: Content generation engine + Email delivery

- Cron job đọc workflows, call Claude API, save vào `contents`
- Resend integration: gửi content draft email cho user review
- User approve/reject UI trên dashboard
- Cloudflare R2 storage cho media assets

### Week 4: Payment + Polish

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

### Lưu ý cho chat tiếp theo

- HANDOFF.md raw URL: https://raw.githubusercontent.com/vuhuyhai/auto-content-factory/main/HANDOFF.md
- Em fetch HANDOFF đầu chat. Nếu cache cũ → cross-check git log local, commit cuối nên là `docs(handoff): close Day 6 - onboarding flow deployed`
- Day 7 nếu anh tiếp tục: ưu tiên migrate middleware → proxy.ts modern + dashboard build thật + display Brand Voice Card readonly
- Day 6 verified production-ready, brand "Ladysfit" đã saved DB với JSON đúng 8/8 keys
