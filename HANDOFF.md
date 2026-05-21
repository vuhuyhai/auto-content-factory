# HANDOFF - Auto-Content Factory

## 1. Overview

**Project:** Auto-Content Factory (ACF)
**One-liner:** SaaS giúp SMB Việt Nam tự động hoá viết content social bằng brand voice riêng.
**Owner:** Vũ Hải (Chairman VSE, CEO Ladysfit)
**Started:** 12/05/2026
**Target launch:** Tuần 4 (~09/06/2026)
**Status:** Phase 2 Week 4 - **Day 26 DONE** (session 22/05/2026). Milestone vừa xong: Tech debt critical Day 26 - (a) Bổ sung FK `profiles.id → auth.users.id` ON DELETE CASCADE (Finding #2 Day 25 đóng), (b) Trigger `enforce_contents_brand_consistency` BEFORE INSERT/UPDATE OF brand_id/workflow_id chống drift `contents.brand_id != workflows.brand_id` qua workflow_id (Nhóm 2 #1 đóng), (c) Bỏ Drizzle ORM hoàn toàn - tạo `src/lib/db/types.ts` plain interfaces thay `src/lib/db/schema.ts`, refactor 4 file type-only import, uninstall `drizzle-orm` + `drizzle-kit` + `postgres`, xoá `drizzle.config.ts` + folder `drizzle/`, commit `94d7c8a` (Bug critical #2 đóng), (d) Fix Turbopack Server Action chết âm thầm - UpgradeCard chuyển từ `useTransition + onClick` sang `<form action> + useActionState` Next.js 16 recommended pattern (Bug critical #1 đóng). 4 bug critical Day 22-24 đều đóng. Còn lại: 5 bug nhỏ Polish UI + refactor 3 file >200 LOC + multi-source batch + bulk reject AlertDialog + PayOS regression edge case. Drop 10 mục defer/cancel (xem Section 8). Trước đó Day 25 hoàn thành email trial reminder cron `/api/cron/trial-reminders` (d3+d1 reminder, dedup 2 cột partial index, Resend domain `autocontent.online` verified, cron-job.org 9h VN daily, production smoke PASS).

## 2. Current State

- ✅ Cursor pack v2.0 active
- ✅ Next.js 16.2.6 + TypeScript + Tailwind v4 + Turbopack
- ✅ Supabase Pro plan connected (region ap-southeast-1)
- ✅ Drizzle ORM + 6 table với RLS enabled 6/6
- ✅ GitHub repo `vuhuyhai/auto-content-factory` với 31 commits (Day 11 close)
- ✅ Supabase Auth (email/password + Google OAuth)
- ✅ Middleware/Proxy bảo vệ /dashboard + force redirect /onboarding nếu chưa có brand
- ✅ Login + Signup + Confirm-email pages
- ✅ Schema profiles: 8 cột, trigger `handle_new_user` auto-create
- ✅ RLS verified dual-client SQL + UI smoke test
- ✅ shadcn/ui base 14 components (Button, Card, Badge, Separator, Input, Textarea, Label, Slider, Form, Checkbox, RadioGroup, Select, AlertDialog, Avatar, DropdownMenu, Sheet - tất cả manual paste do Node v24)
- ✅ Landing page 7 sections (Bento Grid + BRIDGE Framework)
- ✅ Production: ✅ LIVE - https://autocontent.online (alias auto-content-factory.vercel.app). Cron production ĐÊM ĐẦU TIÊN PASS - workflow Ladysfit 07:04 VN ngày 14/05/2026 auto-trigger qua cron-job.org → Vercel → Inngest → Claude → DB, content saved status=draft
- ✅ Onboarding flow 8 câu hỏi hoàn chỉnh
- ✅ Dashboard layout với sidebar (4 nav items: Brand Voice + Workflows + Nội dung + Settings) + mobile drawer
- ✅ User avatar dropdown với Logout
- ✅ Brand Voice Card readonly display trên /dashboard
- ✅ Workflow CRUD: list + create + toggle + delete + "Chạy ngay"
- ✅ Anthropic Claude Sonnet 4.6 integration với brand voice prompt
- ✅ News Fetcher (RSS-only, KHÔNG dùng jsdom): RSS feed → description → Claude prompt (Day 11 M2)
- ✅ Content Generator: 3 variants JSON với hook/title/body/hashtags
- ✅ Inngest background job 4-step (fetch-workflow → fetch-news → generate-content → save-content)
- ✅ Production Inngest pipeline LIVE: end-to-end run ~60-90s, content saved DB tự động (Day 11 M3 verified)
- ✅ Cron-job.org auto-trigger /api/cron/run-workflows mỗi 5 phút (Day 11 M4)
- ✅ Endpoint /api/cron/run-workflows với Authorization Bearer secret + cron-parser window match + 5-minute dedup
- ✅ Contents review dashboard `/dashboard/contents` list (paginated 20/page) + filter tabs 4 status + bulk approve/reject sticky bar + detail page variant selector
- ✅ Variant selector UI với 3 tab + select variant + copy clipboard
- ✅ `npm run build` PASS - 14 routes (Static `/`, Dynamic `/dashboard/contents` `/dashboard/contents/[id]` `/api/cron/run-workflows`)
- ✅ TypeScript zero error
- ✅ Schedule preset timezone fix (Day 12 P1): cron lưu UTC + label VN time, 5 preset mới, DRY pattern schema-from-constants, migration Ladysfit OK
- ✅ Content review status actions (Day 12 P2): approve/reject Server Action + optimistic UI, sidebar badge draft count, filter tabs 4 status với URL searchParams
- ✅ Workflow types evergreen + promotional (Day 13): strategy pattern prompt builders folder, generator discriminated union PromptContext, workflow-runner dispatch 3 type với 3 step (giảm 1 step so Day 10), form UI conditional + Server Action buildWorkflowConfig per type
- ✅ Test scripts 3 type localhost qua tsx (Day 13 M5.1): test-generator (news_based) + test-generator-evergreen + test-generator-promotional + _mock-brand DRY
- ✅ Edit inline 4 field variant (hook/title/body/hashtags) với jsonb partial update fetch-merge pattern, defense-in-depth ownership (Day 15 M3)
- ✅ Email infra Resend SDK v6.12.3 + React Email v1.0.12 ready, welcome template + send helper + hook /auth/callback fire-and-forget
- ✅ Daily digest email endpoint /api/cron/daily-digest production scheduled 1 AM UTC qua cron-job.org
- ✅ Migration add_last_digest_sent_at_to_profiles + partial index
- ✅ UNIQUE INDEX contents (workflow_id, source_url) partial WHERE source_url IS NOT NULL - prevent duplicate news_based + promotional, excludes evergreen (Day 18 M1.3)
- ✅ workflow-runner handle 23505 unique_violation graceful + last_run_at update both branches (insert success + duplicate skip) (Day 18 M1.4-M1.5)
- ✅ getBrandPrefix CamelCase detection + lowercase 2-char fallback (Ladysfit → LA, không còn LT) - 7/7 test PASS (Day 18 M2)
- ✅ npm run typecheck + npm run lint scripts (alias tsc --noEmit) - ESLint flat config defer Phase 2 (Day 18 M2)
- ✅ saveError banner clear navigation handlers (onEdit + goBack + goNext + handleConfirm helper clearSaveError) (Day 18 M3)
- ✅ Signup error translateSignupError helper map 7 Supabase codes tiếng Việt có dấu + login fix diacritics (Day 18 M4)
- ✅ Workflow edit form (Day 19): route /dashboard/workflows/[id]/edit reuse WorkflowForm mode=edit, updateWorkflow Server Action lock type + giữ last_run_at, workflowToFormData reverse-map config snake_case → camelCase, button Sửa icon Pencil trên card, banner warning khi edit workflow enabled=true
- ✅ Polish Phase 1 close (Day 20): Hero CTA "Xem cách hoạt động" xoá (link section chưa tồn tại) + BrandVoiceCard sub-header conditional theo readonly + empty state /dashboard/contents thêm CTA "Tạo workflow đầu tiên" cho currentStatus='all' + mobile tab "Đã từ chối"→"Từ chối" shorten + sticky bulk bar padding-bottom pb-24 tránh che content cuối list mobile
- ✅ saveError banner clearSaveError 4/4 touchpoint verified (Day 20 A1): code review onboarding-shell.tsx line 53 handleConfirm + line 119 onEdit + line 143 onBack + line 147 onNext gọi đúng cả 4 chỗ. Issue Day 19 M2b CLOSED.
- ✅ **PHASE 1 WEEK 2 MILESTONE DONE (Day 21):** Email infra + Bug fix outstanding + Workflow edit + Polish. Production LIVE end-to-end pipeline với 6 commit Day 20-21 deploy.
- ✅ **DB dọn về 1 user thật (Day 22-24):** Còn duy nhất `fitnessviet@gmail.com`. Day 22 phát hiện DB có 5 user, xóa 4 user test: `agency@marfit.vn`, `huyhaigym`, `aotapgym` brand "Test ACF3", `vuhuyhieu.0910`. Day 23-24 phát sinh thêm user test trong lúc thử flow, cleanup luôn cuối Day 24. State sạch trước deploy.
- ✅ **Pricing landing cập nhật giá mới (Day 23 M1):** Trang `PricingSection` landing đổi Starter 199K, Pro 399K, feature matrix theo tier mới. Thời gian dùng thử đổi 14 ngày → 7 ngày trên toàn bộ flow (text UI, banner, Server Action `TRIAL_DAYS`).
- ✅ **Bảng `subscriptions` tạo lại (Day 23 M2):** 10 cột: `id`, `user_id` UNIQUE + FK CASCADE, `tier`, `status`, `trial_start`, `trial_end`, `current_period_end`, `payos_order_code` bigint, `created_at`, `updated_at`. RLS bật, 1 policy SELECT own. Bảng cũ (Day 1 schema) thiếu cột nên DROP + tạo lại (lúc đó rỗng, không mất data).
- ✅ **PayOS tích hợp đầy đủ code (Day 23-24):** `@payos/node` v2.0.5, file `src/lib/payos/client.ts` + `constants.ts` (TRIAL_DAYS + TIER_CONFIG + isPaidTier) + `actions.ts` (startTrial trial-only + createPaymentLink gọi PayOS) + `webhook/route.ts` (verify chữ ký + check code='00' + cập nhật subscriptions + profiles) + `queries.ts` (getCurrentUserSubscription RLS). UI: `TrialBanner` 4 trạng thái (active = ẩn, trialing còn ngày, trialing hết hạn, chưa có gói) trong dashboard shell + `UpgradeCard` 2 nút "Bắt đầu dùng thử" / "Thanh toán ngay" trong dashboard.
- ✅ **Day 23-24 hoàn thành (19/05/2026):** trang giá mới (Free 0đ / Starter 199K / Pro 399K), tích hợp thanh toán PayOS đầy đủ (startTrial + createPaymentLink + webhook), tách UpgradeSection (server, ẩn gói đã mua) / UpgradeCard (client), gắn tên miền `autocontent.online` (DNS + SSL OK), email templates cập nhật domain mới. Đã test thanh toán THẬT 199K thành công, webhook fire, DB cập nhật status='active' đúng. Sẵn sàng cho Day 25.
- ✅ **Polish UI hoàn thiện DONE (milestone vừa xong):**
  - Fix fallback origin signup từ vercel.app sang autocontent.online (Polish #1)
  - Tạo 6 trang public mới: /terms /privacy /contact /roadmap /blog /docs, bỏ link /docs/api khỏi footer (Polish #2)
  - Centralize bonus offer constants thành OFFER_CONFIG block trong bonus-guarantee-section.tsx (Polish #3)
  - Favicon + OG image động dùng ImageResponse API, static prerender lúc build (Polish #4)
  - Tăng tap target nút edit brand voice card lên 44x44px chuẩn WCAG/Apple HIG (Polish #5)
- ✅ **Day 25 DONE (21/05/2026) - Email nhắc sắp hết trial:**
  - Cron endpoint `/api/cron/trial-reminders` (POST + GET healthcheck), 2 reminder window 24h: d3 + d1
  - 2 React Email template: `trial-ending-3-days.tsx` + `trial-ending-1-day.tsx`
  - Dedup qua 2 cột `reminder_d3_sent_at` + `reminder_d1_sent_at` (migration `day25_add_trial_reminder_dedup_columns`) + 2 partial index btree
  - Resend domain `autocontent.online` verified (Hostinger DNS auto-sync), sender `noreply@autocontent.online`
  - cron-job.org job "ACF Trial Reminders Daily" schedule `0 2 * * *` UTC = 9h sáng VN
  - Smoke test local PASS (checked=2, sent=2, failed=0, dedup verified) + production smoke PASS (200 OK, no-eligible-users)
  - Commit `13f4001`, code đã push origin/main, Vercel auto-deploy READY
- **Last verified:** 22/05/2026 - Day 26 DONE. 4 việc critical đóng: FK CASCADE profiles→auth.users, trigger chống brand_id drift, bỏ Drizzle, fix Turbopack Server Action. Tiếp theo: 5 bug nhỏ Polish UI + refactor 3 file >200 LOC + multi-source batch + bulk reject AlertDialog + PayOS regression edge case (xem Section 8).

### Day 11 additions (13/05/2026)

**M1: Logging detailed cho fetcher.ts (~30 phút)**
- Thêm 11 log calls vào src/lib/news/fetcher.ts với prefix `[news-fetcher]` cho Vercel Runtime Logs capture
- Refactor RSS parse: thay `parser.parseURL(feedUrl)` bằng raw `fetch()` + `parser.parseString()` để kiểm soát timeout, headers, log HTTP status, response size, duration
- Log structure: start / rss-fetch-start / rss-fetch-response (status + content-type + size + duration) / rss-fetch-body / rss-parse-ok / rss-items-filter / article-fetch-start / article-fetch-ok hoặc article-fetch-error / done
- Mục đích: Debug production fetch-news fail (Day 10 hypothesis VnExpress block Vercel IP)
- Commit `1a64bf8` debug(week1-day11-m1)

**M2: Replace jsdom + readability với RSS description (~50 phút)**
- ROOT CAUSE phát hiện: KHÔNG phải VnExpress block IP. Day 11 M1 logs cho biết RSS fetch PASS HTTP 200 với 60 items, 3 recent items, NHƯNG step Readability article extract FAIL với `ERR_REQUIRE_ESM` từ transitive dep `@exodus/bytes/encoding-lite.js` của `html-encoding-sniffer` (jsdom dep). Day 10 lazy `await import('jsdom')` CHƯA đủ - Vercel production strict CJS loader vẫn crash transitive ESM
- Quyết định: Bỏ jsdom + Readability hoàn toàn (KHÔNG fix ESM bundling vì sẽ tốn cuộc chiến dài hạn)
- Refactor src/lib/news/fetcher.ts: xoá hàm `fetchArticleContent` (44 LOC) + dynamic import jsdom/readability. Thêm helper `extractDescription(item)` đọc `contentSnippet → content → description` với HTML strip + entity decode + min 80 chars threshold
- Verify RSS description đủ context: VnExpress description ~200 chars/item, đầy đủ Who/What/Where/When, Claude generate 3 variants chất lượng cao (verified Day 11 M3)
- Trade-off accepted: Content ngắn hơn (~200 chars vs ~2000 chars Readability) đổi lấy production reliability + 5MB bundle savings
- Commit `fb3bc56` fix(week1-day11-m2)

**M3: Production smoke test end-to-end PASS (~25 phút)**
- Deploy M2 fix → trigger workflow Ladysfit production qua "Chạy ngay" button
- Inngest run COMPLETED 1m 2s: fetch-workflow 1.071s → fetch-news 947ms ✅ (vs Day 10 fail 41s × 3 retries) → generate-content 54.481s → save-content 2.740s
- DB verified: content "Người Việt tăng huyết áp, tim mạch do thói quen ăn mặn" saved (id e5dc4bce-68e8-419c-adce-eeffaa283c26), 3 variants chất lượng cao, voice Ladysfit Everyman archetype match perfect ("mình", "bạn", "chị em mình", "nghe mà giật mình")
- 4 voice signature verified: tone match + audience fit + topic link + pivot pattern
- Day 10 bug ERR_REQUIRE_ESM FIXED hoàn toàn

**M3.5: Cleanup deps (~15 phút)**
- npm uninstall jsdom @mozilla/readability @types/jsdom → removed 42 packages (jsdom + 41 transitive deps)
- Build time 4.0s (Day 9: 5.0s, Day 8: 4.2s) - giảm 20% nhờ bỏ jsdom
- Verify zero match `jsdom|readability` trong src/, package.json, build pass
- Commit `ad0d6ae` chore(week1-day11-m3)

**M4.1: Build /api/cron/run-workflows endpoint (~60 phút)**
- Install cron-parser@5 cho cron expression match logic
- Generate CRON_SECRET base64 24 bytes (~32 chars) bằng PowerShell RNGCryptoServiceProvider
- Create 3 file:
  - src/lib/cron/should-trigger.ts (23 LOC): `isCronInWindow(cronExpr, now)` dùng CronExpressionParser.prev() match cửa sổ 5 phút trở lại + `isOutsideDedupWindow(lastRunAt, now)` 5-minute dedup
  - src/lib/cron/queries.ts (46 LOC): `fetchEnabledWorkflows()` admin client (bypass RLS) JOIN brands lấy user_id + `markWorkflowTriggered(workflowId)` update last_run_at sau khi inngest.send() OK
  - src/app/api/cron/run-workflows/route.ts (81 LOC): POST endpoint với 8 log call, Authorization Bearer auth, batch inngest.send() cho workflows match cron + GET healthcheck (không auth)
- 6 test localhost PASS:
  - GET healthcheck → 200 OK JSON
  - POST no auth → 401
  - POST sai secret → 401
  - POST đúng secret cron 0 7 * * * → 200 `triggered:0, skipped:1, reason:cron-not-in-window` ✅
  - Update workflow cron `* * * * *` + last_run_at NULL → POST → 200 `triggered:1, triggered_ids:[ladysfit-id]` ✅
  - POST lại ngay → 200 `triggered:0, skipped:1, reason:dedup-window-active` ✅
- End-to-end Inngest run thật từ localhost trigger COMPLETED 2m39s, content "Tăng huyết áp" saved DB
- Bug encounter: Localhost test 5 đầu fail "fetch failed" do INNGEST_DEV=1 → redirect event sang dev server localhost:8288 (chưa start). Fix tạm: comment INNGEST_DEV=1, restart dev, event đi lên Cloud production thay → PASS. Sau test restore INNGEST_DEV=1
- Commit `4ae8495` feat(week1-day11-m4)

**M4.2: cron-job.org setup + production verify (~30 phút)**
- Add CRON_SECRET vào Vercel env (3 environments) + redeploy
- Production smoke 3 test:
  - GET healthcheck production → 200 ✅
  - POST no auth → 401 ✅
  - POST với secret đúng → 200 `triggered:0, skipped:1, reason:cron-not-in-window` ✅
- Setup cron-job.org job "ACF Workflow Runner":
  - URL https://auto-content-factory.vercel.app/api/cron/run-workflows
  - Schedule `*/5 * * * *` (every 5 minutes)
  - Method POST + Authorization header
  - Timezone UTC + Timeout 30s
- TEST RUN manual cron-job.org → Status 200 OK, Duration 2.35s, Response body verified `checked:1, triggered:0, skipped:1, cron-not-in-window`
- Production cron pipeline LIVE: cron-job.org → Vercel endpoint → Inngest Cloud → Production function → Claude API → DB
- Note: PowerShell `Invoke-WebRequest` ErrorDetails.Message KHÔNG capture body 401 → cần dùng GetResponseStream() để đọc raw body

**M5.1+5.2: Contents review dashboard (~75 phút)**
- Tạo 6 file:
  - src/lib/contents/types.ts (22 LOC): Content + ContentWithWorkflow interfaces + normalizeHashtag helper
  - src/lib/contents/queries.ts (61 LOC): getCurrentUserContents (JOIN workflows lấy config name) + getContentById (RLS-aware Supabase client) - Cursor extract rowToContent helper DRY pattern
  - src/app/dashboard/contents/actions.ts (26 LOC): Server Action selectVariant(contentId, variantIndex) update DB + revalidatePath
  - src/app/dashboard/contents/page.tsx (90 LOC): Server Component list page, empty state, card với title/badge/workflow/relative-time/variant-count, line-clamp-2, hover border đỏ
  - src/app/dashboard/contents/[id]/page.tsx (84 LOC): Server Component detail page, back link, header + source URL link, render ContentVariantSelector
  - src/components/contents/content-variant-selector.tsx (117 LOC): Client Component 3 tab Variant 1/2/3, title h2 + hook box border đỏ trái + body whitespace-pre-wrap + hashtags badges, button "Chọn variant này" (Server Action optimistic) + "Copy nội dung" (clipboard API)
- Localhost test PASS: list page 5 contents hiển thị đẹp + detail page 3 tab variants + select variant + copy clipboard
- Voice quality verified visual: variant 1 "Thói quen ăn mặn..." perfect Ladysfit voice với hook scroll-stopping + body 400 chars + 5 hashtags

**M5.3: Sidebar nav update (~5 phút)**
- Sửa src/components/dashboard/sidebar-nav.tsx: thêm 1 entry "Nội dung" với icon FileText giữa Workflows và Settings
- Order: Brand Voice → Workflows → Nội dung → Settings
- Logic `pathname.startsWith('/dashboard/contents')` cho detail page tự active đúng dòng "Nội dung"
- Commit `6dcfa81` feat(week1-day11-m5)

### Day 12 P1 additions (13/05/2026)

**Schedule preset timezone fix (~3h gồm debug .env.local + build fix DRY schema):**
- BUG Day 8 phát hiện: 5 preset "Mỗi sáng 7h" lưu cron `0 7 * * *` (UTC) = 14h chiều VN, KHÔNG phải 7h sáng VN như label hứa. Tất cả 5 preset đều lệch 7h.
- Pattern fix chọn: Lưu cron UTC (industry standard) + display label VN time. KHÔNG dùng pattern "lưu local + convert runtime" để tránh phức tạp logic.
- Refactor 3 file:
  - `src/lib/workflows/types.ts`: ScheduleCronValue literal union mới (5 cron UTC) + DEFAULT_WORKFLOW_FORM_DATA.scheduleCron = '0 0 * * *'
  - `src/lib/workflows/constants.ts`: 5 preset value/label mới với chữ "giờ Việt Nam" trong label + 2 helper mới `vnHourToUtcCron(hour, minute)` + `utcHourToVnHour(utcHour)` + `getScheduleLabel()` cập nhật fallback "Tuỳ chỉnh (cron UTC)"
  - `src/lib/workflows/schemas.ts`: Refactor DRY - SCHEDULE_CRON_VALUES derive từ SCHEDULE_PRESETS.map() thay vì hardcode literal. Lần sau thêm/sửa preset chỉ đụng constants.ts.
- 5 preset mới:
  - "Mỗi sáng 7h (giờ Việt Nam)" → `0 0 * * *` UTC
  - "Mỗi tối 8h (giờ Việt Nam)" → `0 13 * * *` UTC
  - "2 lần mỗi ngày (7h sáng + 8h tối, giờ Việt Nam)" → `0 0,13 * * *` UTC
  - "Mỗi thứ Hai 9h sáng (giờ Việt Nam)" → `0 2 * * 1` UTC
  - "Thứ 2, 4, 6 lúc 9h sáng (giờ Việt Nam)" → `0 2 * * 1,3,5` UTC
- Migration DB qua Supabase MCP: workflow Ladysfit (id b01973cb-7c76-49ec-adf7-6f980d3b7480) `schedule_cron='0 7 * * *' → '0 0 * * *'`, `last_run_at=NULL` để unblock dedup
- Files KHÔNG đụng (auto reflect qua DRY):
  - `workflow-card.tsx` đã dùng `getScheduleLabel()` helper → tự reflect label mới
  - `workflow-form.tsx` đã map qua `SCHEDULE_PRESETS` → tự reflect option mới
- Build production PASS: 14 routes, TypeScript zero error, 13/13 static pages
- Verify localhost + production endpoint: POST /api/cron/run-workflows trả `200 skipped:1 cron-not-in-window` (đúng vì test chiều VN = sáng UTC, không match cron 0h UTC)
- Commit `5e672f1` feat(week1-day12-p1)

**Debug saga `.env.local` (~1h - lessons learned 4 RULES mới):**
- Lúc test localhost endpoint, em sai pattern PowerShell làm CRON_SECRET extract thất bại nhiều lần. 4 root causes phát hiện:
  1. .env.local đã có CRON_SECRET (Day 11 add), em đưa lệnh Add-Content tạo dòng DUPLICATE
  2. `$matches` là automatic variable của PowerShell regex `-match` operator, conflict khi dùng làm tên biến
  3. `Select-String -SimpleMatch` TẮT regex hoàn toàn → anchor `^` `$` thành literal character → pattern `^CRON_SECRET=` match 0 dòng dù file có
  4. `Set-Content -Encoding UTF8` PowerShell 5.x mặc định thêm BOM `EF BB BF` ở đầu file
- Fix: dùng pattern `Select-String -Path ".env.local" -Pattern "^CRON_SECRET="` KHÔNG có `-SimpleMatch` để `^` hoạt động regex anchor + force `[string]$cronLine = (...).Line` ép kiểu single string
- Backup file `.env.local.backup-20260513-210731` giữ lại an toàn

### Day 12 P2 additions (13/05/2026)

**M1: Verify schema contents.status (~15 phút)**
- Supabase MCP execute_sql 5 queries: schema columns + enum check + CHECK constraint + count by status + sample 3 rows
- Phát hiện: contents.status là varchar (KHÔNG enum), KHÔNG CHECK constraint, default 'generating'
- DB hiện 5 contents đều status='draft' (M1 baseline)
- Quyết định: KHÔNG migration ALTER TABLE Day 12 P2. App layer enforce status qua TypeScript literal union + Zod schema (pattern DRY single source of truth Day 12 P1 RULE D12-4)

**M2: Server Action approve/reject + Button UI optimistic (~75 phút)**
- M2.1: Types + Schema (~10 phút)
  - src/lib/contents/types.ts: CONTENT_STATUS_VALUES = ['generating', 'draft', 'approved', 'rejected'] as const + ContentStatus type derive + CONTENT_STATUS_LABELS record map VN labels
  - src/lib/contents/schemas.ts mới (15 LOC): updateStatusSchema dùng z.enum tuple cast pattern DRY
  - Cursor TASK 3 phát hiện: 2 page hardcoded map có key 'sent' (không còn) → fix M2.2
- M2.2: Server Action + refactor 2 page hardcoded (~20 phút)
  - actions.ts +33 LOC: updateContentStatus(input) với Supabase createClient + auth.getUser + UPDATE contents + revalidatePath
  - Refactor list + detail page bỏ map hardcoded, dùng CONTENT_STATUS_LABELS[content.status]
  - tsc PASS clean
- M2.3: Button UI status bar (~25 phút)
  - content-variant-selector.tsx 117→184 LOC (+67): prop status, state currentStatus + isUpdatingStatus, handler handleUpdateStatus optimistic + revert
  - Render status bar trước Tabs: Badge bên trái (4 màu theo status) + 2 button "Duyệt"/"Từ chối" khi draft + button nhỏ "Đặt lại chờ duyệt" khi approved/rejected
  - Native button consistency với existing pattern (không mix shadcn Button)
- M2.4a: Refactor alert() → toast state (~5 phút)
  - Unify với existing toast pattern handleSelectVariant, 3000ms auto-dismiss, finally block
- M2.4b: Smoke test browser PASS 6 steps
  - List page render labels OK, status bar approve flow optimistic OK, DB persist verified qua Supabase MCP (e5dc4bce status draft→approved), reject flow OK
- Commit `8e3470f` feat(week1-day12-p2-m2)

**M3: Sidebar badge count draft contents (~45 phút)**
- M3.1: Implement (~30 phút)
  - queries.ts +30 LOC: countDraftContentsForCurrentUser() dùng Supabase count exact head true + brands!inner join, silent fail return 0
  - Sidebar pattern phát hiện: sidebar-nav.tsx là Client (usePathname), sidebar.tsx là Server, dashboard-shell.tsx là Server → fetch ở dashboard-shell pass props 2 nhánh (desktop + mobile)
  - 5 file edit: queries + dashboard-shell (async fetch) + sidebar + mobile-drawer + sidebar-nav
  - Badge UI: span bg-red-600 text-white rounded-full font-mono text-xs, render khi draftCount > 0, "99+" nếu >99
  - draftCount optional prop (default 0) → backward compatible
- M3.2: Fix preemptive revalidate layout + smoke test (~15 phút)
  - Fix preemptive: thêm revalidatePath('/dashboard', 'layout') vào updateContentStatus actions.ts
  - Lý do: sidebar render từ layout, revalidate page path KHÔNG re-render layout → badge stale
  - Smoke test PASS 5 steps qua 4 screenshots: badge initial 4 → approve giảm 3 KHÔNG cần F5 → reject giảm 2 → mobile drawer cũng có badge → revert empty state
- Commit `01a76cc` feat(week1-day12-p2-m3)

**M4: Filter tabs by status với URL searchParams (~50 phút)**
- M4.1: Implement (~35 phút)
  - queries.ts +37 LOC: countContentsByStatusForCurrentUser() return Record<ContentStatus | 'all', number> aggregate client-side bằng reduce (Supabase JS không có GROUP BY native)
  - queries.ts: getCurrentUserContents thêm param optional statusFilter?: ContentStatus, .eq('status', filter) khi có
  - contents-filter-tabs.tsx mới 60 LOC: Server Component dùng <Link>, 4 tab "Tất cả / Chờ duyệt / Đã duyệt / Đã từ chối" với active border đỏ + count badge bg-red-100 active / bg-gray-200 inactive
  - page.tsx 90→123 LOC (+33): Next.js 16 searchParams Promise pattern, await searchParams, parse status validate qua CONTENT_STATUS_VALUES.includes, Promise.all 2 queries song song, dynamic sub-header "{count} nội dung · {LABEL}", 4 empty state messages khác nhau theo filter
  - Pattern URL: /dashboard/contents (all) | ?status=draft | ?status=approved | ?status=rejected. Invalid status fallback "Tất cả"
- M4.2: Smoke test browser PASS 6 steps qua 6 screenshots
  - Default 4 tabs render OK + counts đúng (Tất cả 5 / Chờ duyệt 1 / Đã duyệt 2 / Đã từ chối 2 - sau test M3 đã thay đổi state)
  - Filter từng tab work + URL searchParams đúng + content list filter đúng
  - Invalid status `?status=invalid` fallback "Tất cả" 5 contents
  - Mobile responsive tabs scroll ngang (chữ "Đã từ chối" hơi chật, defer Week 2 nếu cần fix)
- Commit `2b7251e` feat(week1-day12-p2-m4)

### Day 14 additions (14/05/2026)

- **Pre-flight: Disable 2 workflow test Day 13 (~5 phút):** Anh disable 2 workflow test Day 13 (`5926eb93-...` evergreen + `d4fbdbd7-...` promotional) trước khi vào dev. Workflow Ladysfit (b01973cb) giữ enabled=true. UPDATE workflows SET enabled = false WHERE id IN (...) qua Supabase MCP. Verify 2 dòng enabled=false trả về OK.
- **Production cron đêm đầu tiên PASS (verify đầu phiên):** Cron-job.org → Vercel endpoint mỗi 5 phút đều như metronome (12+ entries/h, tất cả 200 OK, 0 error/warning/fatal trong 24h). Lúc 07:04:11 VN 14/05, workflow Ladysfit fire đúng cron `0 0 * * *` UTC + match window 5 phút. Content "Chuyên gia mách mẹo 'ngủ ngược' giúp nhanh vào giấc" generated, voice Ladysfit perfect ("Bạn vừa sinh xong, nhìn bụng mà thở dài..." pattern Everyman archetype). Content saved status=draft trong DB. Đây là LẦN ĐẦU pipeline tự chạy không có anh can thiệp kể từ setup Day 11 M4.
- **M1: Pagination /dashboard/contents (~45 phút):**
  - File mới `src/components/contents/contents-pagination.tsx` 68 LOC Server Component, props (currentPage, totalPages, totalCount, statusFilter?), render NULL nếu totalPages <= 1, hiển thị "X-Y / Z nội dung" + 2 link Prev/Next preserve searchParams
  - Refactor `src/lib/contents/queries.ts` 160 LOC: getCurrentUserContents nhận thêm param page (default 1), apply `.range((page-1)*20, page*20-1)` trên Supabase query. Thêm function mới getContentsTotalCount(statusFilter?) dùng `.select('id', { count: 'exact', head: true })` với filter brands!inner cho ownership
  - Refactor `src/app/dashboard/contents/page.tsx` 168 LOC: parse pageParam từ searchParams.page (validate >=1, coerce invalid → 1), redirect-on-overflow (page > totalPages khi totalCount > 0 → redirect path-only), 3 query Promise.all (contents paginated + count by status + total count)
  - Thêm const `CONTENTS_PAGE_SIZE = 20` vào types.ts (pattern DRY single source of truth - RULE D12-4)
  - Build PASS 15 routes, TypeScript clean. Commit `a1863e9` feat(week1-day14-m1).
- **M2: Bulk approve/reject với sticky bottom bar (~75 phút):**
  - File mới `src/components/contents/content-list-item.tsx` 93 LOC Client Component, wrap card với checkbox bên trái, isSelected=true → border-red-500 + bg-red-50/30 visual feedback, e.stopPropagation cho checkbox tránh navigate detail page
  - File mới `src/components/contents/contents-bulk-actions.tsx` 144 LOC Client Component, state `selectedIds: Set<string>`, master checkbox "Chọn tất cả N nội dung trong trang", sticky bottom bar position fixed bottom-0 left-0 right-0 z-50 hiện khi selectedIds.size > 0, 3 button (Bỏ chọn / Từ chối đỏ / Duyệt xanh), reset selectedIds khi statusFilter prop đổi (useEffect)
  - Extend `src/lib/contents/types.ts` thêm interface BulkUpdateInput (ids + status)
  - Extend `src/lib/contents/schemas.ts` thêm bulkUpdateStatusSchema z.object({ ids: z.array(z.string().uuid()).min(1).max(100), status: z.enum(...) })
  - Extend `src/app/dashboard/contents/actions.ts` 113 LOC thêm Server Action bulkUpdateStatus với defense-in-depth 2 round-trip (Cách 2 fallback vì Supabase JS không support join trong UPDATE): query 1 select brands!inner(user_id).eq('brands.user_id', user.id).in('id', ids) derive owned subset, query 2 update only validIds. Return { success, updated_count }
  - Refactor `src/app/dashboard/contents/page.tsx` 115 LOC (từ 168 LOC sau M1): thay block .map() render inline → wrap toàn bộ list bằng ContentsBulkActions
  - Smoke test 4 PASS qua 3 screenshot: single checkbox + master "Chọn tất cả 7" + bulk approve 2 contents (toast xanh + tab count Chờ duyệt 3→1 + Đã duyệt 2→4) + reset selection khi đổi filter
  - DB verify qua Supabase MCP: count by status sau bulk approve = 4 approved + 1 draft + 2 rejected = 7 total. Khớp 100%.
  - Build PASS 15 routes. Commit `2b1a626` feat(week1-day14-m2).

**Last verified:** 14/05/2026 - Day 15 close - Edit inline body variant M3 PASS (commit ce87564, Vercel deploy READY 44s 0 error). Plan Week 2-3 chốt Profile A soft validation 14 ngày 22-30h.

## 3. Done So Far

### Day 1-10 (12-13/05/2026)
Day 1 setup foundation (Next.js + Drizzle + Supabase), Day 2-3 Auth (email + Google OAuth), Day 4 RLS, Day 5 landing page BRIDGE, Day 6 onboarding 8-step, Day 7 dashboard sidebar + brand voice readonly, Day 8 workflow CRUD, Day 9 Claude API content generator localhost-only (Vercel Hobby timeout block deploy), Day 10 Inngest background job deploy production (architect PASS, fetch-news bug defer Day 11).

**Commits Day 1-10:** 25 commits từ `81a10bd` Initial → `2cd1e4b` HANDOFF Day 10 close.

### Day 11 (13/05/2026)

**6 commits Day 11 + 1 sắp có:**
- `1a64bf8` debug(week1-day11-m1): add detailed logging + raw fetch RSS parse
- `fb3bc56` fix(week1-day11-m2): replace jsdom+readability with RSS description
- `ad0d6ae` chore(week1-day11-m3): uninstall jsdom + readability + types (42 packages)
- `4ae8495` feat(week1-day11-m4): cron endpoint with auth + dedup + inngest trigger
- `6dcfa81` feat(week1-day11-m5): contents review dashboard with variant selector
- `<sắp có>` docs(handoff): close Day 11 - production pipeline live with auto-trigger

### Day 12 P1 (13/05/2026)

**1 commit Day 12 + sắp có HANDOFF commit:**
- `5e672f1` feat(week1-day12-p1): fix schedule preset timezone bug - utc cron + vn label

### Day 12 P2 (13/05/2026)

**3 commits Day 12 P2 + sắp có HANDOFF commit:**
- `8e3470f` feat(week1-day12-p2-m2): content review status actions với approve/reject buttons + optimistic UI
- `01a76cc` feat(week1-day12-p2-m3): sidebar badge count draft contents với revalidate layout
- `2b7251e` feat(week1-day12-p2-m4): filter tabs by status với URL searchparams
- `<sắp có>` docs(handoff): close Day 12 P2 - content review status actions

### Day 13 (13/05/2026)

**M0: Audit + verify schema (~15 phút)**
- Supabase MCP query workflows: 1 workflow Ladysfit type='news_based' với config `{name, news_sources}`
- Cursor audit `src/inngest/functions/workflow-runner.ts` (path thật, KHÁC HANDOFF Day 12 P2 ghi `src/lib/inngest/...`) → throw "not yet supported" cho type !== news_based, 4 step.run (fetch-workflow-and-brand / fetch-news / generate-content / save-content)
- `ContentType` literal đã có 3 type sẵn từ Day 8. `CONTENT_TYPE_VALUES` const array sẵn DRY pattern Day 12 P1 RULE D12-4
- Form đã có radio chọn 3 type, conditional render newsSources khi news_based. Thiếu UI field cho evergreen/promotional
- prompts Day 9 là 1 file đơn `src/lib/content/prompts.ts` (KHÔNG phải folder)
- Encoding verify: 3 file workflows/* UTF-8 NO BOM (`69 6D 70 6F` = "impo")

**M1: Types + Schemas + Constants (~25 phút)**
- types.ts: extend `WorkflowConfig` thành discriminated union 3 type (WorkflowConfigBase + WorkflowConfigNewsBased + WorkflowConfigEvergreen + WorkflowConfigPromotional). `WorkflowConfigNewsBased.type` optional cho backward compat (workflow Ladysfit hiện tại config không có `type` field)
- types.ts: extend `WorkflowFormData` thêm `topicFocus?` + `productLink?` + `offer?`. DEFAULT_WORKFLOW_FORM_DATA thêm 3 field empty string
- schemas.ts: extend Zod base schema + superRefine validate per type
  - evergreen: topic_focus 20-500 chars
  - promotional: product_link URL hợp lệ + offer 30-500 chars
- constants.ts: KHÔNG đụng (CONTENT_TYPES đã có 3 option đầy đủ từ Day 8)
- tsc PASS, types.ts 89 LOC, schemas.ts 110 LOC (cả 2 < 200 LOC limit)

**M2: Prompt builders folder + Generator refactor (~50 phút)**
- M2.1: Tạo folder `src/lib/content/prompts/` với 5 file:
  - `_base.ts`: ARCHETYPE_DESCRIPTIONS, TONE_GUIDE, getToneBucket, buildBrandContext (chia sẻ chung 3 type), OUTPUT_SPEC_COMMON
  - `news-based.ts`: buildSystemPromptNewsBased + buildUserPromptNewsBased (giữ logic Day 9)
  - `evergreen.ts`: buildSystemPromptEvergreen + buildUserPromptEvergreen + EvergreenContext interface (topicFocus + recentTitles? optional)
  - `promotional.ts`: buildSystemPromptPromotional + buildUserPromptPromotional + PromotionalContext interface (productLink + offer)
  - `index.ts`: buildPrompts(brand, ctx: PromptContext) dispatcher với discriminated union exhaustive check
- M2.2: Refactor generator.ts signature `generateContent(brand, ctx: PromptContext)` thay vì `generateContent(brand, article: NewsArticle)`. Helper `buildSourceMetadata(ctx)` build source_article field theo type
- M2.3: Xoá file cũ `src/lib/content/prompts.ts` (single file), conflict với folder mới
- M2.4: Tạo 4 test scripts:
  - `scripts/_mock-brand.ts`: hardcode brand Ladysfit (DRY cho 3 test)
  - `scripts/test-generator.ts`: overwrite Day 9, dùng PromptContext mới (`{type:'news_based', article}`)
  - `scripts/test-generator-evergreen.ts`: test với topic_focus + recentTitles fixture
  - `scripts/test-generator-promotional.ts`: test với productLink + offer fixture, có check `HAS PRODUCT LINK IN BODY`
- Build PASS, generator 191 LOC, _base 132 LOC (< 200)
- Bug encounter: scripts/test-generator.ts cũ (Day 9) còn signature old `generateContent(brand, article)` → next build fail. Fix bằng overwrite ở M2.4

**M3: Workflow-runner dispatch (~35 phút)**
- M3.1: queries.ts extend `WorkflowConfigForRunner` thành loose superset (tất cả field optional cho 3 type). Thêm `fetchRecentContentTitlesAdmin(workflowId, limit=5)` cho evergreen, silent fail return `[]` nếu DB query fail
- M3.2: workflow-runner.ts refactor:
  - Thêm `SUPPORTED_CONTENT_TYPES` const array + `isSupportedContentType` type guard (pattern DRY)
  - Step 1 validate type-specific config sớm (fail fast trước tốn Claude API call)
  - Gộp step 2 (build-context) + step 3 (generate) → 1 step "build-and-generate" (giảm từ 4 step Day 10 xuống 3 step Day 13)
  - 2 helper extract: `buildPromptContextByType` + `buildSourceFields`
  - source_url cho evergreen = NULL (schema nullable OK), promotional = productLink (dedup key)
- M3.3: Bug TS widening `contentType: 'news_based' | ... → string` sau step.run boundary. Fix bằng re-narrow + isSupportedContentType type guard
- workflow-runner 235 LOC, tsc + build PASS

**M4: Form UI 3 type + Server Action (~45 phút)**
- workflow-form.tsx: thêm 2 watchers `watchedTopicFocus` + `watchedOffer` cho counter realtime. 2 boolean flag `needsTopicFocus` + `needsPromotional`. 3 conditional block render field theo type chọn
- Field evergreen: Textarea 4 rows với counter `{length}/500 ký tự` + placeholder cụ thể Việt
- Field promotional: Input type=url cho productLink + Textarea 4 rows cho offer + counter
- Pattern UX: radio type ở đầu → field thay đổi smooth (giữ pattern Day 8)
- getFieldLabel mở rộng 3 label tiếng Việt mới
- actions.ts: helper `buildWorkflowConfig(data)` build config JSONB theo type (DRY). createWorkflow step 4 dùng helper thay vì inline
- workflow-form 376 LOC, actions 245 LOC, build PASS

**M5.1: Localhost smoke test 3 type qua tsx (~15 phút)**
- 3 test scripts PASS với Claude API thật:
  - news_based: 51s, content "hút mỡ ngộ độc thuốc tê", 3 variant hook differentiation tốt (câu hỏi / kể chuyện / insight số), voice Ladysfit perfect
  - evergreen: 62s, content "tập gym sau sinh giữ sữa", 3 angle khác nhau (lý thuyết steps / chị Lan storytelling / cortisol scientific), KHÔNG lặp recentTitles
  - promotional: 46s, content "khoá học giảm cân 90 ngày", 3 variant đều có product link trong body (verify `HAS PRODUCT LINK IN BODY: YES OK` x 3), CTA mạnh, nhắc đúng giá `2.490.000 VNĐ` + ưu đãi `30%` + deadline `20/05`
- Bug encounter: Node v24 + `--experimental-strip-types` không resolve relative imports không có `.ts` extension. Fix dùng `npx tsx --env-file=.env.local scripts/...` (tsx có sẵn deps `^4.21.0`)

**M5.2: Browser test form 2 type mới + DB verify (~10 phút)**
- Test EVERGREEN qua form: type radio chọn → newsSources biến mất + topicFocus textarea xuất hiện + counter realtime + validation 20 chars min → submit redirect OK → DB workflow id `5926eb93-4387-4cdc-82ad-d62adc79eaab` config `{name, topic_focus}` đúng
- Test PROMOTIONAL: form conditional 2 field (productLink + offer) xuất hiện + URL validation + counter → submit redirect OK → DB workflow id `d4fbdbd7-bdf8-4961-a782-2cce7ad138ee` config `{name, product_link, offer}` đúng
- Workflow Ladysfit cũ `b01973cb-7c76-49ec-adf7-6f980d3b7480` config nguyên vẹn (backward compat verified 100%)
- DB count by type: 1 news_based + 1 evergreen + 1 promotional = 3 workflow

**Commits Day 13 (1 commit theo strategy anh chọn):**
- `<sắp có>` feat(week1-day13): workflow types evergreen + promotional với strategy pattern prompt builders + 3 step dispatch + form UI conditional
- `<sắp có>` docs(handoff): close Day 13 - 3 workflow types complete

### Day 14 (14/05/2026)

**2 commits Day 14 + sắp có HANDOFF commit:**
- `a1863e9` feat(week1-day14-m1): pagination cho contents review voi url searchparams (4 files, 194 ins, 47 del)
- `2b1a626` feat(week1-day14-m2): bulk approve reject cho contents review voi sticky bottom bar (6 files, 301 ins, 58 del)
- `6cc0e19` docs(handoff): close Day 14 - pagination + bulk actions + cron production night 1

### Day 15 (14/05/2026)

**M3: Edit inline body variant (carry-over Day 14 P3) (~75 phút)**

- **M3.1: Types + Schema + Server Action (~25 phút):** Tạo `VariantFields` interface (hook + title + body + hashtags) + `UpdateVariantInput` trong `src/lib/contents/types.ts`. Tạo `updateVariantContentSchema` Zod trong `src/lib/contents/schemas.ts` với 4 field validation ranges (hook 20-500, title 10-200, body 100-2000, hashtags 1-10) + Unicode regex `/^#?[\p{L}\p{N}_]+$/u` hỗ trợ tiếng Việt có dấu. `updateVariantContent()` Server Action 80 LOC trong `src/app/dashboard/contents/actions.ts`: validate input → auth check → defense-in-depth ownership qua `brands!inner.user_id` (Cách 2 fallback Day 14 RULE D14-1) → fetch-merge-update pattern (Supabase JS không expose `jsonb_set` helper) → revalidatePath. tsc PASS.

- **M3.2: UI VariantEditor + parent integration (~35 phút):** NEW file `src/components/contents/variant-editor.tsx` 158 LOC Client Component: 4 input/textarea cho 4 field + counter realtime đổi màu đỏ (font-semibold) khi vượt range + `useTransition` pending state + error inline. Hashtag input string 1 dòng "tag1 tag2" thay vì 10 input riêng (UX Facebook style), parse split `/[\s,]+/` + normalize add `#` prefix. Parent `content-variant-selector.tsx` 184→215 LOC: thêm state `editingVariantIndex: number | null` + `localVariants: ContentVariant[]` (optimistic sync), button "Sửa nội dung" với icon Pencil cạnh "Copy nội dung", disable button khi `editingVariantIndex !== null` (chỉ edit 1 variant cùng lúc), handler `handleVariantSaved` cập nhật localVariants + toast 3000ms.

- **M3.3: Smoke test browser 6 step PASS qua 4 screenshot:** edit mode hiển thị 4 field, counter realtime đổi màu khi vượt limit, validation < 100 chars body báo lỗi đúng, save success + toast "Đã lưu thay đổi", reload persist content mới. DB verify không cần vì UI re-render sau revalidatePath confirm.

- **Build PASS, tsc clean, commit `ce87564`, push GitHub, Vercel deploy READY 44s 0 error/warning/fatal.**

**Discuss Week 2-3 plan goal-first chốt Profile A:**

- **Profile A soft validation:** 3-5 paid, 10 trial, 3 content/user/tuần, 50% retention, launch 09/06/2026
- **Scope 22-30h chia Phase 1 (Week 2) build infrastructure + Phase 2 (Week 3) monetization**
- **Critical path:** Email infra (Day 16-17) + Pricing PayOS (Day 23-24)
- **6 mitigation:** test 3 email trước user thật, log email_failures, end-to-end PayOS test với chính anh, INTERNAL_PAYMENT_FLOW.md, benchmark pricing SaaS VN, phỏng vấn 5 SMB Day 28
- **Stop signal:** Day 22 Phase 1 close + Day 28 soft launch + Day 35 day-before-launch
- **Context mới:** anh có 5-10 khách sẵn, trial 14 ngày → giữ plan cũ email Day 16 (retention critical)

**Commits Day 15:**
- `ce87564` feat(week1-day15-m3): edit inline body variant với VariantEditor + jsonb fetch-merge-update
- `<sắp có>` docs(handoff): close Day 15 - edit inline variant + plan Week 2-3 chốt Profile A

### Day 16 (14/05/2026)

Email infra Phase 1 Week 2 - Welcome email (~5h total nhưng M5 verify chưa hoàn tất):

**M1 Setup Resend account + API key (15 phút):** account fitnessviet@gmail.com (dùng chung với Course Platform), API key acf-production full access all domains

**M2 Install SDK + env vars (15 phút):** npm install resend@6.12.3, RESEND_API_KEY + RESEND_FROM_EMAIL vào .env.local + Vercel env 3 environments. .env.example template mới với 11 env vars + fix .gitignore !.env.example negation rule

**M3 Welcome email template (45 phút):** React Email components v1.0.12, tách _styles.ts (136 LOC) design tokens reusable + welcome.tsx (129 LOC) component. Pattern Day 13 _base.ts strategy

**M3.3 Send helper (15 phút):** src/lib/email/resend.ts singleton (39 LOC) + src/lib/email/send-welcome.ts helper (88 LOC) với discriminated return type + plain text fallback Gmail Promotions tab

**M4 Hook /auth/callback + fix emailRedirectTo (~45 phút):** signup/actions.ts thêm headers().origin emailRedirectTo, auth/callback/route.ts fire-and-forget welcome email với dedup check email_confirmed_at + 60s delta. Behavior matrix verified 5 case

**M5 Smoke test verify DEFER Day 17:**
- Localhost test FAIL PKCE cross-browser (signup incognito + click verify Chrome thường → AuthPKCECodeVerifierMissingError)
- Production test 14:07 VN signup OK nhưng anh CHƯA click verify link → Vercel logs 0 entry /auth/callback → welcome flow chưa có cơ hội fire
- Code đúng 100% (verified bằng logs không có exception nào). Issue là test pattern, không phải code bug

**Commits Day 16:** `fa7f665` docs(env) .env.example + .gitignore fix, `3935dd0` feat(week1-day16) welcome email infra full

**Production deploy:** dpl_Crz7NegFsZ2VZS8MkoySXERGtPne READY 43s, 0 error/warning logs

### Day 17 (14/05/2026)

Daily digest email Phase 1 Week 2 (~2h30, M5 verify Day 16 skip defer Week 2):

**M0 Audit schema + verify deps (~5p):** profiles schema verify KHÔNG có last_digest_sent_at → cần migration. 1 user fitnessviet 1 draft trong 24h test data. Path src/emails/welcome.tsx + _styles.ts xác nhận Day 16.

**M1.1 Migration add_last_digest_sent_at_to_profiles (~5p):** ALTER TABLE add column TIMESTAMPTZ NULL + partial index WHERE NOT NULL (tiết kiệm space, tăng tốc dedup query) + COMMENT. Apply Supabase MCP success.

**M1.2 digest-queries.ts admin client (142 LOC):** fetchUsersForDigest() JOIN profiles + brands + contents, filter status=draft + generated_at > 24h + cooldown 20h JS-side (OR-NULL khó express PostgREST). markDigestSent(userIds) bulk UPDATE silent fail. Pattern Day 11 fetchEnabledWorkflows. tsc PASS.

**M2.1 digest.tsx template (190 LOC):** React Email reuse 14 tokens từ _styles.ts + 5 inline tokens (draftCard border-left brand red, line-clamp-2). formatRelativeTime helper inline phút/giờ/ngày VN. Loop max 5 drafts + "...và X bài khác". PreviewProps 3 sample drafts.

**M2.2 send-digest.ts helper (113 LOC):** Discriminated return type carry userId both branches. Validation guards fast-fail. buildPlainText() Gmail Promotions tab safety. X-Entity-Ref-ID header userId + timestamp traceable Resend dashboard.

**M3.1 Endpoint /api/cron/daily-digest (115 LOC):** POST Bearer auth + GET healthcheck + maxDuration 60s. Promise.allSettled batch (1 fail không block hết). Mark dedup ONLY success user (failed retry next). Pattern Day 11 run-workflows.

**M3.2 Smoke test localhost 4 step PASS:**
- Test 1 GET healthcheck → 200 status:ok
- Test 2 POST no auth → 401 Unauthorized
- Test 3 POST đúng secret → 200 checked:1 sent:1 failed:0 durationMs:1207
- Test 4 POST retry → 200 checked:0 reason:no-eligible-users (dedup 48s elapsed work)

**M3.3 Verify dedup mark + email landed:**
- Supabase verify: profile eb2f895e last_digest_sent_at = 14:54:03 UTC (48s trước)
- Resend dashboard status: Opened (anh mở email rồi → tracking pixel work)
- Gmail Inbox tab (KHÔNG Promotions): brand red header + greeting "Chào Vũ Hải" + draft card border đỏ trái + title "Tập sau sinh mà vẫn đủ sữa cho con" + time "Tạo 14 giờ trước" + CTA "Xem tất cả 1 bài"

**M4.1 Commit + push GitHub:** feat(week1-day17) commit Day 17 M1-M3 push.

**M4.2 Production deploy verify:** Vercel auto-deploy READY + smoke test cross-environment dedup work (production POST → checked:0 do localhost mark trước trong DB chung).

**M4.3 cron-job.org schedule:** Job "ACF Daily Digest" URL /api/cron/daily-digest schedule 0 1 * * * UTC (8h sáng VN) POST Bearer auth. Execute now test PASS.

### Day 18 (14/05/2026)

Bug fix outstanding round 1 + content duplicate constraint (~3h):

**M1 Content duplicate constraint (45p):**

- M1.1 Audit: 1 duplicate group 3 rows VnExpress "gói khám miễn phí" workflow Ladysfit. Tổng 7 contents (6 source_url + 1 evergreen NULL).
- M1.2 Cleanup: DELETE 2 row cũ, giữ row mới nhất `d8725b70`.
- M1.3 Migration `add_unique_workflow_source_url_to_contents`: CREATE UNIQUE INDEX `contents_workflow_source_url_unique` ON contents (workflow_id, source_url) WHERE source_url IS NOT NULL. Partial index excludes evergreen (source_url NULL).
- M1.4 workflow-runner.ts handle 23505 unique_violation: log skip + return success object (KHÔNG throw → Inngest không retry). Pattern Day 11 RULE D11-2 (graceful không loop retry).
- M1.5 Fix `last_run_at` update CẢ khi duplicate: extract update ra ngoài if-else. Tránh cron-job.org retry 5 phút sau loop spam (5-minute dedup window Day 11 M4).

**M2 getBrandPrefix + npm scripts (30p):**

- Bug: "Ladysfit" → "LT" (first + last char) → fix CamelCase detection + lowercase 2-char fallback. 7/7 test PASS.
- Algorithm:
  - Word ≤ 4 chars: toàn bộ uppercase
  - CamelCase boundary (LinkedIn → LI, TikTok → TT)
  - Lowercase dài: 2 chars đầu (Ladysfit → LA, Microsoft → MI)
  - Multi-word: chữ đầu 3 từ đầu (Vietnam Society of Excellence → VSO)
- Empty: `BR` fallback
- Add `typecheck` + `lint` scripts (alias `tsc --noEmit`). ESLint flat config defer Phase 2 (Week 4+).

**M3 saveError banner clear (45p):**

- Bug: Banner persistent cross-step sau navigation. Audit: KHÔNG clear ở onEdit + goBack + goNext.
- Helper `clearSaveError()` refactor 4 touchpoint trong `onboarding-shell.tsx`.
- KHÔNG đụng JSX banner position (giữ ngoài AnimatePresence - design intent).
- Manual test defer Day 19 cùng workflow edit form (anh đã có brand, onboarding flow không dễ test lại).

**M4 Signup error messages tiếng Việt (30p):**

- Audit: signup chỉ map 1 case "already" + 5 strings ASCII không dấu. Login generic single message (đúng vì security anti-enumeration).
- File mới `src/lib/auth/error-messages.ts` (49 LOC): `translateSignupError()` switch error.code 7 cases + fallback message-based 4 cases + default generic.
- 7 Supabase AuthApiError codes mapped: `user_already_exists`, `email_address_invalid`, `weak_password`, `over_email_send_rate_limit`, `signup_disabled`, `email_provider_disabled`, `unexpected_failure`.
- Fix diacritics 14 strings signup + login actions.ts. Login GIỮ generic logic.

**M5 Commit + deploy + verify:**

- Single commit Day 18: `feat(week1-day18)` bug fix outstanding
- Vercel auto-deploy READY (~45s expected)
- Production smoke test: deploy LIVE, partial index verify còn, runtime logs clean

**Commits Day 18:**
- `e2133a9` feat(week1-day18): bug fix outstanding round 1 + content duplicate constraint
- `0256ad2` docs(handoff): close Day 18

### Day 19 (18/05/2026)

**M1: Workflow edit form reuse create form mode=edit (~2h):**
- M1.1: workflowToFormData(workflow) reverse-map helper trong types.ts (config snake_case → WorkflowFormData camelCase, cast type + scheduleCron). updateWorkflow Server Action trong actions.ts: validate workflowFormSchema + defense-in-depth ownership qua brands!inner.user_id + buildWorkflowConfig reuse + UPDATE chỉ 3 cột schedule_cron/enabled/config, KHÔNG đụng type/brand_id/last_run_at. actions.ts 286 LOC.
- M1.2: WorkflowForm thêm props mode/workflowId/initialValues, backward compat create (gọi không props chạy như cũ). defaultValues dùng initialValues ?? DEFAULT. onSubmit dispatch updateWorkflow vs createWorkflow theo mode. Type radio group disabled khi mode=edit + hint text. Submit button text theo mode. workflow-form.tsx 372 LOC.
- M1.3: Route mới src/app/dashboard/workflows/[id]/edit/page.tsx Server Component fetch getWorkflowById + notFound + workflowToFormData + render WorkflowForm mode=edit. Banner amber warning khi workflow.enabled=true. Button Sửa icon Pencil trong workflow-card.tsx link tới edit page.
- M1.4: Smoke test browser 5 case PASS (icon Sửa hiển thị, edit Ladysfit news_based sửa tên, sửa schedule, edit evergreen type-specific field đúng, validation tên trống). DB verify Supabase MCP: config.name + schedule_cron đổi đúng, type giữ nguyên cả 3, last_run_at giữ nguyên không bị NULL.
- Build PASS 5.3s 16 routes (route mới [id]/edit). Commit e67eda0 push GitHub.

**M2: Verify Day 18 fix carry-over (~30p):**
- M2a getBrandPrefix browser verify: tạo user test riêng, onboarding flow. Brand "Ladysfit" → hashtag prefix "LA" (#LA_SanPham, #LA_KhuyenMai). Brand rỗng → "BR" fallback. Day 18 M2 CamelCase fix confirmed work end-to-end production code path (step-7-topics.tsx).
- M2b saveError banner clear: code review Day 18 (clearSaveError 4 touchpoint handleConfirm/onEdit/onBack/onNext) đủ tin cậy. Browser test defer - cần ép saveBrandVoice fail, verify khi user thật onboard.

**Commits Day 19:**
- `e67eda0` feat(week1-day19-m1): workflow edit form reuse create form mode=edit
- `11556bf` docs(handoff): close Day 19 - workflow edit form + brand prefix verify

### Day 20 (18/05/2026)

Polish Phase 1 Week 2 (~2h):

**A-track (UX/copy nhanh):**

- **A3: Hero CTA "Xem cách hoạt động" xoá (commit db2e358):** Hero section có 2 CTA, nút "Xem cách hoạt động" link tới `/#how-it-works` nhưng section đó CHƯA tồn tại trên landing page → click không scroll đi đâu, UX confuse. Xoá hẳn nút thay vì stub link. Quyết định: nếu Phase 2 thêm section how-it-works, sẽ add lại CTA tương ứng.
- **A4: BrandVoiceCard sub-header conditional readonly (commit 2cba186):** Sub-header "Xem lại và confirm" hiển thị TRÊN dashboard readonly view → không hợp ngữ cảnh (user đã confirm rồi, đang xem lại). Wrap conditional `{!readonly && <p>Xem lại và confirm</p>}`. Onboarding flow vẫn hiển thị sub-header (mode confirm), dashboard readonly không hiển thị.

**B-track (UX feedback Day 14-15):**

- **B1: Empty state /dashboard/contents thêm CTA "Tạo workflow đầu tiên" (commit 7ba6751):** Issue Day 12 P2 line 623 + user feedback: empty state hiện 5 thông điệp khác nhau theo filter (all/draft/approved/rejected/generating) nhưng KHÔNG có hành động tiếp theo cho currentStatus='all'. Thêm `<Link href="/dashboard/workflows/new">` button đỏ chỉ hiện khi `currentStatus === 'all'`. Đồng thời sửa copy `all` từ "Chưa có nội dung nào. Workflow sẽ tự generate khi đến lịch." → "Bạn chưa có nội dung nào. Tạo một workflow để hệ thống tự viết content theo lịch." (thuần Việt, action-oriented). Other filter messages giữ nguyên.
- **B2: Mobile tab "Đã từ chối" → "Từ chối" shorten (commit 37d5440):** Issue Day 12 P2 line 621: filter tabs 4 nhãn overflow viewport < 380px. Shorten label thay vì bỏ count badge (badge giữ giá trị UX). `CONTENT_STATUS_LABELS.rejected: 'Đã từ chối' → 'Từ chối'` ở types.ts. Other status label giữ nguyên (draft/approved labels < 6 chars OK).
- **B3: Sticky bulk bar padding-bottom tránh che content cuối (commit 1b572c2):** Issue Day 14 line 639: position fixed bottom-0 bar 60px che content cuối list mobile. Thêm `pb-24` (96px ≈ bar 60px + safety) cho main container `/dashboard/contents/page.tsx` khi `selectedIds.size > 0`. Pattern: padding-bottom conditional theo state (KHÔNG dynamic-height bar, dùng fixed pb đủ safety).

**Day 20 (không commit):**

- **A1: Test M2b saveError 4/4 touchpoint PASS code review:** clearSaveError gọi đúng cả 4 chỗ onboarding-shell.tsx (line 53 handleConfirm + line 119 onEdit + line 143 onBack + line 147 onNext). Banner persistent issue Day 19 M2b CLOSED. Skip browser ép-fail test (cần mock saveBrandVoice throw, tốn 30p, code review đủ tin cậy với 4 touchpoint rõ ràng).
- **A2: Dọn user test +acf1 khỏi DB:** xoá sạch auth.users + cascading profiles row qua Supabase MCP. Phát hiện: bảng `public.profiles` KHÔNG có FK ra `auth.users` (không CASCADE) → phải DELETE từng bảng manually (profiles trước, auth.users sau). Ghi vào Known Issues Day 20 mới.

**Commits Day 20 (5 commit polish):**
- `2cba186` fix(week1-day20-a4): sub-header BrandVoiceCard conditional theo readonly
- `db2e358` fix(week1-day20-a3): bo nut Xem cach hoat dong trong Hero (link section chua ton tai)
- `37d5440` fix(week1-day20-b2): rut gon nhan tab rejected thanh Tu choi cho mobile
- `1b572c2` fix(week1-day20-b3): them padding-bottom tranh sticky bar che content cuoi
- `7ba6751` fix(week1-day20-b1): empty state them nut CTA tao workflow + sua chu thuan Viet

### Day 21 (18/05/2026)

**Đóng milestone Phase 1 Week 2 (~1.5h):**

- Step 0 (đầu phiên): Query Supabase tìm user +acf2 → identify `aotapgym+acf2@gmail.com` id `70b6cce7-15fa-42c5-becb-eec3a2b0f472` brand "Ladysfit" `2a8cd998-bd5f-487d-a81d-9ed97a5d9836`, 0 workflow + 0 content (hoàn cảnh test B1 lý tưởng). Defer cleanup sau khi anh visual verify B1 production.
- Step 1: Update HANDOFF.md - đóng issue Day 18-20 fix + thêm phát hiện FK profiles + Day 20 + Day 21 entries + chuyển state Section 6 sang Phase 2 Week 3.
- Step 2: Commit HANDOFF Day 21 close.
- Step 3: Smoke test hybrid - em chạy `npm run typecheck` + `npm run lint` (alias typecheck) + `npm run build` local PASS. Browser flow (login, workflow create, content review) defer anh tự test khi cần.
- Step 4: Push 6 commit (5 Day 20 + 1 Day 21 HANDOFF) → Vercel auto-deploy.
- Step 5: Verify Vercel deployment READY qua MCP list_deployments.
- Step 6: Anh login production với `aotapgym+acf2@gmail.com` → `/dashboard/contents` → screenshot CTA đỏ "Tạo workflow đầu tiên" hiển thị.
- Step 7: Cleanup user +acf2 qua Supabase MCP: DELETE brands WHERE id='2a8cd998-...' → DELETE profiles WHERE id='70b6cce7-...' → DELETE auth.users WHERE id='70b6cce7-...' (manual cascade vì profiles không có FK).
- Step 8: Final post-deploy verify - Vercel runtime logs production 24h filter error|fatal clean.

**Commits Day 21:**
- `<sắp có>` docs(handoff): close Day 21 - Phase 1 Week 2 milestone DONE + Day 20 polish + FK profiles finding

### Day 22 (19/05/2026)

**Pre-flight Phase 2 Week 3 (~45p):**

- Verify cron đêm 18→19/05 workflow Ladysfit fire OK qua Vercel runtime logs + Supabase contents.
- Verify daily digest 8h sáng VN ngày 19 gửi đúng (Resend dashboard + Gmail inbox).
- Đọc lại plan Phase 2 Profile A đã chốt Day 15 - confirm Pricing 3 tier (Free/Starter/Pro) + trial 7 ngày.
- Audit DB user: phát hiện 5 user, trong đó 4 user test (agency@marfit.vn, huyhaigym, aotapgym brand "Test ACF3", vuhuyhieu.0910). Cleanup qua Supabase MCP cascade brands + workflows + contents + content_logs (auto via FK) + DELETE auth.users (manual). DB còn 1 user thật fitnessviet@gmail.com.

**Commits Day 22:** không commit code, chỉ DB cleanup + plan reading.

### Day 23 (19/05/2026)

**M1 - Pricing UI giá mới (~30p):**
- Cập nhật `src/components/landing/pricing-section.tsx` 3 tier: Free (0đ) / Starter (199.000đ) / Pro (399.000đ).
- Feature matrix theo tier mới: Starter 5 workflow + 90 bài/tháng + digest, Pro 3 brand voice + unlimited + ưu tiên.
- Đổi trial 14 ngày → 7 ngày trên text UI + CTA "Bắt đầu trial 7 ngày".
- Commit `c324b0e` feat(week3-day23-m1).

**M2 - Subscriptions table tạo lại (~20p):**
- Supabase migration: DROP TABLE `subscriptions` cũ (Day 1 schema thiếu cột, lúc đó rỗng), CREATE TABLE mới 10 cột: `id`, `user_id` UNIQUE + FK CASCADE auth.users, `tier`, `status`, `trial_start`, `trial_end`, `current_period_end`, `payos_order_code` bigint, `created_at`, `updated_at`.
- RLS bật, 1 policy SELECT own (`user_id = auth.uid()`). Ghi qua admin client (service_role) trong Server Action + Webhook.
- Migration qua Supabase MCP, KHÔNG commit code (schema-only change).

**M3 - PayOS integration code (~2h):**
- Install `@payos/node` v2.0.5.
- Tạo `src/lib/payos/client.ts` khởi tạo PayOS SDK từ env (PAYOS_CLIENT_ID + PAYOS_API_KEY + PAYOS_CHECKSUM_KEY).
- Tạo `src/lib/payos/constants.ts`: `TRIAL_DAYS = 7`, `TIER_CONFIG` (starter 199K + pro 399K + features), `isPaidTier(tier)` type guard.
- Tạo `src/lib/payos/actions.ts` 2 Server Action: `startTrial(tier)` chỉ ghi subscriptions status=trialing + update profiles.plan, KHÔNG gọi PayOS; `createPaymentLink(tier)` gọi PayOS tạo paymentLink + upsert subscriptions với `payos_order_code = floor(Date.now()/1000)`.
- Tạo `src/components/billing/upgrade-card.tsx` Client Component 2 nút "Bắt đầu dùng thử 7 ngày" / "Thanh toán ngay", `useTransition` + toast inline 3s.
- Commit `ba7d35b` feat(week3-day23-m3).

**Commits Day 23:**
- `c324b0e` feat(week3-day23-m1): cap nhat pricing section gia moi 199k 399k + tinh nang theo tier
- `ba7d35b` feat(week3-day23-m3): tich hop payos - client + startTrial + createPaymentLink + upgrade card

### Day 24 (19/05/2026)

**M4 - Webhook PayOS (~1.5h):**
- Tạo `src/app/api/payos/webhook/route.ts`: verify chữ ký bằng `payos.webhooks.verify()` + check `data.code === '00'` (giao dịch thành công, PayOS gửi webhook cho cả thất bại) + tìm subscription qua `payos_order_code` + cập nhật subscriptions status='active' + `current_period_end` (30 ngày từ hôm nay) + update profiles.plan.
- Edge case xử lý: signature fail trả 401, không tìm thấy subscription trả 200 (tránh PayOS retry vô ích), lỗi DB cần retry trả 500.
- Commit `e7e59ce` feat(week3-day24-m4).

**M5 - Trial banner + cleanup test user (~45p):**
- Tạo `src/lib/payos/queries.ts` `getCurrentUserSubscription()` RLS tự lọc theo user.
- Tạo `src/components/billing/trial-banner.tsx` Server Component, 4 trạng thái: status='active' ẩn / trialing còn ngày màu vàng / trialing hết hạn màu đỏ / chưa có gói màu xám "Dùng thử 7 ngày miễn phí".
- Gắn `<TrialBanner />` vào `src/components/dashboard/dashboard-shell.tsx` trên `{children}`.
- Cleanup user test phát sinh trong khi thử flow Day 23-24 (user đã tạo subscription test). DB lại sạch về 1 user thật.
- Commit `404b47a` feat(week3-day24-m5).

**Commits Day 24:**
- `e7e59ce` feat(week3-day24-m4): webhook payos handler - verify chu ky + kiem code 00 + cap nhat subscription
- `404b47a` feat(week3-day24-m5): trial banner 4 trang thai + cleanup test user

### Day 23-24 Summary (tổng kết post-deploy)

- Day 23-24: Cập nhật trang giá (Free 0đ / Starter 199K / Pro 399K)
- Day 23-24: Tạo bảng `subscriptions` (10 cột, RLS bật, 1 policy SELECT own)
- Day 23-24: Tích hợp PayOS - client, constants, 2 Server Action (`startTrial`, `createPaymentLink`), `UpgradeCard`
- Day 23-24: Webhook PayOS tại `/api/payos/webhook` - verify chữ ký, cập nhật subscriptions + profiles
- Day 23-24: Banner đếm ngược trial (`TrialBanner`, 4 trạng thái)
- Day 23-24: Tách `UpgradeSection` (server) / `UpgradeCard` (client) - ẩn gói đã mua
- Day 23-24: Gắn tên miền `autocontent.online`, DNS + SSL xong
- Day 23-24: Test thanh toán thật 199K thành công, webhook cập nhật DB đúng
- Day 23-24: Rà callback sau khi đổi tên miền - Supabase URL Config, Google OAuth, URL preview trong email

### Polish UI trước public

- Thay metadata mặc định "Create Next App" bằng metadata thật (title, description, openGraph, twitter, metadataBase), đổi `lang` từ `en` sang `vi`
- Sửa token `accent-acf` khớp chính xác màu `#E63946`
- Gom màu landing về token `accent-acf` (6 file, bỏ hết mã cứng `#E63946`)
- Đồng bộ màu trang login/signup từ xanh `blue` sang đỏ thương hiệu `accent-acf`
- Việt hoá thuật ngữ tiếng Anh trong onboarding step 3, 4, 5, 7 (archetype → hình mẫu thương hiệu, pain point → vấn đề khách hàng đang gặp, và các từ khác)
- Ẩn lỗi DB thô khỏi mắt người dùng ở `onboarding/actions.ts`, vẫn giữ log debug

### Polish UI hoàn thiện (5 task, 5 commit)

**Polish #1 - fix(signup): use autocontent.online as fallback origin**
- src/app/(auth)/signup/actions.ts dùng 3 tầng fallback: headersList.get('origin') -> process.env.NEXT_PUBLIC_SITE_URL -> 'https://autocontent.online'
- Bỏ hard-code 'https://auto-content-factory.vercel.app' cũ
- Lý do: email confirm signup gửi link sai domain khi header origin thiếu

**Polish #2 - feat(landing): add 6 public pages**
- Tạo 6 trang static: /terms /privacy /contact /roadmap /blog /docs
- /terms /privacy đầy đủ 7-8 mục cho PayOS + Supabase compliance, luật áp dụng VN, toà án Cần Thơ
- /contact 3 card kênh (support/partner/press) + form Server Action với useActionState, TODO insert Supabase bảng contact_messages
- /roadmap /blog /docs dạng "Coming soon" có chất, CTA về /contact
- Header inline mỗi page (không tạo shared component, giữ scope nhỏ)
- Bỏ link /docs/api khỏi footer (chưa có nội dung)

**Polish #3 - refactor(landing): centralize bonus offer constants**
- Tạo OFFER_CONFIG block trong bonus-guarantee-section.tsx với 5 field: LIMITED_SLOTS, BONUS_DEADLINE, REFUND_GUARANTEE_DAYS, TOTAL_BONUS_VALUE, PRO_FIRST_MONTH_PRICE
- Thay hard-code 100, 14, 5.5 triệu, 999K, 30/06/2026, "tháng này" mơ hồ bằng reference vào OFFER_CONFIG
- Đổi promo bonus sau này = 1 chỗ sửa, không lệch nhau

**Polish #4 - feat(branding): add static favicon + OG image**
- src/app/icon.tsx dùng ImageResponse, 32x32, chữ "A" trắng bold trên nền đỏ accent-acf #E63946 bo tròn 6px
- src/app/opengraph-image.tsx dùng ImageResponse, 1200x630, layout 3 section (logo lockup + headline + URL chip)
- KHÔNG dùng runtime='edge' vì static asset không phụ thuộc request, static prerender lúc build cho cache CDN vĩnh viễn
- Next.js 16 tự pick up 2 file này, không cần touch layout.tsx

**Polish #5 - fix(a11y): bump onboarding edit button to 44px tap target**
- src/components/onboarding/brand-voice-card.tsx EditButton component đổi className từ "rounded p-1 ..." sang "-m-2 inline-flex h-11 w-11 items-center justify-center rounded ..."
- Tap target 44x44px chuẩn WCAG 2.5.5 + Apple HIG
- Icon Pencil giữ nguyên h-3.5 w-3.5 (14px), visual không đổi
- Trick: negative margin -m-2 bù lại không phá layout SectionHeader

### Day 25 (21/05/2026)

Email nhắc sắp hết trial - Phase 2 Week 4:

**Migration `day25_add_trial_reminder_dedup_columns`:**
- ALTER TABLE `subscriptions` thêm 2 cột `reminder_d3_sent_at` + `reminder_d1_sent_at` (TIMESTAMPTZ nullable)
- Thêm 2 partial index btree trên `trial_end` WHERE `sent_at IS NULL AND status='trialing'` (phục vụ cron query d3 + d1)
- Apply qua Supabase MCP success

**5 file code mới (commit `13f4001`):**
- `src/app/api/cron/trial-reminders/route.ts` - POST endpoint (Bearer auth) + GET healthcheck. Quét subscriptions trong window, gửi email d3/d1, mark dedup
- `src/emails/trial-ending-3-days.tsx` - React Email template nhắc còn 3 ngày trial
- `src/emails/trial-ending-1-day.tsx` - React Email template nhắc còn 1 ngày trial
- `src/lib/email/send-trial-reminder.ts` - send helper với discriminated return type
- `src/lib/payos/trial-queries.ts` - `getTrialUsersForReminder()` + `markTrialReminderSent()`

**Window logic:** d3 = `[now+2.5d, now+3.5d]`, d1 = `[now+0.5d, now+1.5d]` (window 24h)

**Resend domain verified:** `autocontent.online` verify xong qua Hostinger DNS auto-sync. Vercel env `RESEND_FROM_EMAIL` sync `Auto-Content Factory <noreply@autocontent.online>` cho All Environments

**cron-job.org job "ACF Trial Reminders Daily":** POST `https://autocontent.online/api/cron/trial-reminders`, schedule `0 2 * * *` UTC (9h sáng VN), Authorization Bearer CRON_SECRET, notify on failure ON

**Verify:**
- Smoke test local PASS: checked=2, sent=2, failed=0, dedup verified
- Code push origin/main, Vercel auto-deploy READY
- Production smoke test PASS: 200 OK, response `{"status":"ok","checked":0,"sent":0,"failed":0,"reason":"no-eligible-users","durationMs":826}`

**Commit Day 25:**
- `13f4001` feat(week4-day25): email trial reminder - cron endpoint + 2 templates + dedup columns
- `<sắp có>` docs(handoff): close Day 25 - email trial reminder infra

### Day 26 additions (22/05/2026)

**M1: FK CASCADE profiles → auth.users (~10 phút)**
- Audit FK toàn DB: 6/7 FK đã có ON DELETE CASCADE đúng. THIẾU 1 FK: `profiles.id → auth.users.id` (orphan nguy hiểm khi xoá user trong auth.users)
- Migration `day26_fk_profiles_auth_users_and_brand_drift_trigger` apply qua Supabase MCP:
  - `ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_auth_users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE`
- Cascade chain hoàn chỉnh: auth.users → profiles → brands → workflows → contents
- Verify SQL: constraint tồn tại với `delete_rule = CASCADE`
- Finding #2 từ Day 25 ĐÓNG

**M2: Trigger chống brand_id drift (~20 phút)**
- Vấn đề: `contents.brand_id` denormalized từ `workflows.brand_id` qua `workflow_id`. Có thể drift nếu UPDATE sai
- Function `enforce_contents_brand_consistency()` BEFORE INSERT OR UPDATE OF brand_id, workflow_id ON contents:
  - Đọc `workflows.brand_id` qua `NEW.workflow_id`
  - Nếu NEW.brand_id NULL → tự fill bằng workflows.brand_id
  - Nếu NEW.brand_id != workflows.brand_id → raise exception
- Migration thứ 2 `day26_fix_function_search_path_brand_consistency`: lock `SET search_path = public, pg_catalog` để fix Supabase advisor warning function_search_path_mutable
- Test 3 case PASS trong DO block:
  - Case 1: brand_id NULL auto-fill từ workflow.brand_id
  - Case 2: brand_id đúng → UPDATE pass
  - Case 3: brand_id sai → raise exception "phải khớp"
- Verify advisor sau migration: 0 warning mới (3 warning pre-existing không liên quan)
- Nhóm 2 #1 ĐÓNG

**M3: Bỏ Drizzle ORM hoàn toàn (~45 phút)**
- Phát hiện qua search Cursor: ZERO query Drizzle thực tế (`db.select/insert/update/delete`). Chỉ 4 file import type-only (`BrandVoiceGuide`, `Workflow`). App query 100% qua Supabase client.
- Phát hiện drift Drizzle schema vs DB thật >10 chỗ: subscriptions thiếu `tier/trial_start/trial_end/reminder_*`, contents thiếu `variants/selected_variant_index`, profiles thiếu `last_digest_sent_at`, type mismatch `payos_order_code` (varchar vs bigint)
- Quyết định: BỎ HẲN thay vì introspect (vì ZERO query runtime)
- Tạo `src/lib/db/types.ts`: 6 interface plain (Profile, Brand, Workflow, Content, ContentLog, Subscription) + interface BrandVoiceGuide khớp DB hiện tại Day 26
- Refactor 4 file import: `@/lib/db/schema` → `@/lib/db/types` ở `src/lib/brands/queries.ts`, `src/lib/brands/converters.ts`, `src/lib/workflows/types.ts`, `src/lib/onboarding/types.ts`
- Fix phụ: Type `Workflow` đổi `lastRunAt/createdAt` từ `Date` sang `string` (Supabase trả string ISO) → sửa 2 chỗ `workflows/queries.ts` (bỏ `new Date()`) + `workflow-card.tsx:146` (wrap `new Date(workflow.lastRunAt)` cho helper local)
- Xoá 2 file: `src/lib/db/schema.ts`, `src/lib/db/index.ts`
- Xoá `drizzle.config.ts` + folder `drizzle/` (5 file migration .sql + meta)
- Uninstall: `drizzle-orm`, `drizzle-kit`, `postgres` (3 package)
- Xoá 3 script `db:generate/db:push/db:studio` khỏi package.json
- Verify: `npm run typecheck` PASS, `npm run build` PASS, 17 file changed (158 insertions, 2442 deletions)
- Commit `94d7c8a` refactor(week4-day26): bo Drizzle hoan toan
- Bug critical Day 22-24 #2 ĐÓNG

**M4: Fix Turbopack Server Action chết âm thầm (~30 phút)**
- Vấn đề Day 22-24: `UpgradeCard` 2 button "Bắt đầu dùng thử" + "Thanh toán ngay" không fire Server Action với `npm run dev` (Turbopack), phải dùng `npx next dev --webpack`
- Root cause: Pattern `useTransition + onClick={() => actionAsync()}` không stable với Turbopack module HMR
- Fix: chuyển sang Next.js 16 recommended pattern `<form action> + useActionState`:
  - 2 button bọc trong 2 `<form action={formAction}>` riêng, mỗi form có `<input type="hidden" name="tier">` + `<button type="submit">`
  - `useActionState` cho cả 2 action: `trialState/trialFormAction/isTrialPending` + `payState/payFormAction/isPayPending`
  - 2 wrapper module-scope `startTrialActionWrapper(prevState, FormData)` + `createPaymentLinkWrapper(prevState, FormData)` đọc tier từ FormData rồi gọi Server Action gốc
  - 2 useEffect xử lý kết quả: trial → toast, pay → `window.location.href` redirect (hoặc toast lỗi)
  - Disable logic: cả 2 button `disabled={isTrialPending || isPayPending}`, text pending check `tier === plan.tier`
  - Xoá: `useTransition`, `handleStartTrial`, `handlePay`, state `pendingTier`
  - Giữ: 'use client', import từ '@/lib/payos/actions', toast state + auto-clear 3s, plan filter, toàn bộ markup
- Verify: `npm run typecheck` PASS, `npm run build` PASS, 1 file sửa `src/components/billing/upgrade-card.tsx`
- Pattern này stable cả Turbopack lẫn webpack (Next.js 16 recommended), progressive enhancement bonus (JS disabled vẫn work)
- Bug critical Day 22-24 #1 ĐÓNG

**Findings cuối Day 26:**
1. Cascade chain hoàn chỉnh: xoá 1 user trong auth.users → tự động xoá profiles → brands → workflows → contents (5 bảng)
2. Brand drift defense: 3 layer chống drift contents.brand_id (FK cascade, trigger auto-fill khi NULL, trigger raise exception khi mismatch)
3. Drizzle drift đã giải quyết tận gốc bằng cách BỎ thay vì INTROSPECT - đơn giản hoá stack, giảm 1 source of truth phải sync với DB
4. Form action pattern là Next.js 16 RECOMMENDED cho Server Action - mọi component Server Action mới NÊN dùng pattern này thay vì useTransition + onClick
5. Drop list 10 mục (xem Section 8): Git history hero Day 5, shadcn CLI Node v24, Vercel Cron timezone, DEP0169 url.parse (4 drop hẳn) + Cloudflare R2, backup cron GitHub Actions, pagination jump, VariantEditor discard warning, delete workflow cascade test, Claude API synthesize brand voice onboarding, signup_disabled flow (6+1 defer sau launch)

### Day 27 (21/05/2026)

Polish landing trước soft launch (~3 giờ, 4 commit, deploy production READY):

**Task 1: Sticky nav + Hero CTA2 + Footer fix (commit `94062a5`):**
- File mới `src/components/landing/landing-nav.tsx` (142 LOC Client Component): sticky top-0 z-50, transition bg khi scroll > 20px (bg-white/80 backdrop-blur-md + border-bottom), logo "ACF" mobile / "Auto-Content Factory" desktop, 4 anchor links (Tính năng/Bảng giá/Bonus/FAQ), CTA Đăng nhập outline + Bắt đầu Free đỏ, mobile menu slide-down (`@keyframes slideDown` thêm globals.css)
- `src/app/page.tsx`: mount LandingNav đầu trang, anchor `id="features|pricing|bonus"` đặt qua div wrapper (không đụng pricing-section.tsx + bonus-guarantee-section.tsx như constraint), scroll-mt-20 cho offset nav
- `src/components/landing/hero-section.tsx`: thêm CTA secondary "Xem bài viết mẫu ↓" border-2 border-gray-900 hover invert, href="#samples", min-h-12 tap target chuẩn
- `src/components/landing/footer.tsx`: ẨN hẳn icon Facebook (placeholder link bỏ) với comment TODO replace fanpage thật
- `globals.css`: thêm `html { scroll-behavior: smooth }`

**Task 2: Trust + Samples sections (commit `103746c`):**
- File mới `src/components/landing/trust-section.tsx` (87 LOC Server Component): eyebrow "AI ĐỨNG SAU" + H2 "Sản phẩm không phải code Tây bỏ đi" + sub, grid 2 cột founder (avatar tròn 80px gradient + chữ VH placeholder + tên + chức + body) / 3 proof card (100+/2/8/10 font-mono đỏ)
- File mới `src/components/landing/samples-section.tsx` (130 LOC Server Component): `id="samples"` scroll-mt-20 đặt thẳng trên section element (tránh duplicate ID), eyebrow "BẰNG CHỨNG GIỌNG VĂN" + H2 + sub, 3 sample card (Ladysfit pink "Bụng dưới sau sinh" / VSE blue "Toyota 22 năm kaizen" / Cafe Hạt Mộc Châu amber "Khách order cà phê đen đá"), mỗi card có badge + brand + voice tag + divider + title + hook italic + body line-clamp-5 + hashtag Việt có dấu, flex flex-col h-full đồng cao
- Đặt vị trí: Hero → Trust → Pain → Consequence → Samples → Pricing → Bonus → FinalCta
- Pattern mới phát hiện (RULE D27-1): text trong JSX dùng nháy thẳng được khi đặt trong const array string literal → bypass eslint react/no-unescaped-entities vì rule chỉ áp text node JSX trực tiếp

**Task 3: Padding chuẩn hoá + H2 scale anchor pattern (commit `9aeebf5`):**
- Padding section: `py-16 md:py-24` cho Trust + Samples + Bonus (Bonus trước đó py-20 md:py-32 quá rộng đột biến)
- H2 Pain + Consequence: bỏ `lg:text-5xl`, còn `text-3xl md:text-4xl` (content section)
- H2 Pricing + Bonus + Final CTA: GIỮ `lg:text-5xl` (anchor section quyết định mua)
- Phân cấp visual: content vs anchor, Krug rule "section quan trọng phải có visual weight khác"
- 4 finding DEFER (Cursor phát hiện, chưa fix Task 3):
  1. Token màu xám không nhất quán: section gốc `text-slate-900` vs Trust/Samples `text-gray-900`
  2. `leading-[1.25]` + `wordBreak: keep-all` chỉ có section gốc, Trust/Samples không có
  3. Background `bg-slate-*` vs `bg-gray-*` khác hue nhẹ
  4. Eyebrow pattern khác: section gốc `Badge variant="outline"` vs Trust/Samples `<p>` text uppercase

**Task 4: Merge + Deploy (commit `38fb399` merge to main):**
- Merge --no-ff để giữ history 4 commit gom 1 merge commit
- Push origin main, Vercel auto-deploy READY `38fb399` confirmed qua Vercel MCP list_deployments
- Production verify qua Vercel web_fetch_vercel_url https://autocontent.online: 200 OK, x-vercel-cache PRERENDER, brotli encoding, lang="vi", tất cả 3 task render đúng trên production HTML

**Tổng kết Day 27:** 10 files changed, +368/-33 lines, 4 commit, 3 giờ làm. Production LIVE với landing improvements: Sticky nav (Krug navigation), Hero secondary CTA (giảm friction), Trust section sau Hero (Spool trust gate), 3 sample bài Việt trước Pricing (bằng chứng giọng văn), padding đồng đều, phân cấp H2 anchor vs content. Sẵn sàng soft launch Day 28-29.

## 4. Architecture Decisions

| Decision | Lý do |
|---|---|
| Next.js 16.2.6 App Router + Turbopack | Default stack, SSR/SSG, Vercel native |
| Supabase Auth + Postgres + Drizzle ORM | Free tier OK 100 user đầu, type-safe |
| RLS 6/6 bảng với subquery pattern | MVP < 1000 user không cần optimize |
| Tailwind v4 + @theme inline | Next.js 16 default, syntax mới khác v3 |
| shadcn/ui MANUAL PASTE (không qua CLI) | shadcn CLI v4.7.0 fail với Node v24 (@babel/parser bug) |
| 14 shadcn components base only | KISS, không thêm component chưa dùng |
| Server Components cho TẤT CẢ landing sections | Static prerender → SEO + speed |
| Content first (BRIDGE) trước design | Không thiết kế xong rồi nhồi chữ |
| Multi-step form Typeform style cho onboarding | Conversion rate +15-25% vs single page (Day 6) |
| localStorage primary + 1 final DB save | 0 network call giữa steps → UX mượt mobile (Day 6) |
| Rule-based archetype mapping (không Claude API ở Day 6) | Speed > polish MVP, Claude API defer Week 2 |
| 6 archetype thay vì 12 Jung gốc | Rút gọn cho SMB Việt Nam, avoid paralysis (Day 6) |
| 1 brand per user trong MVP | Đơn giản hoá validation + UX, multi-brand defer Week 4 |
| Force redirect onboarding nếu chưa có brand | Core flow của ACF, không có voice = không generate content |
| Server + Client composition cho Radix Portal + Server Action | Day 7 M3 phát hiện: <form action> trong DropdownMenu Portal gây hydration mismatch + form canceled |
| Supabase client cho DB queries thay vì Drizzle | Day 7 M4 fail "password authentication" (DATABASE_URL chưa setup) + Drizzle bypass RLS. Rollback Supabase client (Day 2-6 pattern) - RLS-aware |
| Type Brand/Content inline snake_case (manual sync DB schema) | Drizzle dùng camelCase nhưng Supabase client trả snake_case → conflict. Inline type snake_case match exact DB |
| Workflow name lưu trong config JSONB thay vì migration thêm column | Day 8 M1: tránh migration giữa milestone, JSONB đã nullable sẵn, đủ flexibility cho future fields |
| 5 schedule cron preset thay vì cron string raw input | Day 8 M1: SMB Việt Nam 30-50 tuổi không biết cron syntax. Preset 5 option đủ 80% use case |
| Optimistic UI update cho toggle thay vì block UI đợi server response | Day 8 M4: UX mượt mobile, perceived latency 0 |
| **Hybrid RSS + Readability cho news fetching (Day 9) → DEPRECATED Day 11** | Day 9 hợp lý localhost, Day 10-11 fail production ERR_REQUIRE_ESM. Day 11 M2 thay bằng RSS description-only |
| 3 hook patterns trong system prompt (question/story/stat) | Variants tự nhiên distinct (Day 9) |
| Tone bucket low/mid/high cho Claude prompt | Map 0-10 scale thành bucket dễ hiểu cho LLM (Day 9) |
| Schema variants JSONB column thay vì TEXT serialize | Day 9: 3 variants per content, future user select variant updates selected_variant_index |
| Inngest background job pattern (Day 10) | Vercel Hobby timeout 10s không support 60s Claude generate. Free tier 50k step/tháng đủ MVP |
| 4 step.run trong Inngest function thay vì 1 step monolith | Cached kết quả mỗi step thành công → retry chỉ step fail (không gọi lại Claude tốn $) + debug dashboard log từng step |
| Admin client (service_role) trong Inngest function | Inngest function chạy environment riêng, KHÔNG có user session cookie → RLS fail. Pattern: filter manual bằng userId từ event payload, JOIN brands cho ownership verify |
| Lazy dynamic import jsdom + readability (Day 10) → REMOVED Day 11 | Day 10 fix temporary ERR_REQUIRE_ESM, Day 11 bỏ jsdom hoàn toàn vì transitive ESM dep vẫn crash |
| maxDuration 60s cho /api/inngest route (Day 10) | Inngest function chia 4 step, mỗi step = 1 webhook call. Vercel Hobby max 60s/function-call |
| **RSS description-only thay vì Readability full article (Day 11 M2)** | VnExpress RSS description 200 chars đủ context cho Claude (Who/What/Where/When). Bỏ jsdom 5MB + 41 transitive deps. Trade-off content ngắn hơn nhưng Claude generate quality vẫn cao (M3 verified). Tránh cuộc chiến ESM/CJS dài hạn với Vercel bundler |
| **External cron service (cron-job.org) thay vì Vercel Cron (Day 11 M4)** | Vercel Hobby plan: cron jobs chỉ chạy 1 lần/ngày (limitation chính thức từ docs 27/02/2026). ACF cần granular schedule (7h sáng, 8h tối, 2 lần/ngày) → Vercel Cron không đủ. Pro upgrade $20/tháng tốn khi chưa có doanh thu. cron-job.org free forever, mỗi 5 phút trigger, có dashboard + history. Endpoint /api/cron/run-workflows tự match cron expression với current UTC time |
| **5-minute window match + 5-minute dedup (Day 11 M4)** | cron-job.org trigger endpoint mỗi 5 phút, endpoint dùng CronExpressionParser.prev() match cửa sổ [now - 5min, now]. Dedup 5-minute via last_run_at update sau inngest.send() success tránh trigger 2 lần nếu cron-job.org spike. Trade-off: workflow cron `0 7 * * *` có thể trigger trong khoảng 7:00-7:05 UTC, không phải exact 7:00:00 |
| **Tabs UI cho variant selector thay vì 3 card xếp dọc (Day 11 M5)** | 3 variants có hook/title/body/hashtags structure giống nhau, xem song song không cần thiết. Tabs giúp focus + screen real estate efficient mobile. Pattern Modern Indie SaaS Day 8 |
| **Optimistic UI cho select variant + revert on fail (Day 11 M5)** | UX mượt, perceived latency 0. Pattern Day 8 workflow toggle - đã verified production |
| **Schedule preset cron UTC + display label VN (Day 12 P1)** | Industry standard (Postgres pg_cron, AWS EventBridge, GitHub Actions đều lưu UTC). Cron-parser tự nhiên parse UTC. Display layer convert UTC ↔ VN isolated dễ test. Migration đơn giản 1 workflow Ladysfit |
| **DRY pattern z.enum(ARRAY.map())  thay vì literal union hardcode 2 chỗ (Day 12 P1)** | Lần đầu update timezone phát hiện literal union ScheduleCronValue (types.ts) và SCHEDULE_CRON_VALUES (schemas.ts) hardcode riêng → update 1 file mismatch type. Pattern DRY: schema derive từ constants array via map() + cast tuple type. Single source of truth |
| **Content status varchar không CHECK constraint, enforce ở app layer (Day 12 P2 M1)** | Supabase MCP verify schema phát hiện status là varchar default 'generating'. KHÔNG migration ALTER TABLE giữa milestone (tránh schema drift risk). App layer enforce qua const CONTENT_STATUS_VALUES + ContentStatus literal union + Zod z.enum tuple cast. Pattern DRY single source of truth (RULE D12-4). Defer migration ADD CHECK constraint Week 2 nếu cần cứng schema |
| **revalidatePath('/dashboard', 'layout') sau update status (Day 12 P2 M3.2)** | Sidebar badge render từ dashboard-shell.tsx ở /dashboard/layout.tsx, KHÔNG phải /dashboard/contents page. revalidatePath path-only invalidate page level, KHÔNG re-render layout level. Pattern Next.js 15+: revalidatePath(path, 'layout') để invalidate cả layout cấp dashboard. Fix preemptive trước khi test (badge stale nếu thiếu) |
| **Filter tabs URL searchParams thay vì client-side state (Day 12 P2 M4)** | URL searchParams = bookmarkable + shareable + back/forward navigation work + SEO-friendly. Pattern Next.js 16: searchParams là Promise async, await trước khi đọc. Validate qua CONTENT_STATUS_VALUES.includes(), invalid status fallback "Tất cả" UX không crash. Aggregate counts client-side bằng reduce (Supabase JS chưa hỗ trợ GROUP BY native) |
| **Strategy pattern cho prompt builders (Day 13 M2)** | 3 type có input khác nhau (NewsArticle vs EvergreenContext vs PromotionalContext) và hook pattern khác. Tách file riêng `prompts/news-based.ts` + `prompts/evergreen.ts` + `prompts/promotional.ts` + `_base.ts` shared context + `index.ts` dispatcher với discriminated union. Mỗi file < 100 LOC, test isolation tốt, mở rộng thêm type Phase 2 dễ |
| **Discriminated union PromptContext (Day 13 M2)** | generator.ts signature mới `generateContent(brand, ctx: PromptContext)` với ctx union 3 nhánh. TypeScript exhaustive check trong dispatcher buildPrompts switch. Replace signature cũ `generateContent(brand, article: NewsArticle)` hardcode 1 input type |
| **Workflow-runner gộp 4 step → 3 step (Day 13 M3)** | Step 2 "fetch-news" + Step 3 "generate-content" gộp thành 1 step "build-and-generate". Lý do: tránh widening literal union qua step.run boundary (Inngest JsonifyObject), giảm 1 webhook Vercel call, vẫn dưới 60s limit. Trade-off: nếu fail giữa "build context" và "generate", Inngest retry cả 2 phase (acceptable vì Claude generate idempotent) |
| **Type-specific config validation 2 layer (Day 13 M3+M4)** | Layer 1 (form): Zod superRefine validate ở client (counter realtime) + Server Action safeParse (defense in depth). Layer 2 (workflow-runner): re-validate config sớm ở Step 1 (fail fast trước tốn Claude API). Pattern: trust nothing crossing trust boundaries |
| **CONTENTS_PAGE_SIZE = 20 const trong types.ts thay vì hardcode rải rác (Day 14 M1)** | Pattern DRY RULE D12-4: single source of truth. Lần sau đổi page size chỉ đụng 1 chỗ, schema + UI tự reflect. SaaS chuẩn 20/page balance giữa scroll mobile và load time |
| **Pagination redirect-on-overflow thay vì empty state (Day 14 M1)** | Khi `?page=999` overflow + totalCount > 0 → server-side redirect về `/dashboard/contents[?status=...]` thay vì render empty state confusing. Defensive UX, user không thấy trang trắng |
| **Defense-in-depth ownership 2 round-trip cho bulk action (Day 14 M2)** | Supabase JS KHÔNG support filter join trong UPDATE statement. Fallback Cách 2: select brands!inner(user_id) derive owned subset → update only validIds. 2 round-trip nhưng đảm bảo user KHÔNG update được content của user khác dù RLS bypass. Defense in depth trên top RLS |
| **Reset selection khi đổi statusFilter (Day 14 M2)** | useEffect listen prop change, clear Set<string>. Tránh confusion: user tick contents tab "Chờ duyệt", switch sang "Đã duyệt", các ID chọn ở tab cũ KHÔNG còn trong list hiện tại nhưng vẫn đang trong state → bulk action sẽ apply lên ghost IDs. Reset cleaner UX |
| **Fetch-merge-update pattern cho jsonb partial update (Day 15 M3.1)** | Supabase JS KHÔNG expose jsonb_set helper. RPC function migration phức tạp. Fetch current variants → merge JS object → update full array là an toàn hơn (validate variantIndex tồn tại trước update) + 1 atomic UPDATE (PG MVCC). Trade-off 2 round-trip nhưng acceptable cho admin edit không phải hot path |
| **VariantEditor tách component riêng < 200 LOC (Day 15 M3.2)** | Parent content-variant-selector.tsx sắp vượt 200 LOC limit. Tách VariantEditor 158 LOC reusable nếu sau này có "Edit Brand Voice" UI dùng pattern tương tự, test isolation tốt, single responsibility |
| **Hashtag input string "tag1 tag2" thay vì 10 input riêng (Day 15 M3.2)** | UX SMB Việt Nam dễ dùng pattern Facebook hashtag input hơn. Parse split by space/comma flexible. Unicode regex `/^#?[\p{L}\p{N}_]+$/u` hỗ trợ tiếng Việt có dấu (#TậpSauSinh #SứcKhỏe) |
| Resend free tier sender onboarding@resend.dev defer verify domain (Day 16 M1) | Free tier 100 email/day đủ Profile A 10 trial user. Verify domain autocontent.online tốn DNS + Cloudflare R2 setup. Defer Week 4 nếu inbox rate < 50% sau 1 tuần production |
| React Email v3 ecosystem migration (Day 16 M3.1) | @react-email/components v1.0.12 có 19 sub-package deprecated warning. Maintainer migrate sang monorepo unified react-email. Deprecated ≠ broken, render OK. Defer fix Week 3 nếu bug runtime |
| Tách _styles.ts design tokens cho email (Day 16 M3.2) | 5+ email kế tiếp (welcome, daily digest, trial countdown, payment confirm) sẽ reuse design tokens. Tách = đổi brand color 1 chỗ apply tất cả. Pattern Day 13 _base.ts strategy |
| Dedup welcome email qua email_confirmed_at + 60s delta (Day 16 M4) | Option B fast ship thay vì migration DB welcome_email_sent_at. 99% accuracy cho MVP, 1% edge case (slow email > 60s) acceptable. Defer migration nếu Week 3 có > 2 user complain |
| 20h cooldown window thay vì 24h cứng (Day 17 M1.2) | Cron-job.org có thể spike trigger sớm 5 phút. Cooldown 20h tránh user trùng nhận 2 email cùng ngày khi cron schedule 1 AM UTC daily. Trade-off: nếu cron miss 1 ngày, ngày sau vẫn gửi (acceptable vì draft content quan trọng) |
| Filter cooldown JS-side thay vì PostgREST OR-NULL (Day 17 M1.2) | Supabase JS filter `.or('last_digest_sent_at.is.null,last_digest_sent_at.lt.timestamp')` cú pháp phức tạp + dễ sai. JS filter sau khi fetch sạch hơn 50 user max (defense limit) → memory acceptable |
| Promise.allSettled batch thay vì Promise.all (Day 17 M3.1) | 1 user Resend fail KHÔNG block 49 user còn lại. Day 16 send-welcome fire-and-forget pattern không scale cho batch. allSettled return tất cả results, caller aggregate success/fail metrics |
| Mark dedup ONLY user success (Day 17 M3.1) | Defense in depth: failed user retry next run (Resend transient error, network blip). User success skip 20h. Tách 2 trạng thái tránh user fail mãi không nhận lại email |
| UNIQUE INDEX partial WHERE source_url IS NOT NULL (Day 18 M1.3) | Evergreen workflows source_url=NULL nên KHÔNG enforce uniqueness (1 workflow có thể tạo nhiều content evergreen cùng topic). Partial index chỉ enforce với rows có source_url thật. Postgres pattern an toàn cho mix nullable column |
| Handle 23505 graceful KHÔNG throw (Day 18 M1.4) | Inngest retry default 3 lần khi throw. Duplicate là "expected failure mode" không phải bug → return success object với skipped=true tránh retry tốn Claude API call. Inngest mark step complete, không re-invoke generate |
| last_run_at update both insert + duplicate branch (Day 18 M1.5) | 5-minute dedup window Day 11 M4 dùng last_run_at. Nếu duplicate KHÔNG update, cron-job.org retry 5 phút sau sẽ bypass dedup → loop spam. Skip = "workflow đã chạy", không phải fail |
| CamelCase detection thay vì first+last char (Day 18 M2) | "Ladysfit" → "LT" (Day 6 logic) không predictable. CamelCase boundary detection (LinkedIn → LI) + lowercase 2-char fallback (Ladysfit → LA) deterministic + dễ đoán. Trade-off: KHÔNG ra "LF" cho Ladysfit, accept defer brand prefix custom field Week 4+ |
| npm script lint = alias typecheck cho MVP (Day 18 M2) | Next.js 16 deprecated `next lint`. ESLint flat config setup tốn 30-45p + có thể conflict Next.js internal lint. Quick win: lint chạy `tsc --noEmit` (catch type error + JSX indirect). Full ESLint setup defer Phase 2 |
| Signup map code-based + Login giữ generic (Day 18 M4) | Signup UX: user cần actionable error ("email đã đăng ký" → đăng nhập). Login UX: KHÔNG được leak email exists vs password wrong (security enumeration attack). Pattern khác nhau theo use case |
| **Tách `startTrial` và `createPaymentLink` thành 2 Server Action riêng (Day 23 M3)** | Mô hình trial 7 ngày miễn phí trước → user click "Bắt đầu dùng thử" KHÔNG gọi PayOS, chỉ ghi subscriptions status='trialing'. Khi user click "Thanh toán ngay" mới gọi PayOS tạo payment link. Tách 2 action rõ trách nhiệm: trial = local DB only, pay = external API. Test isolation tốt, lỗi PayOS không ảnh hưởng trial flow |
| **profiles.plan giữ bản tóm tắt, subscriptions giữ chi tiết (Day 23 M3 + Day 24 M4)** | `profiles.plan` (varchar) đọc nhanh ở mọi nơi (sidebar, dashboard, RLS) không cần JOIN. `subscriptions` lưu chi tiết status / trial_start / trial_end / current_period_end / payos_order_code. Webhook và Server Action cập nhật CẢ 2 cùng lúc để tránh drift. Trade-off duplicate field nhưng đọc nhanh + đơn giản hoá query khắp app |
| **`payos_order_code = floor(Date.now()/1000)` (Day 23 M3)** | PayOS yêu cầu orderCode là số (number, không phải string). `Date.now()/1000` cho ra số giây Unix - vừa là number, vừa monotonic tăng dần, vừa không trùng (1 user không thể click 2 lần trong < 1 giây thực tế). Lưu bigint để future-proof năm 2038+ |
| **Webhook trả 200 khi không tìm thấy subscription, trả 500 chỉ khi lỗi DB cần retry (Day 24 M4)** | PayOS retry webhook 3 lần nếu nhận non-2xx. Trường hợp `payos_order_code` không tìm thấy trong DB (subscription bị xóa, hoặc test ngoài flow) → retry vô ích, log warning và trả 200 để PayOS dừng. Lỗi DB transient (insert/update fail) trả 500 để PayOS retry. Phân biệt "không có gì để làm" (200) vs "lỗi tạm thời" (500) |
| **Webhook chỉ nâng cấp khi `data.code === '00'` (Day 24 M4)** | PayOS gửi webhook cho CẢ giao dịch thất bại (timeout, hủy, sai OTP). Code '00' nghĩa là thành công, code khác là fail/cancel. Check sớm tránh nâng cấp nhầm subscription thành active khi user chưa trả tiền. Pattern same as Stripe `event.type === 'payment_intent.succeeded'` |
| **Giá Free 0đ / Starter 199.000đ / Pro 399.000đ + trial 7 ngày mở khoá toàn bộ Pro (Day 23-24)** | Chốt 3 tier giá VND theo soft validation Phase 1. Trial 7 ngày (rút từ 14 ngày Day 22) đủ để SMB cảm nhận giá trị nhưng không kéo dài lưỡng lự. Trial mở khoá toàn bộ tính năng Pro để user trải nghiệm cao nhất → conversion tốt hơn restrict feature. |
| **PayOS không có sandbox, test bằng tiền thật. `orderCode = floor(Date.now()/1000)` (Day 23-24)** | PayOS không cung cấp môi trường sandbox/test mode. Verify webhook end-to-end phải dùng tiền thật (anh test 199K thành công Day 24). `orderCode` phải là number (PayOS yêu cầu), `Date.now()/1000` cho số giây Unix monotonic + không trùng + bigint future-proof 2038+. |
| **Tên miền chính `autocontent.online`, Vercel domain `auto-content-factory.vercel.app` giữ làm alias (Day 24)** | Domain riêng cần thiết cho branding + email deliverability (Resend verify domain Phase 2) + tránh phụ thuộc Vercel subdomain. Giữ Vercel domain làm alias để preview URL trong email vẫn hoạt động + backup link cũ trong test data không 404. Sau đổi domain phải rà 3 callback: Supabase URL Config (Auth Redirect URLs), Google OAuth Authorized redirect URIs, URL trong email templates. |
| **Màu thương hiệu dùng 1 nguồn duy nhất: token `accent-acf` trong `globals.css` (Polish UI)** | Không dùng mã màu cứng trong component. Đổi màu chỉ sửa 1 chỗ, tự reflect mọi nơi (landing, login/signup, dashboard). Tránh drift giữa các file khi rebrand hoặc tinh chỉnh hue. |
| **Static asset (favicon, OG image, sitemap) KHÔNG dùng `runtime='edge'` (Polish #4)** | Edge chỉ dùng khi content phụ thuộc request (user data, geolocation, A/B test). Static asset prerender lúc build cho cache CDN vĩnh viễn, không tốn invocation crawler quét. |
| **Promo offer values (LIMITED_SLOTS, BONUS_DEADLINE, prices) gom trong OFFER_CONFIG block tại đầu component (Polish #3)** | KHÔNG hard-code rải rác trong JSX. Đổi promo = 1 chỗ. |
| **Tap target tối thiểu trên tất cả interactive element = 44x44px (WCAG 2.5.5 + Apple HIG) (Polish #5)** | Icon nhỏ vẫn giữ visual nhỏ, mở rộng tap area bằng padding/h-w + negative margin. |
| **Server Action với form: dùng `action={fn}` prop trên form element, KHÔNG dùng onSubmit (Polish #2)** | Client component dùng useActionState từ react để handle pending/error state. |
| **AD-25.1: Cron schedule qua cron-job.org, KHÔNG dùng Vercel Cron (Day 25)** | Vercel Hobby plan giới hạn cron 1 lần/ngày. cron-job.org free unlimited, đã dùng sẵn cho "ACF Workflow Runner" từ Day 11. Trial reminder cần chạy đúng 9h sáng VN daily → dùng cron-job.org job thứ 2 "ACF Trial Reminders Daily" `0 2 * * *` UTC. Nhất quán với pattern cron hiện có. |
| **AD-25.2: Window 24h cho trial reminder - d3 = [now+2.5d, now+3.5d], d1 = [now+0.5d, now+1.5d] (Day 25)** | Window rộng 24h là tradeoff: đủ rộng để không miss user khi cron chạy lệch giờ hoặc DB query chậm, đủ hẹp để không gửi nhắc quá sớm/quá muộn lệch ý nghĩa "còn 3 ngày" / "còn 1 ngày". Dedup column đảm bảo mỗi user nhận tối đa 1 email mỗi mốc dù window overlap nhiều ngày chạy. |
| **AD-25.3: Dedup dùng 2 cột timestamp + partial index thay vì bảng riêng (Day 25)** | 2 cột `reminder_d3_sent_at` + `reminder_d1_sent_at` ngay trên `subscriptions` - cron query không cần JOIN bảng dedup riêng, đơn giản hơn. Partial index btree trên `trial_end` WHERE `sent_at IS NULL AND status='trialing'` giữ index nhỏ + query nhanh. Pattern giống Day 17 `last_digest_sent_at` trên profiles. |
| **AD-25.4: Email sender từ `noreply@autocontent.online` - domain verified (Day 25)** | Domain `autocontent.online` đã verify ở Resend qua Hostinger DNS auto-sync (thoát Resend free sender `onboarding@resend.dev`). Sender domain riêng tăng deliverability + branding. Vercel env `RESEND_FROM_EMAIL` sync All Environments. Đóng issue "Resend chưa verify domain" defer từ Day 16. |

## 5. Known Issues

### Issues Day 5-10 (vẫn outstanding)
- Git history thừa 1 commit hero Day 5 - không critical
- shadcn CLI fail Node v24 - manual paste workaround vẫn dùng
- Lucide-react brand icons removed - inline SVG Facebook trong footer
- Supabase maintenance scheduled 13-14/05/2026
- PayOS chưa setup (Week 4)
- Resend chưa verify domain (Week 3)
- Cloudflare R2 bucket acf-assets chưa tạo (Week 2-3)
- contents.brand_id denormalized có nguy cơ drift - cần CHECK constraint
- ~~CTA "Xem cách hoạt động" trong Hero link tới /#how-it-works - chưa có section đó~~ ✅ Fixed Day 20 A3 (xoá hẳn nút, defer re-add nếu Phase 2 build section how-it-works)
- ~~getBrandPrefix logic sai "Ladysfit" → `LT_` thay vì `LF_`. Fix Week 2.~~ ✅ Fixed Day 18 M2 (CamelCase detection, "Ladysfit" → "LA" - trade-off accept)
- ~~saveError banner persistent trong onboarding sau khi user edit thành công~~ ✅ Fixed Day 18 M3 (clearSaveError helper 4 touchpoint - manual visual test defer Day 19)
- ~~`npm run lint` script missing trong package.json~~ ✅ Fixed Day 18 M2 (alias `tsc --noEmit`, ESLint flat config defer Phase 2)
- Claude API chưa integrate cho synthesize brand voice trong onboarding (Day 6 dùng rule-based)
- ~~Signup error message quá generic~~ ✅ Fixed Day 18 M4 (translateSignupError 7 codes tiếng Việt)
- ~~Sub-header BrandVoiceCard "Xem lại và confirm" không hợp dashboard readonly~~ ✅ Fixed Day 20 A4 (conditional `{!readonly && ...}`, onboarding flow vẫn hiển thị)
- Drizzle client chưa setup DATABASE_URL env
- ~~Workflow card không có button "Sửa workflow" (edit name/sources/schedule)~~ ✅ Fixed Day 19 M1 (button Sửa icon Pencil + route [id]/edit, type locked)
- Vercel Cron handler workflow timezone bug (workflow `0 7 * * *` UTC = 14h VN time, không phải 7h sáng VN)
- Workflow type 'evergreen' và 'promotional' chưa có content config Day 9 logic
- Delete workflow cascade contents chưa test với data thật
- 220 LOC actions.ts workflow vượt 200 LOC limit
- Workflow create form chưa validate URL là RSS feed (RULE D9-5)
- signature_move column truncated giữa câu Day 6 (maxLength HTML attribute)
- No batch generation Day 9 (chỉ fetch + generate FIRST article per run)
- Deprecation warning DEP0169 url.parse() từ transitive dep

### Issues Day 11 (mới phát sinh)

- **Vercel Hobby cron 1 lần/ngày only:** Vercel Cron không phù hợp ACF schedule granular. External cron (cron-job.org) là workaround Day 11 M4. Pros: free, mỗi phút trigger được. Cons: phụ thuộc third-party uptime. Backup plan Week 2: setup secondary cron GitHub Actions free reliable.
- **Inngest function chỉ scan workflow type='news_based':** Day 9 logic generate content chỉ work với news_based. Workflow type='evergreen' và 'promotional' tạo được nhưng KHÔNG generate. Sau khi cron-job.org trigger evergreen workflow, Inngest function sẽ skip silently. Fix Week 2 cùng prompt template per type.
- **Contents duplicate khi workflow chạy lại cùng source:** Image dashboard Day 11 M5 hiển thị 2 cards cùng title "Người dân sắp nhận gói khám miễn phí" với time khác nhau (test multiple lần). Schema KHÔNG có unique constraint (workflow_id, source_url). Fix Week 2: add unique index hoặc check trước insert.
- **PowerShell `Invoke-WebRequest` ErrorDetails.Message KHÔNG capture body 4xx/5xx:** Cần dùng pattern `$_.Exception.Response.GetResponseStream() + StreamReader` để đọc raw body. Day 11 M4.2 đã debug, RULE D11-3 ghi pattern.
- **Cron-job.org dependency:** ACF hiện phụ thuộc cron-job.org để trigger workflows. Nếu cron-job.org down hoặc miss event, workflow tự động ngừng. Backup plan: Setup cron job thứ 2 ở GitHub Actions (free, reliable) làm secondary trigger Week 2.
- **No content review UI status actions:** Day 11 M5 chỉ select variant + copy clipboard. Status chỉ display, KHÔNG action được (chưa có button "Duyệt"/"Từ chối"/"Đăng Facebook"). Defer Week 2-3.
- **No /dashboard/contents pagination:** Hiện limit 50 contents trong query. Khi user có > 50 content sẽ miss. Fix Week 3 cùng filter/search.
- **content-variant-selector.tsx 117 LOC** + page list 90 LOC + page detail 84 LOC - đều dưới 200 LOC limit, OK Day 11.
- **No edit variant body inline:** User chỉ chọn variant nào tốt nhất, KHÔNG sửa được text. Defer Week 2-3 cùng "Edit Brand Voice" UI.
- **deprecation warning DEP0169 url.parse() vẫn còn:** Có thể từ transitive dep rss-parser hoặc cron-parser. Defer fix khi deps update.

### Issues Day 12 (mới phát sinh)

- **.env.local backup files dirty workspace:** Có 2 file `.env.local.backup` + `.env.local.backup-20260513-210731` trong working dir do debug saga. Đã được .gitignore cover (`.env*`) nhưng nên cleanup manual sau khi xác nhận production stable. Lệnh: `Remove-Item .env.local.backup*`

### Issues Day 12 P2 (mới phát sinh)

- ~~**Mobile tab "Đã từ chối" overflow cắt chữ:** Filter tabs 4 nhãn quá dài trên viewport < 380px~~ ✅ Fixed Day 20 B2 (shorten "Đã từ chối"→"Từ chối" trong CONTENT_STATUS_LABELS, giữ count badge)
- **Filter tab transition animation thiếu:** Active border đổi instant khi click, không có sliding animation. UX acceptable nhưng có thể polish Week 3
- ~~**Empty state messages dynamic theo filter, nhưng KHÔNG có CTA "tạo workflow":** User vào tab "Chờ duyệt" rỗng chỉ thấy "Không có content nào chờ duyệt. 🎉" - thiếu hành động đi tiếp~~ ✅ Fixed Day 20 B1 (CTA "Tạo workflow đầu tiên" chỉ hiện currentStatus='all', + thuần Việt copy)
- **No bulk approve/reject:** User phải click từng content. Khi DB có >50 contents Week 4 sẽ cần bulk action. Defer Week 3
- **No content edit inline:** User chỉ approve/reject nguyên text, KHÔNG sửa được body variant. Defer Week 2-3 cùng "Edit Brand Voice" UI

### Issues Day 13 (mới phát sinh)

- **scripts/ folder KHÔNG track git** (.gitignore cover): Test scripts là dev tooling local. Không block production deploy. Documentation chỉ trong HANDOFF.
- **Node v24 + `--experimental-strip-types` KHÔNG resolve imports không có `.ts` extension:** Phải dùng `npx tsx scripts/...` (tsx đã có sẵn deps `^4.21.0`). RULE D13-1 ghi pattern.
- **2 workflow test Day 13 (evergreen `5926eb93-...` + promotional `d4fbdbd7-...`) vẫn enabled:** Sau test M5.2, 2 workflow này enabled với schedule. Anh có thể disable/delete trong dashboard nếu không muốn auto-run.
- **Evergreen recentTitles fetch top 5 cố định:** Hard-code limit 5. Nếu workflow chạy > 5 lần, prompt chỉ tránh lặp 5 title gần nhất. Defer Week 2: cho user config "tránh lặp N title cuối" hoặc "vĩnh viễn không lặp".
- **Promotional KHÔNG có image asset:** Hiện chỉ generate text. Image generation defer Week 3-4 cùng Cloudflare R2.
- **source_url evergreen lưu NULL → dedup theo source_url không work cho evergreen:** workflow evergreen có thể tạo content trùng topic_focus nếu chạy nhiều lần cùng ngày. Defer Week 2 cùng "unique constraint workflow_id + content_hash" hoặc enforce schedule không quá 1 lần/ngày.

### Issues Day 14 (mới phát sinh)

- **Bulk action không có "Chọn tất cả TẤT CẢ trang" (chỉ chọn trang hiện tại):** Hiện checkbox master chỉ tick contents trong page 20 hiện tại. Khi user có > 20 contents và muốn approve all draft, phải click qua từng page. Defer Week 2 khi có data nhiều: thêm option "Chọn tất cả 100 contents trong filter này" với background job
- ~~**Sticky bottom bar che content cuối list trên mobile:** Position fixed bottom-0, content cuối có thể bị bar 60px che~~ ✅ Fixed Day 20 B3 (pb-24 conditional khi selectedIds.size > 0)
- **Bulk reject KHÔNG có confirmation dialog:** User click "Từ chối" 7 contents là apply ngay, không có "Bạn có chắc?". OK cho draft (vì có thể revert) nhưng risky khi user có > 50 contents. Defer Week 2 khi có data nhiều: thêm AlertDialog cho bulk reject > 5 items
- **Pagination KHÔNG có jump-to-page input:** Chỉ Prev/Next, không có "Trang [_] / 10" để nhảy nhanh. OK Day 14 (DB chỉ có 7 content), defer Week 3 khi có > 100 contents
- **content-list-item.tsx checkbox click area nhỏ:** Mobile tap target < 44x44px. Defer accessibility audit Week 3
- **No keyboard shortcut bulk action:** Ctrl+A select all, Esc clear selection, Cmd+Enter approve - chưa có. Defer Week 4 khi có power users

### Issues Day 15 (mới phát sinh)

- **VariantEditor parse hashtags split by space/comma KHÔNG handle hashtag chứa khoảng trắng:** Hashtag `#Tap Sau Sinh` sẽ bị split thành 3 hashtag `#Tap` + `Sau` + `Sinh`. Defer Week 3 nếu user complain. Hiện tại pattern Facebook là 1 hashtag = 1 word, KHÔNG có space → OK MVP
- **Optimistic UI KHÔNG có retry khi network fail:** Nếu Server Action throw network error, toast hiển thị "Lưu thất bại, vui lòng thử lại" và state localVariants không revert. User phải Click "Sửa nội dung" lại từ đầu. Defer Week 3 thêm retry button + auto-revert
- **KHÔNG có "Discard changes" warning khi user click "Huỷ" sau khi edit nhiều:** User edit 10 phút, click Huỷ nhầm → mất hết. Defer Week 2 thêm AlertDialog confirm

### Issues Day 16 (mới phát sinh)

- **M5 verify chưa hoàn tất production:** code deploy READY nhưng chưa có user nào click verify email link trên production → Vercel logs 0 entry /auth/callback → welcome flow chưa được test end-to-end thật. Defer Day 17 verify với 1 Gmail account khác + click verify trên production (5-10 phút verify).
- **PKCE cross-browser flow fail localhost dev test:** signup incognito + click verify ở Chrome thường (default browser) → AuthPKCECodeVerifierMissingError. Code KHÔNG bug, đây là Supabase Auth design (PKCE code verifier lưu trong browser session cookie). Pattern fix dev test: đóng Chrome thường trước khi click verify hoặc set Edge thành default browser. Production user thật sẽ KHÔNG gặp issue này.
- **Supabase Auth Redirect URLs thiếu wildcard preview:** hiện có 2 URL allowlist (http://localhost:3000/** + https://auto-content-factory.vercel.app/**), THIẾU https://*-vuhuyhais-projects.vercel.app/auth/callback cho Vercel preview deployments. Defer Week 3 bug fix outstanding nếu cần test preview environments.
- **Resend dashboard chỉ có 1 account fitnessviet:** anh đăng nhập Resend bằng Gmail fitnessviet (cùng account Course Platform). API key acf-production gắn vào account này. Tất cả email Day 16 đi qua account này. KHÔNG cần fix.
- **deprecation warnings @react-email/* sub-packages 19 entries:** ecosystem migration sang react-email monorepo unified. Deprecated ≠ broken. Defer Week 3.

### Issues Day 17 (mới phát sinh)

- **Test data chỉ 1 user 1 draft:** Production cron 8h sáng VN ngày 15/05 chỉ gửi 1 email anh nếu có draft mới. Cần seed test data Day 18 hoặc đợi cron đêm chạy tạo content thật.
- **Cooldown 20h fix cứng KHÔNG configurable per user:** SMB Việt Nam có thể muốn nhận digest 2 lần/ngày (sáng + tối). Defer Phase 2 settings page.
- **KHÔNG có unsubscribe link thật:** Footer "Quản lý thông báo" placeholder href="#" defer Week 4.
- **Resend free tier 100 email/day:** Profile A 10 trial user × 1 email/ngày = 10 email/day OK. Nếu Week 3 lên 20+ user cần upgrade Resend $20/tháng.

### Issues Day 18 (mới phát sinh)

- **getBrandPrefix "Ladysfit" → "LA" KHÔNG "LF":** Trade-off chấp nhận. Defer Week 4+ thêm field "Brand prefix custom" trong onboarding nếu user complain.
- **M3 saveError manual test defer Day 19:** Tin tưởng code review + tsc/build PASS. Verify visual khi test workflow edit form Day 19.
- **ESLint flat config chưa setup:** `npm run lint` hiện alias `tsc --noEmit`. JSX-specific rules (`react/no-unescaped-entities`, `react-hooks/exhaustive-deps`) defer Phase 2 setup riêng.
- **Signup error mapping chỉ 7 code Supabase:** Có code khác hiếm gặp (vd CAPTCHA fail, hCaptcha disabled) chưa map. Default fallback "Không thể tạo tài khoản lúc này" catch-all OK MVP.

### Issues Day 19 (mới phát sinh)

- ~~**M2b saveError manual browser test defer:** cần ép saveBrandVoice fail~~ ✅ Closed Day 20 A1 (code review 4/4 touchpoint PASS line 53/119/143/147 onboarding-shell.tsx, skip browser ép-fail vì code review đủ tin cậy)
- **User test onboarding (...+acftest@gmail.com) còn sót trên DB + onboarding dở dang:** Cleanup khi tiện qua Supabase MCP nếu cần dọn workspace.
- **3 file vượt 200 LOC limit:** actions.ts 286, workflow-form.tsx 372, workflow-card.tsx 280. Refactor tách defer Phase 2.

### Day 21 verification - kết quả thực thi (18/05/2026)

Phiên Day 21 close milestone đã chạy verify thực tế, kết quả:
- Smoke test full PASS: npm run typecheck zero error, npm run build PASS 17 route (route /dashboard/workflows/[id]/edit Day 19 build OK), RLS 6/6 bảng, unique index Day 18 contents_workflow_source_url_unique còn nguyên.
- Phát hiện HANDOFF ghi sai cấu trúc FK → sửa 3 chỗ (commit c30b5ab). Chi tiết FK đúng xem mục Issues Day 20-21 bên dưới.
- Production deploy: commit c30b5ab READY, serve traffic. Code Day 19-21 thực tế đã LIVE từ sáng 18/05 (deployment 4f57d91 READY 03:59 UTC).
- Verify B1 production (commit 7ba6751): trang /dashboard/contents empty state hiển thị đúng câu mới "Bạn chưa có nội dung nào. Tạo một workflow để hệ thống tự viết content theo lịch." + nút CTA đỏ "Tạo workflow đầu tiên" href đúng /dashboard/workflows/new.
- Verify B2 production (commit 37d5440): tab filter "Từ chối" hiển thị đúng nhãn rút gọn (không còn "Đã từ chối").
- Runtime logs production 24h (commit c30b5ab): sạch, 0 error/fatal.
- Cleanup user test +acf3 (aotapgym+acf3@gmail.com): user này đã onboarding hoàn tất có brand. DELETE FROM profiles cascade xóa luôn brand, DELETE FROM auth.users xóa user. Verify count brands = 0 → CHUỖI CASCADE PHASE 5.5 ĐÃ CHẠY THẬT, không chỉ đọc trên schema. DB sạch 0 user test +acf*.
- PHASE 1 WEEK 2 MILESTONE: verify đầy đủ, đóng chính thức.

### Issues Day 20-21 (mới phát sinh)

- **public.profiles KHÔNG có FK ra auth.users (mắt xích FK bị đứt 1 chỗ):** Phát hiện Day 20, query xác minh đầy đủ Day 21. Thực tế: cây CASCADE từ profiles xuống hoạt động ĐẦY ĐỦ - brands.user_id, workflows.brand_id, contents.workflow_id, contents.brand_id, content_logs.brand_id, subscriptions.user_id tất cả đều ON DELETE CASCADE. Xóa 1 row profiles tự dọn sạch brands + workflows + contents + content_logs + subscriptions. Mắt xích đứt DUY NHẤT: profiles.id không có FK ra auth.users.id. Hệ quả: xóa user đúng cách chỉ cần 2 lệnh - (1) DELETE FROM profiles WHERE id='<uid>' tự cascade hết phần dưới, (2) DELETE FROM auth.users WHERE id='<uid>' riêng. Rủi ro nếu làm sai thứ tự: xóa auth.users trước mà quên profiles để lại profile mồ côi; xóa profiles mà quên auth.users thì user còn login được nhưng app lỗi thiếu profile. Defer Phase 2: thêm FK profiles.id REFERENCES auth.users(id) ON DELETE CASCADE để liền mạch toàn chuỗi.
- **User test +acf2 cần dọn sau khi verify B1 production:** `aotapgym+acf2@gmail.com` id `70b6cce7-15fa-42c5-becb-eec3a2b0f472` brand "Ladysfit" `2a8cd998-bd5f-487d-a81d-9ed97a5d9836`. 0 workflow + 0 content nên cleanup nhanh. Day 21 step 7 thực hiện qua Supabase MCP.
- **Day 19-20 commit (7 commit) chưa verify đầy đủ trên production:** Day 19 (e67eda0 + 11556bf) đã push + Vercel build, Day 20 (5 commit) chưa push tại thời điểm Day 21 START. Dồn về Day 21 step 4-5 push + verify deployment 1 lần.

### Issues Day 22-24 (mới phát sinh)

- **Turbopack dev bị lỗi nội bộ với Server Action:** Nút bấm Server Action (UpgradeCard `handleStartTrial` / `handlePay`) chết âm thầm khi chạy `npm run dev` (Turbopack default Next.js 16). Click không có request POST, không lỗi console, không lỗi network. `npm run build` production PASS hoàn toàn + `npx next dev --webpack` chạy đúng. Workaround hiện tại: dùng `npx next dev --webpack` cho dev local. Cần điều tra/xử lý dứt điểm Day 26 - có thể là bug Turbopack 16.2.6 với Server Action import từ file `'use server'` trong client component, hoặc cần upgrade Next.js minor.
- **Drizzle `src/db/schema.ts` có thể còn khai báo bảng `subscriptions` cũ:** Day 23 M2 đã DROP + tạo lại bảng qua Supabase migration trực tiếp, chưa cập nhật Drizzle schema. Dự án hiện KHÔNG dùng Drizzle query (đã chốt Supabase client từ Day 7 RULE D7-6), nên không crash runtime. Đồng bộ schema.ts về đúng DB thật ở Day 26.
- **M4 webhook chưa test end-to-end thật:** Code webhook handler đầy đủ (verify chữ ký + check code='00' + cập nhật DB) nhưng chỉ test được sau khi deploy production + đăng ký URL với PayOS + thanh toán thật bằng tiền nhỏ. PayOS webhook KHÔNG fire vào localhost. Defer test sau deploy.

### Issues Day 25 (mới phát sinh — 5 finding cho Day 26)

1. **Time drift risk - window 24h hẹp:** Window reminder 24h (d3 = `[now+2.5d, now+3.5d]`, d1 = `[now+0.5d, now+1.5d]`) phụ thuộc thời điểm cron chạy. Nếu cron-job.org delay > 30 phút hoặc DB query chậm, user có thể rớt khỏi window và KHÔNG bao giờ nhận email. Day 26 cân nhắc đổi sang one-way gate `trial_end <= NOW() + 3d AND reminder_d3_sent_at IS NULL` - idempotent, không phụ thuộc thời điểm chạy, miss 1 ngày thì ngày sau vẫn gửi.
2. **CASCADE DELETE missing - FK profiles → auth.users:** FK `profiles.id → auth.users.id` KHÔNG có `ON DELETE CASCADE`. Khi DELETE `auth.users` phải xóa profile riêng (xem chi tiết Issues Day 20-21). Day 26 thêm migration `ON DELETE CASCADE` để liền mạch toàn chuỗi xóa user.
3. **Email sync gap - profiles.email vs auth.users.email:** `profiles.email` KHÔNG tự sync với `auth.users.email` khi user đổi email. Cron trial reminder query lấy email từ `profiles` → có thể outdated, gửi nhắc về email cũ. Day 26: hoặc thêm trigger sync `auth.users.email → profiles.email`, hoặc JOIN `auth.users` mỗi lần query để lấy email mới nhất.
4. **Drizzle schema drift:** Bảng `subscriptions` tạo + sửa qua Supabase MCP direct (Day 23 M2 + Day 25 migration). Drizzle migrations `0000_gifted_unus.sql` + `0001_curious_silver_surfer.sql` lệch xa DB thật. Day 26 cần introspect schema từ DB → generate baseline migration, hoặc switch hẳn sang Supabase migrations (bỏ Drizzle migration). Dự án hiện KHÔNG dùng Drizzle query (Supabase client từ Day 7 RULE D7-6) nên không crash runtime.
5. **Index duplication note (không phải bug):** Có 2 index cũ `idx_subscriptions_reminder_*_sent_at` (btree `sent_at` WHERE `IS NOT NULL`) tồn tại trước migration Day 25. 2 index mới `idx_subscriptions_reminder_*_null` phục vụ cron query (WHERE `sent_at IS NULL`). Giữ cả 4, KHÔNG drop - 2 index serve 2 hướng query khác nhau.

### Day 27 finding - cần unify landing design tokens

6 finding gom lại, đề xuất xử lý trong 1 task duy nhất Day 28 "Unify landing design tokens" (~45 phút):

1. **Token màu xám slate vs gray inconsistent:** section gốc dùng `text-slate-900`, 2 section mới Trust/Samples dùng `text-gray-900`. Cùng hệ xám nhưng khác scale Tailwind.
2. **`leading-[1.25]` + `wordBreak: keep-all` thiếu ở Trust/Samples:** chỉ có ở H2 section gốc, ảnh hưởng cách ngắt dòng tiếng Việt.
3. **Background `bg-slate-50` vs `bg-gray-50` khác hue nhẹ:** section gốc dùng slate, Trust/Samples dùng gray.
4. **Eyebrow pattern khác:** section gốc dùng `<Badge variant="outline">`, Trust/Samples dùng `<p>` text uppercase.
5. **Trust section `max-w-6xl` hơi rộng** (Claude phát hiện khi xem ảnh full page): founder + 3 proof card cách xa nhau, cân nhắc thu hẹp container.
6. **Sample card "trôi" về 1 phía** (Claude phát hiện khi xem ảnh full page): grid 3 card chưa căn đều thị giác, cần xem lại alignment.

### Issue nhỏ tồn (cho milestone sau)

- ~~Footer Facebook icon link đang trỏ "https://facebook.com" placeholder~~ ✅ Day 27 Task 1: ẩn hẳn icon Facebook + comment TODO. Hiện lại khi có fanpage chính thức.
- Scarcity warning trong bonus-guarantee-section.tsx dòng 99 vẫn còn "người đăng ký Pro trong tháng này" - cụm "tháng này" mơ hồ. Có thể đổi thành "trong giai đoạn ưu đãi" nếu thấy cần.
- contact/actions.ts hiện log + return success kể cả khi Supabase insert fail. Khi tạo bảng contact_messages, bỏ try/catch ép success, để user thấy lỗi thật.
- Onboarding emoji trong SectionHeader (Khách hàng/Giọng nói/Tone/Điều khác biệt/Chủ đề/Bài mẫu) đang là string Unicode raw (đã bị PowerShell render lệch). Nên migrate sang Lucide icon hoặc Emoji component thống nhất với phần còn lại của UI.
- 6 trang public mới mỗi trang có header inline ~10 dòng trùng lặp. Refactor thành shared `<PublicHeader />` component khi có time.

### D5 Gotchas (vẫn áp dụng)
- D5-6: Vercel Framework Preset có thể bị set "Other" - check Settings → Build and Deployment
- D5-7: Đừng dùng `vercel link` với "Pull env now: YES" khi Vercel chưa có env
- D5-8: Phải add env vào Vercel cho cả 3 environments (Production + Preview + Development)

## 6. Next Steps

### Roadmap đến soft launch

- ~~**Day 25:** Email nhắc sắp hết trial~~ ✅ DONE 21/05/2026 (cron `/api/cron/trial-reminders`, 2 template d3/d1, dedup 2 cột, commit `13f4001`)
- **Day 26:** Address 4 finding từ Day 25 + roadmap task:
  - **(Ưu tiên 1)** Finding #1 - đổi window 24h sang one-way gate idempotent `trial_end <= NOW() + Nd AND reminder_*_sent_at IS NULL` (tránh time drift miss user)
  - **(Ưu tiên 2)** Finding #2 - migration FK `profiles.id → auth.users.id ON DELETE CASCADE` (liền mạch chuỗi xóa user)
  - Finding #3 - sync `profiles.email` ↔ `auth.users.email` (trigger hoặc JOIN auth.users trong cron query)
  - Finding #4 - đồng bộ Drizzle schema với DB thật (introspect + baseline migration, hoặc switch sang Supabase migrations)
  - Điều tra Turbopack dev chết Server Action (xem Issues Day 22-24), enforcement hạn mức theo tier (Free 1 workflow / Starter 5 workflow / Pro unlimited)
- ~~**Day 27:** Polish landing page~~ ✅ DONE 21/05/2026 (sticky nav + Hero CTA2 + Trust section + 3 sample bài Việt + padding/H2 chuẩn hoá, 4 commit, merge `38fb399`, production READY)
- **Day 28-29:** Soft launch (target **09/06/2026**) + **Unify landing design tokens** (~45p, gom 6 finding Day 27 - xem Section 5) - phỏng vấn 5 SMB confirm pricing, invite 5-10 khách trial 7 ngày, monitor Vercel + Resend dashboard, daily HANDOFF update conversion metric
- **Sau soft launch (nếu có time):** FAQ section (nav `#faq` hiện trỏ section chưa tồn tại) + bảng so sánh ACF vs Freelancer/Agency/ChatGPT

**Target launch:** 09/06/2026 (Profile A 3-5 paid + 10 trial + 50% retention)

### Outstanding issues Phase 2 (defer từ Phase 1)

- `contents.brand_id` denormalized check constraint
- Drizzle client DATABASE_URL setup (hoặc bỏ Drizzle nếu Supabase client đủ)
- Multi-source batch generation news_based (3 RSS × 3 articles = 9 candidates per run)
- 3 file > 200 LOC refactor: actions.ts 286, workflow-form.tsx 372, workflow-card.tsx 280
- FK `profiles.id REFERENCES auth.users(id) ON DELETE CASCADE` + audit brands/workflows/contents FK
- BrandVoiceCard refactor base/wrapper pattern
- "Edit Brand Voice" button trên dashboard
- Resend domain verify (autocontent.online) - thoát Resend free tier 100/day
- Cloudflare R2 bucket acf-assets cho image asset (promotional workflows)
- Backup cron GitHub Actions (secondary trigger nếu cron-job.org down)
- contents pagination jump-to-page input
- Bulk reject confirmation dialog AlertDialog
- VariantEditor "Discard changes" warning khi click Huỷ
- ESLint flat config setup (hiện npm run lint alias typecheck)

### Week 4: Launch
- Domain autocontent.online connect Vercel
- Sentry monitoring full setup
- Multi-brand support (relax MVP rule "1 brand per user")
- Post-launch retention analysis

## 7. Context cho AI

**Ngày cuối session:** 21/05/2026 - Day 27 DONE - polish landing live
**Milestone hiện tại:** Phase 2 Week 4 Day 27 completed (Polish landing: sticky nav + Trust section + 3 sample bài Việt + padding/H2 chuẩn hoá, production READY). Tiếp theo Day 28-29 soft launch + unify landing design tokens.

### Stack
- Frontend: Next.js 16.2.6 App Router, TypeScript, Tailwind v4, shadcn/ui (14 components manual)
- Forms: react-hook-form 7.75 + zod 4.4 + @hookform/resolvers 5.2 + framer-motion 12.38
- Backend: Next.js Server Actions + API routes
- DB: Supabase Postgres + Drizzle ORM (RLS 6/6 bảng)
- Auth: Supabase Auth (email/password + Google OAuth)
- AI: Claude API Sonnet 4.6 với brand voice prompt
- Background jobs: Inngest 4.4.0 (free tier 50k step/tháng)
- News: rss-parser 3.13.0 (RSS description-only, KHÔNG dùng jsdom/readability sau Day 11 M2)
- Cron: cron-job.org external service + cron-parser 5
- Email: Resend (LIVE - domain autocontent.online verified Day 25, sender noreply@autocontent.online)
- Payment: PayOS (LIVE - tích hợp đầy đủ + payment thật PASS Day 24)
- Storage: Cloudflare R2 bucket acf-assets (Week 2-3)
- Hosting: Vercel Hobby plan
- Monitoring: Sentry (Week 4+)

### Working Environment
- OS: Windows 11
- Project root: D:\auto-content-factory
- Repo: https://github.com/vuhuyhai/auto-content-factory
- Production URL: https://autocontent.online (alias https://auto-content-factory.vercel.app)
- Vercel project: auto-content-factory (vuhuyhais-projects)
- Supabase: fnhgtxxuudnqxxmzdpjx (Pro plan, ap-southeast-1)
- Inngest: vuhai-acf / auto-content-factory production app, SDK 4.4.0
- cron-job.org: "ACF Workflow Runner" job */5 * * * * UTC + "ACF Trial Reminders Daily" job 0 2 * * * UTC (9h sáng VN)
- Admin email: fitnessviet@gmail.com
- Node version: v24.14.0 (shadcn CLI fail)
- npm package manager

### Day 11-14 file structure additions
src/
├── app/dashboard/contents/
│   ├── page.tsx (UPDATED Day 14: parse pageParam + 3 Promise.all queries + redirect-on-overflow + wrap list bằng ContentsBulkActions)
│   ├── actions.ts (UPDATED Day 14: + bulkUpdateStatus Server Action defense-in-depth)
│   └── [id]/page.tsx (detail — UPDATED M2.2: CONTENT_STATUS_LABELS)
├── app/api/cron/run-workflows/
│   └── route.ts (POST + GET healthcheck)
├── components/contents/
│   ├── content-variant-selector.tsx (Client Component 3 tabs — UPDATED M2.3 + M2.4a: status bar UI + toast unified)
│   ├── contents-filter-tabs.tsx (NEW M4.1: Server Component 4 tabs + count badges)
│   ├── contents-pagination.tsx (NEW Day 14 M1: Server Component 68 LOC)
│   ├── content-list-item.tsx (NEW Day 14 M2: Client Component 93 LOC checkbox wrapper)
│   └── contents-bulk-actions.tsx (NEW Day 14 M2: Client Component 144 LOC sticky bar)
├── components/dashboard/
│   ├── dashboard-shell.tsx (UPDATED M3.1: async fetch draftCount + pass props)
│   ├── sidebar.tsx (UPDATED M3.1: nhận draftCount prop)
│   ├── mobile-drawer.tsx (UPDATED M3.1: nhận draftCount prop)
│   └── sidebar-nav.tsx (UPDATED M3.1: render badge inline khi draftCount > 0)
├── lib/contents/
│   ├── types.ts (UPDATED Day 14: + BulkUpdateInput + CONTENTS_PAGE_SIZE = 20 const)
│   ├── schemas.ts (UPDATED Day 14: + bulkUpdateStatusSchema)
│   └── queries.ts (UPDATED Day 14: getCurrentUserContents nhận page param + .range() + getContentsTotalCount() function mới)
├── lib/cron/
│   ├── should-trigger.ts (isCronInWindow + isOutsideDedupWindow)
│   └── queries.ts (admin client fetchEnabledWorkflows + markWorkflowTriggered)
└── lib/news/fetcher.ts (REFACTORED M2: bỏ jsdom, extractDescription helper)

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
    pain_points: string[], usp, topics: string[], hashtags: string[]
  },
  vocabulary: { yes_words: string[], no_words: string[] },
  signature_move: string,
  example_hooks: string[],
  sample_content_provided: boolean,
  created_at, last_updated
}

### Content variants JSON schema (lưu vào contents.variants)
[
  {
    hook: "Hook scroll-stopping 1-2 câu",
    title: "Title bài",
    body: "Body 300-400 chữ với CTA",
    hashtags: ["#Ladysfit", "#SucKhoeChiEm", ...]  // có hoặc không # prefix, normalizeHashtag() handle cả 2
  },
  // variant 2, variant 3
]

### Mental model
- Productized Service first, SaaS second
- Vietnamese SMB owner 30-50 tuổi, mobile-first
- Quality over quantity
- Speed over polish (MVP scrappy hơn beautiful broken)
- Content first - design after
- 1 brand = 1 voice = 1 source of truth cho mọi content engine

### Bài học Day 1-10 (RULES vẫn áp dụng)

**RULE D5-1:** VERIFY CURSOR OUTPUT BẰNG GREP KEYWORD CỤ THỂ.
**RULE D5-2:** POWERSHELL HERE-STRING KHÔNG SAFE VỚI TYPESCRIPT GENERIC.
**RULE D5-3:** SHADCN CLI v4.7.0 FAIL VỚI NODE v24. Manual paste workaround.
**RULE D5-4:** TASK PLAN PHẢI CÓ "CONTENT FIRST" TRƯỚC "DESIGN AFTER".
**RULE D5-5:** NEXT.JS 16 KHÔNG SHOW BUNDLE SIZE Ở BUILD OUTPUT.

**RULE D6-1:** REACT STATE UPDATES KHÔNG SYNCHRONOUS. Pass value mới explicit như parameter.
**RULE D6-2:** PowerShell `Get-ChildItem -Filter` chỉ nhận 1 string. Dùng `-Include "*.ts","*.tsx" -Recurse`.
**RULE D6-3:** SERVER ACTION VALIDATION ERROR CẦN FIELD-LEVEL DETAILS với label tiếng Việt.
**RULE D6-4:** SCHEMA VALIDATION THRESHOLD PHẢI TEST VỚI REAL VIETNAMESE DATA.

**RULE D7-1:** `git add <file>` KHÔNG TỰ STAGE DELETION. Dùng `git add -A`.
**RULE D7-2:** INCOGNITO CHROME KHÔNG TỰ XOÁ COOKIE GIỮA TAB CÙNG SESSION.
**RULE D7-3:** KHÔNG dùng `<form action={serverAction}>` với button trong Radix Portal.
**RULE D7-4:** KHÔNG ĐOÁN SCHEMA DB. VERIFY SCHEMA.TS + ACTIONS.TS TRƯỚC.
**RULE D7-5:** PowerShell `Select-String` mặc định match per line.
**RULE D7-6:** KHÔNG đổi DB access mechanism (Drizzle vs Supabase client) giữa milestone.

**RULE D8-1:** VERIFY THƯ VIỆN VERSION TRƯỚC KHI VIẾT SYNTAX MỚI (zod 3 vs 4).
**RULE D8-2:** ZOD 4 + react-hook-form CẦN useForm<Input, Context, Output> RÕ RÀNG.
**RULE D8-3:** VERIFY SHADCN COMPONENT TỒN TẠI TRƯỚC KHI VIẾT IMPORT.
**RULE D8-4:** PHÂN BIỆT RÕ FORMAT C `[PASTE VÀO FILE]` VS FORMAT A `[POWERSHELL]`. Dùng Format B (PROMPT CURSOR).

**RULE D9-1:** PLACEHOLDER ENV VAR PHẢI VERIFY REPLACE TRƯỚC KHI DÙNG.
**RULE D9-2:** ES MODULE HOISTING - DOTENV PHẢI LOAD QUA NODE FLAG (--env-file).
**RULE D9-3:** CLAUDE API JSON OUTPUT - HANDLE markdown wrapper + smart quotes + embedded quotes.
**RULE D9-4:** VERCEL HOBBY TIMEOUT 10s - CLAUDE GENERATE > 10s CẦN BACKGROUND JOB.
**RULE D9-5:** WORKFLOW CREATE FORM PHẢI VALIDATE URL LÀ RSS FEED.

**RULE D10-1:** INNGEST SDK PRODUCTION MODE MẶC ĐỊNH → CẦN `INNGEST_DEV=1` CHO LOCALHOST.
**RULE D10-2:** POWERSHELL `Get-Content` PARSE `[...]` LÀ WILDCARD. Dùng `-LiteralPath`.
**RULE D10-3:** TRƯỚC KHI BÁO ENCODING CORRUPT, CHẠY `chcp 65001` + `-Encoding UTF8`.
**RULE D10-4:** INNGEST V4 DÙNG `triggers: [{event: '...'}]` (ARRAY).
**RULE D10-5:** SUPABASE CLIENT KHÔNG CÓ SCHEMA TYPES → CAST `as never`.
**RULE D10-6:** VERIFY MỌI CỘT DB TRƯỚC KHI INSERT/UPDATE/SELECT - DÙNG SUPABASE MCP HOẶC ĐỌC SCHEMA.TS.
**RULE D10-7:** SYNC INNGEST PRODUCTION CHỈ KHI VERCEL DEPLOYMENT READY.
**RULE D10-8:** VERCEL ENV VARS CHỈ APPLY CHO DEPLOYMENTS MỚI SAU KHI SAVE.
**RULE D10-9:** VERCEL PRODUCTION KHÔNG BUNDLE ES MODULES NHƯ LOCALHOST DEV. LAZY IMPORT KHÔNG ĐỦ - PHẢI BỎ HẲN DEP CÓ ESM TRANSITIVE.
**RULE D10-10:** VERCEL HOBBY MAX_DURATION 60s ÁP DỤNG CHO MỖI INNGEST STEP RIÊNG.

### Bài học Day 11 (4 RULES mới)

**RULE D11-1: PRODUCTION FAIL ≠ NETWORK BLOCK. ĐỌC LOG TRƯỚC KHI ĐOÁN.**
Day 10 em đoán VnExpress block Vercel IP (41s timeout × 3 retries fail "No articles fetched"). Day 11 M1 logs cho biết RSS fetch HTTP 200 1093ms thành công, fail thực ở bước Readability article extract với ERR_REQUIRE_ESM. Hypothesis "block IP" sai hoàn toàn.
Pattern đúng: Trước khi đoán root cause, ALWAYS thêm logging chi tiết tại MỖI step → deploy → quan sát log thật → mới quyết hypothesis. Tránh debug dựa trên triệu chứng bề mặt (timeout duration) hoặc bias xác nhận (kỳ vọng = network).

**RULE D11-2: LAZY DYNAMIC IMPORT KHÔNG GIẢI QUYẾT ESM/CJS BUNDLING TRIỆT ĐỂ.**
Day 10 fix `await import('jsdom')` thay top-level. Day 11 production vẫn crash vì transitive deps của jsdom (html-encoding-sniffer → encoding-lite.js) là ESM mà Vercel bundle bằng require(). Lazy import outer module KHÔNG giúp transitive deps. 
Quyết định: Khi dep có ESM transitive + Vercel production strict CJS, **BỎ DEP THAY VÌ FIX BUNDLING**. Trade-off feature đơn giản hơn vs. cuộc chiến ESM dài hạn không scaling.
Pattern phát hiện sớm: Localhost dev Turbopack bundle ESM/CJS mượt mà → KHÔNG là dấu hiệu production OK. Phải test production deploy thật sau mỗi dep update.

**RULE D11-3: POWERSHELL `Invoke-WebRequest` ErrorDetails.Message KHÔNG CAPTURE BODY 4XX/5XX.**
Day 11 M4.2 production POST endpoint trả 401 nhưng `$_.ErrorDetails.Message` rỗng → em sai diagnosis là 500 server error. Phải dùng pattern:
```powershell
try { Invoke-WebRequest ... } catch {
  $stream = $_.Exception.Response.GetResponseStream()
  $reader = New-Object System.IO.StreamReader($stream)
  $body = $reader.ReadToEnd()
}
```
Pattern này đọc raw response body bất kể status code. Áp dụng cho mọi PowerShell test HTTP với 4xx/5xx response.

**RULE D11-4: VERCEL HOBBY CRON JOB LIMITATION = 1 LẦN/NGÀY.**
Vercel docs chính thức (27/02/2026): Hobby plan cron-jobs chỉ chạy 1 lần/ngày, cron expression chạy hơn sẽ fail deployment. Đây là restriction về scheduler config, KHÔNG phải về API route execution. API route `/api/cron/run-workflows` chạy như HTTP endpoint bình thường - external service nào cũng gọi được.
Workaround chuẩn: cron-job.org / Runhooks / GitHub Actions trigger endpoint từ ngoài Vercel. Free, mỗi phút trigger được. Endpoint tự match cron expression với current UTC time + dedup window.
Pattern khi gặp limitation platform: Tách concerns - dùng platform cho compute, dùng external service cho scheduling.

### Bài học Day 12 P1 (4 RULES mới)

**RULE D12-1: TRƯỚC Add-Content VÀO .env.local LUÔN CHECK KEY ĐÃ TỒN TẠI CHƯA.**
Day 12 P1 em đưa lệnh Add-Content CRON_SECRET vào .env.local mà KHÔNG check trước → tạo dòng DUPLICATE (Day 11 đã add rồi). Dotenv parse last-wins nên runtime OK, nhưng pattern PowerShell sau đó break vì $cronLine trả array.
Pattern an toàn:
```powershell
$exists = Select-String -Path ".env.local" -Pattern "^FIELD=" -Quiet
if (-not $exists) { Add-Content ".env.local" "`nFIELD=$value" }
else { Write-Host "FIELD exists, manual edit if needed" }
```

**RULE D12-2: PowerShell `Select-String -SimpleMatch` TẮT REGEX → ANCHOR `^` `$` THÀNH LITERAL.**
Pattern `Select-String -Pattern "^CRON_SECRET=" -SimpleMatch` KHÔNG match dòng `CRON_SECRET=value` ở đầu dòng. Vì `-SimpleMatch` treat `^` như literal character (Unicode caret).
Pattern đúng:
- Pattern có anchor `^FIELD=` → KHÔNG dùng `-SimpleMatch` (để `^` hoạt động regex anchor)
- Pattern simple text "any text" không cần regex → dùng `-SimpleMatch` để escape special chars
- Khi không chắc, bỏ `-SimpleMatch` mặc định

**RULE D12-3: `Set-Content -Encoding UTF8` PowerShell 5.x MẶC ĐỊNH THÊM BOM `EF BB BF`.**
Sau khi cleanup .env.local bằng `Set-Content -Encoding UTF8`, file có BOM ở đầu. Dotenv parse OK BOM (không crash) nhưng các tool khác (jq, awk, grep regex strict) có thể bị fool.
Cách dùng đúng:
- PowerShell 7+: `Set-Content -Encoding utf8NoBOM`
- PowerShell 5.x: dùng `[System.IO.File]::WriteAllText(path, content, [System.Text.UTF8Encoding]::new($false))` để force no-BOM
- Verify BOM: `[System.IO.File]::ReadAllBytes(path) | Select-Object -First 4` → nếu hex `EF BB BF` là BOM

**RULE D12-4: LITERAL UNION TYPE PHẢI CÓ SINGLE SOURCE OF TRUTH (DRY PATTERN).**
Day 12 P1 phát hiện ScheduleCronValue ở types.ts và SCHEDULE_CRON_VALUES ở schemas.ts hardcode literal 5 cron cũ riêng biệt. Update types.ts (5 cron mới) → forget schemas.ts → TypeScript build production FAIL với mismatch type. Dev mode Turbopack PASS, chỉ fail ở `npm run build` production.
Pattern DRY:
```typescript
// constants.ts: source of truth
export const SCHEDULE_PRESETS = [...] as const;

// schemas.ts: derive
const SCHEDULE_CRON_VALUES = SCHEDULE_PRESETS.map(p => p.value) as [
  (typeof SCHEDULE_PRESETS)[number]['value'],
  ...(typeof SCHEDULE_PRESETS)[number]['value'][]
];
scheduleCron: z.enum(SCHEDULE_CRON_VALUES, {...})
```
Lần sau thêm/sửa preset chỉ đụng constants.ts, schema tự reflect.

### Bài học Day 12 P2 (3 RULES mới, nhẹ vì M2-M4 implement smooth)

**RULE D12-P2-1: NEXT.JS 16 SEARCHPARAMS LÀ PROMISE ASYNC.**
Pattern: export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) { const params = await searchParams; const status = params.status; }
KHÁC Next.js 14 (searchParams sync object). Áp dụng cho mọi page có searchParams Day 12 P2 trở đi.

**RULE D12-P2-2: REVALIDATEPATH PATH-ONLY KHÔNG INVALIDATE LAYOUT.**
Khi Server Action update DB cần re-render component render từ layout (vd sidebar badge), revalidatePath(path) KHÔNG đủ - chỉ invalidate page cấp đó. Pattern Next.js 15+: revalidatePath(path, 'layout') để invalidate cả layout level. Áp dụng cho mọi update mutation có UI render từ layout cấp trên (dashboard layout, root layout).

**RULE D12-P2-3: LITERAL UNION TYPE + ZOD ENUM DRY DERIVE TỪ CONST ARRAY.**
Tiếp tục pattern Day 12 P1 RULE D12-4: Tránh hardcode literal 2 chỗ (types.ts + schemas.ts). Pattern duy nhất:
```typescript
// types.ts: source of truth
export const STATUS_VALUES = ['draft', 'approved', 'rejected'] as const;
export type Status = (typeof STATUS_VALUES)[number];

// schemas.ts: derive
import { STATUS_VALUES, type Status } from './types';
const tupleValues = STATUS_VALUES as [Status, ...Status[]];
export const updateStatusSchema = z.object({ status: z.enum(tupleValues) });
```
Lần sau thêm/sửa status chỉ đụng const array source. Build production sẽ catch nếu mismatch.

### Bài học Day 13 (4 RULES mới)

**RULE D13-1: Node v24 + `--experimental-strip-types` KHÔNG resolve relative imports thiếu `.ts` extension.**
Day 13 M5.1 chạy `node --env-file=.env.local --experimental-strip-types scripts/test-generator.ts` fail ERR_MODULE_NOT_FOUND vì Node ES Module strict resolution. Fix dùng `npx tsx --env-file=.env.local scripts/...` (`tsx` đã có sẵn deps `^4.21.0`). Pattern: scripts/ folder dev tooling LUÔN dùng tsx, KHÔNG dùng raw node với experimental flag.

**RULE D13-2: STRATEGY PATTERN CHO PROMPT BUILDERS - TÁCH FILE THEO TYPE, KHÔNG DÙNG IF-ELSE TRONG 1 FILE.**
Day 13 M2 phân vân giữa 2 approach: (1) Strategy pattern 4 file `_base.ts + news-based.ts + evergreen.ts + promotional.ts + index.ts dispatcher` vs (2) 1 file prompts.ts với if-else conditional. Em chọn (1) vì:
- Input mỗi type khác (NewsArticle vs EvergreenContext vs PromotionalContext)
- Hook pattern khác (news pivot vs evergreen tips vs promo CTA)
- Test isolation tốt (test riêng từng builder không phải mock toàn bộ)
- Mỗi file < 100 LOC dễ maintain
- Mở rộng Phase 2 (vd retrospective, listicle) chỉ thêm 1 file + 1 case trong dispatcher
Pattern: Khi prompt có >2 variation đáng kể, LUÔN strategy pattern. KHÔNG nhồi conditional vào 1 file.

**RULE D13-3: INNGEST STEP.RUN BOUNDARY WIDEN LITERAL UNION → STRING. RE-NARROW QUA TYPE GUARD.**
Day 13 M3.2 fail TS2345 ở line `buildPromptContextByType(contentType, workflow)`. Root cause: `step.run` return value serialize qua JSON (JsonifyObject<T>) → literal union `'news_based' | 'evergreen' | 'promotional'` widen thành `string`. TypeScript không narrow lại được sau boundary.
Fix 2 cách:
- Cách 1: Re-narrow qua type guard `isSupportedContentType(value: string): value is SupportedContentType` sau step.run, gán lại biến `const contentType: SupportedContentType = contentTypeRaw`. (em chọn cách này)
- Cách 2: Gộp 2 step thành 1 step để KHÔNG pass contentType qua boundary. (em làm thêm để bonus performance)
Pattern: Mọi step.run return có literal union → re-narrow ngay sau boundary HOẶC tránh pass qua boundary.

**RULE D13-4: DISCRIMINATED UNION + EXHAUSTIVE CHECK > OVERLOADED SIGNATURE.**
Day 13 M2 cân nhắc 2 approach cho generator.ts: (1) function overload `generateContent(brand, article)` + `generateContent(brand, topic)` + `generateContent(brand, promo)` vs (2) single signature với discriminated union `generateContent(brand, ctx: PromptContext)`. Em chọn (2) vì:
- Caller (workflow-runner) tự build context theo type, generator KHÔNG cần biết business logic
- TypeScript exhaustive check trong switch (compile error nếu thêm type mới mà quên handle)
- Test mock dễ (mock 1 object thay vì 3 signature)
- Mở rộng Phase 2 chỉ extend PromptContext union, KHÔNG đụng signature
Pattern: Khi function nhận input đa dạng (>2 shape), discriminated union >> overload. Pattern này cũng áp dụng được cho Server Actions, validate schemas, event payloads.

### Bài học Day 14 (3 RULES mới)

**RULE D14-1: SUPABASE JS KHÔNG SUPPORT FILTER JOIN TRONG UPDATE → DÙNG 2-ROUND-TRIP PATTERN.**
Day 14 M2 bulk update content theo ids[] cần verify ownership qua brands.user_id. Supabase JS .update().eq().in() KHÔNG cho phép subquery join trong cùng query (PostgREST limitation). Cách 1 single UPDATE thất bại.
Pattern đúng (2 round-trip):
```ts
// Step 1: derive owned subset
const { data: owned } = await supabase
  .from('contents')
  .select('id, brands!inner(user_id)')
  .eq('brands.user_id', user.id)
  .in('id', inputIds);
const validIds = owned?.map(r => r.id) ?? [];

// Step 2: update only validIds
const { error } = await supabase
  .from('contents')
  .update({ status })
  .in('id', validIds);
```
2 query nhưng đảm bảo defense-in-depth trên top RLS. RLS đã filter, app layer filter lại = 2 lớp. Risk: race condition giữa 2 query gần như zero cho use case approve/reject (user không thể remove brand ownership trong < 100ms).

**RULE D14-2: NEXT.JS SEARCHPARAMS PROMISE PHẢI VALIDATE STRICT TRƯỚC KHI DÙNG.**
Day 14 M1 pageParam từ `?page=999` hoặc `?page=abc` có thể crash hoặc render trang trắng. Pattern an toàn:
```ts
const sp = await searchParams;
const rawPage = sp.page;
const parsed = typeof rawPage === 'string' ? parseInt(rawPage, 10) : NaN;
const currentPage = Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;

// Overflow detection
const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
if (currentPage > totalPages && totalCount > 0) {
  redirect(`/dashboard/contents${statusFilter ? `?status=${statusFilter}` : ''}`);
}
```
KHÔNG dùng zod schema cho searchParams vì redirect chỉ có ở Server Component, async flow đơn giản. Tự coerce + validate inline đủ.

**RULE D14-3: useEffect RESET STATE KHI PROP CHANGE - TRÁNH GHOST STATE.**
Day 14 M2 ContentsBulkActions nhận prop statusFilter. User tick contents ở tab "Chờ duyệt", switch sang tab "Đã duyệt", các ID chọn KHÔNG còn trong list hiện tại NHƯNG vẫn ở trong selectedIds Set. Bulk action sẽ apply lên ghost IDs.
Pattern:
```tsx
useEffect(() => {
  setSelectedIds(new Set());
}, [statusFilter]);
```
Áp dụng cho mọi list component với filter/pagination + selection state. KHÔNG limited to bulk actions - cũng cần cho multi-select dropdown, drag-drop reorder, etc.

### Bài học Day 15 (3 RULES mới)

**RULE D15-1: SUPABASE JS KHÔNG EXPOSE jsonb_set HELPER → FETCH-MERGE-UPDATE PATTERN AN TOÀN HƠN RPC.**
Cách 1 raw SQL qua `supabase.rpc('jsonb_set_helper')`: cần migration tạo function, phức tạp.
Cách 2 fetch-merge-update: SELECT current → merge JS → UPDATE full array. An toàn (validate index tồn tại trước), 1 atomic UPDATE qua PG MVCC, không cần migration.
Pattern: khi cần partial update JSONB, ưu tiên fetch-merge-update. Chỉ dùng RPC khi hot path cần performance hoặc race condition cao.

**RULE D15-2: COUNTER REALTIME ĐỔI MÀU LÀ UX PATTERN MẠNH CHO SMB VIỆT NAM.**
Form validation lỗi sau khi submit = friction. Counter realtime đổi `font-semibold + text-red-600` khi vượt range = user tự correct trước submit. Pattern: `counterClass(current, min, max)` helper. Áp dụng cho mọi form > 2 field có character/word limit.

**RULE D15-3: HASHTAG INPUT STRING + SPLIT REGEX > 10 INPUT RIÊNG CHO UX.**
User SMB Việt copy hashtag từ Facebook (đã có `#`) hoặc gõ tay (không có `#`). Pattern: 1 input text + split `/[\s,]+/` + normalize add `#` prefix nếu thiếu. Unicode regex `/^#?[\p{L}\p{N}_]+$/u` hỗ trợ tiếng Việt có dấu. KHÔNG dùng 10 input riêng (mobile UX kém + không paste batch).

### Bài học Day 16 (4 RULES mới)

**RULE D16-1: VERCEL MCP KHÔNG CÓ TOOL TẠO/UPDATE ENV VAR.**
Vercel MCP hiện tại (Day 16) expose 22 tools: deploy_to_vercel, list_deployments, get_deployment, get_runtime_logs, etc. KHÔNG có create_env_var hoặc tương tự.
Pattern khi cần add env var: fallback Vercel Dashboard manual UI (https://vercel.com/.../settings/environment-variables) hoặc Vercel CLI (vercel env add).
Day 16 đã add 2 env RESEND_API_KEY + RESEND_FROM_EMAIL qua Dashboard manual cho Production + Preview + Development.

**RULE D16-2: SUPABASE MCP KHÔNG ĐỌC AUTH CONFIG (Site URL + Redirect URLs).**
Supabase MCP có tool get_logs với service=auth nhưng đó là log runtime (login events, errors). KHÔNG có tool get_auth_config hoặc list_redirect_urls.
Pattern khi cần verify auth config: fallback Supabase Dashboard manual (https://supabase.com/dashboard/project/.../auth/url-configuration).

**RULE D16-3: PKCE FLOW CROSS-BROWSER FAIL = TEST PATTERN ISSUE, KHÔNG PHẢI CODE BUG.**
Supabase Auth PKCE: code_verifier lưu trong cookie httpOnly khi user click "Sign up". Khi click email verify link, browser PHẢI có cookie code_verifier để exchange OK.
Pattern fail: signup ở browser A (vd Chrome incognito), click verify ở browser B (vd Chrome thường) → cookie không có → AuthPKCECodeVerifierMissingError.
Pattern PASS: signup + click verify CÙNG browser session.
Production user thật KHÔNG gặp issue này vì họ click email link bằng default browser của họ (luôn cùng browser signup).
Dev test pattern đúng:
- Cách 1: Set browser test thành default OS browser, click email link đảm bảo mở browser đó
- Cách 2: Dùng Google OAuth thay vì email signup (KHÔNG có PKCE cross-browser issue)
- Cách 3: Test production thật với 1 user thật

**RULE D16-4: REACT EMAIL ECOSYSTEM MIGRATION - 19 SUB-PACKAGE DEPRECATED NHƯNG VẪN WORK.**
@react-email/components v1.0.12 có 19 deprecation warnings: @react-email/row, @react-email/text, @react-email/button, etc.
Lý do: maintainer consolidate vào monorepo unified react-email. Render email vẫn đúng.
Pattern: deprecated ≠ broken. Defer fix Week 3 nếu phát hiện bug runtime.
Import render: phải từ '@react-email/components' (KHÔNG phải '@react-email/render' standalone package).

### Bài học Day 17 (2 RULES mới)

**RULE D17-1: PROMISE.ALLSETTLED > PROMISE.ALL CHO BATCH EMAIL SEND.**
Promise.all reject 1 promise → reject toàn bộ + lose results của promise đã fulfilled. Email batch send với Resend free tier có rate limit + transient network blip → 1 user fail không nên block 49 user còn lại. Pattern Promise.allSettled return array {status:'fulfilled'|'rejected', value|reason}. TS narrow cần if-else KHÔNG combine: tách rejected branch + continue trước khi access r.value.success.

**RULE D17-2: PARTIAL INDEX WHERE NOT NULL TIẾT KIỆM SPACE + TĂNG TỐC QUERY DEDUP.**
Pattern: CREATE INDEX idx ON table(col) WHERE col IS NOT NULL. Khi 99% rows có col NULL (vd last_digest_sent_at chưa từng gửi), partial index chỉ chứa 1% rows có timestamp. Query dedup `WHERE col < timestamp` dùng index nhanh hơn full index. Áp dụng cho mọi nullable timestamp dedup pattern (last_email_sent_at, last_notification_at, last_login_at).

### Bài học Day 18 (3 RULES mới)

**RULE D18-1: POSTGRES UNIQUE INDEX PARTIAL CHO MIXED NULLABLE COLUMN.**
Pattern `CREATE UNIQUE INDEX idx ON table (col_a, col_b) WHERE col_b IS NOT NULL` áp dụng khi col_b nullable + business rule "uniqueness CHỈ enforce khi có value". Evergreen workflows source_url NULL cần multiple rows; news_based + promotional source_url NOT NULL cần dedup. Partial index xử lý 2 case trong 1 constraint, KHÔNG cần app layer logic switch. Đối lập với CHECK constraint chỉ validate row-level, không enforce uniqueness cross-rows.

**RULE D18-2: INNGEST STEP DUPLICATE = SUCCESS NOT FAILURE - LAST_RUN_AT UPDATE BOTH BRANCHES.**
Khi step.run gặp expected failure mode (duplicate, no new data, no eligible users), return success object với flag `skipped=true` thay vì throw. Throw triggers Inngest retry 3 lần default + last_run_at KHÔNG update → external cron service retry 5p sau bypass dedup window → loop spam tốn API quota. Pattern: extract side effects (update last_run_at, log, metrics) ra ngoài if-else branch để chạy cả 2 case.

**RULE D18-3: AUTH ERROR MESSAGE SIGNUP VS LOGIN KHÁC PATTERN.**
Signup: map code-based actionable ("email đã đăng ký" → user know action: "đăng nhập"). Login: GIỮ generic single message ("Email hoặc mật khẩu không đúng") để chống enumeration attack (kẻ tấn công không phân biệt email exists vs password wrong). Khác biệt UX vs security trade-off. Helper translate map theo `error.code` (chính xác stable) + fallback `message.includes()` (legacy) + default generic catch-all.

### Bài học Day 22-24 (2 RULES mới)

**RULE D24-1: NÚT SERVER ACTION CHẾT ÂM THẦM + `npm run build` PASS = NGHI TURBOPACK DEV LỖI, KHÔNG PHẢI LỖI CODE.**
Triệu chứng: Click button onClick → handler arrow → Server Action không có request POST trong Network tab, không lỗi console, không error UI. Nhưng `npx tsc --noEmit` PASS + `npm run build` production PASS sạch sẽ. Day 24 debug UpgradeCard `handleStartTrial` + `handlePay` mất ~30p vì giả định là lỗi code (typo, missing 'use server', client/server boundary sai).
Cách kiểm chứng nhanh: dừng `npm run dev` Turbopack mặc định, chạy `npx next dev --webpack` → nếu hoạt động bình thường thì xác định là bug Turbopack 16.x với Server Action import từ file `'use server'` vào client component. Không tốn thời gian sửa code đúng.
Pattern phòng ngừa: khi gặp Server Action không fire ở dev, FIRST check: build PASS không + Webpack dev có chạy được không. Trước rồi mới đào code.

**RULE D24-2: CHỈ GIỮ MỘT TERMINAL `npm run dev` - NHIỀU DEV SERVER CHỒNG GÂY TEST NHẦM CỔNG.**
Day 23-24 nhiều lần chạy `npm run dev` ở terminal mới mà quên đóng terminal cũ → Next.js fallback từ port 3000 sang 3001 → 3002. Browser test ở localhost:3000 (instance cũ KHÔNG có code mới), trong khi instance code mới đang ở port 3001. Mất thời gian "code đúng mà sao không thấy thay đổi".
Pattern: trước khi `npm run dev`, kill các terminal cũ (Ctrl+C hoặc đóng cửa sổ). Nếu thấy log "Port 3000 is in use, using available port 3001" → STOP, kill instance khác. Hoặc luôn chỉ định cổng `npm run dev -- --port 3000` + ép thoát nếu port chiếm.

### Bài học Day 27 (2 RULES mới)

**RULE D27-1: TEXT JSX TRONG CONST ARRAY STRING LITERAL BYPASS ESLINT `react/no-unescaped-entities`.**
Pattern: tạo const array `{title: 'text có nháy thẳng'}` render qua `{card.title}` thay vì hardcode trong JSX. ESLint rule chỉ scan text node trực tiếp giữa JSX tags, không scan JS expression. Áp dụng khi cần giữ dấu nháy thẳng chính tả tiếng Việt mà không phải escape `&apos;` lằng nhằng.

**RULE D27-2: id ANCHOR ĐẶT THẲNG TRÊN SECTION ELEMENT trong file component, KHÔNG wrap div bên ngoài trong page.tsx.**
Pattern: `<section id="samples" scroll-mt-20>` trong samples-section.tsx thay vì `<div id="samples"><SamplesSection/></div>` trong page.tsx. Tránh nguy cơ duplicate ID (`id="samples"` xuất hiện 2 lần = invalid HTML), giữ component self-contained. Lưu ý ngoại lệ: với section KHÔNG được phép sửa file (vd pricing/bonus theo constraint), vẫn dùng div wrapper trong page.tsx như Day 27 Task 1 đã làm cho `#features|#pricing|#bonus`.

### Lưu ý cho chat tiếp theo

- HANDOFF.md raw URL: https://raw.githubusercontent.com/vuhuyhai/auto-content-factory/main/HANDOFF.md
- Em fetch HANDOFF đầu chat. **GitHub raw URL cache bản cũ (Day 1) - đã xác nhận lại Day 20.** Dùng bản đính kèm Project knowledge làm chuẩn HOẶC cross-check git log local.
- **PHASE 1 WEEK 2 MILESTONE DONE (Day 21):** Email infra (Day 16-17) + Bug fix outstanding (Day 18) + Workflow edit form (Day 19) + Polish (Day 20) + đóng milestone (Day 21).
- **Phase 2 Week 3 Day 22-24 DONE:** Pricing UI + bảng subscriptions + tích hợp PayOS đầy đủ + webhook + Trial banner + domain `autocontent.online` + test thanh toán thật 199K PASS.
- **Polish UI trước public DONE (milestone gần nhất):** metadata thật + token `accent-acf` đồng bộ landing + login/signup + việt hoá onboarding step 3/4/5/7 + ẩn lỗi DB thô.
- **Production end-to-end pipeline LIVE:** cron-job.org → Vercel → Inngest → Claude → DB. Auto-trigger ổn định từ đêm 13→14/05/2026.
- **cron-job.org production jobs ACTIVE:** "ACF Workflow Runner" `*/5 * * * *` UTC + "ACF Daily Digest" `0 1 * * *` UTC
- **Plan Phase 2 Week 3 chốt:** Day 25 trial reminders → Day 26 bug fix Turbopack + FK profiles + tier enforcement → Day 27 landing polish (footer 404, domain mới, favicon, OG image, accessibility) → Day 28-29 soft launch. Target launch 09/06/2026 (Profile A 3-5 paid + 10 trial + 50% retention).
- **Phát hiện Day 20-21 cấu trúc FK (đã query xác minh Day 21):** Cây CASCADE từ profiles xuống hoạt động đầy đủ (brands/workflows/contents/content_logs/subscriptions đều ON DELETE CASCADE). Xóa user đúng cách chỉ 2 lệnh: DELETE FROM profiles (tự cascade) → DELETE FROM auth.users. Mắt xích đứt duy nhất: profiles không có FK ra auth.users. Day 26 bug fix round 2 thêm FK profiles → auth.users CASCADE.
- **Polish UI hoàn thiện DONE (5 task):** #1 fallback origin signup, #2 6 public pages + footer cleanup, #3 OFFER_CONFIG centralize, #4 favicon + OG static, #5 a11y tap target 44px
- **Cursor diff pending gotcha:** prompt có chữ "hiển thị diff cho tôi xác nhận trước khi save" làm Cursor dừng ở preview, KHÔNG apply xuống disk. Verify trên disk bằng PowerShell Get-Content trước khi build/commit. Với polish nhỏ rõ ràng, nên ghi "apply trực tiếp, không cần diff" trong prompt.
- **ImageResponse cho favicon/OG:** dùng Node runtime mặc định (KHÔNG runtime='edge'), Next.js 16 tự discover icon.tsx + opengraph-image.tsx ở src/app/, không cần touch layout.tsx
- ~~**Footer Facebook link vẫn placeholder**~~ ✅ Day 27: icon Facebook ẩn hẳn, hiện lại khi có fanpage thật
- **Day 27 polish landing DONE:** sticky nav (landing-nav.tsx) + Hero CTA secondary "Xem bài viết mẫu ↓" + Trust section (founder + 3 proof) + Samples section (3 bài Việt: Ladysfit/VSE/Cafe mẫu) + padding `py-16 md:py-24` chuẩn hoá + H2 phân cấp anchor (`lg:text-5xl`) vs content (`md:text-4xl`). Production READY merge `38fb399`.
- **Day 28 có task nhỏ kèm soft launch:** Unify landing design tokens (~45p) - 6 finding: slate vs gray, leading/wordBreak thiếu, bg hue lệch, eyebrow pattern, Trust max-w rộng, Sample card alignment (xem Section 5).
