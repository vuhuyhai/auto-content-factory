# HANDOFF - Auto-Content Factory

## 1. Overview

**Project:** Auto-Content Factory (ACF)
**One-liner:** SaaS giúp SMB Việt Nam tự động hoá viết content social bằng brand voice riêng.
**Owner:** Vũ Hải (Chairman VSE, CEO Ladysfit)
**Started:** 12/05/2026
**Target launch:** Tuần 4 (~09/06/2026)
**Status:** Week 1 Day 11 - Production fetch-news bug FIXED + Cron auto-trigger PASS + Contents review UI live. End-to-end pipeline production READY.

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
- ✅ Production: ✅ LIVE - https://auto-content-factory.vercel.app
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
- ✅ Contents review dashboard `/dashboard/contents` list + `/dashboard/contents/[id]` detail (Day 11 M5)
- ✅ Variant selector UI với 3 tab + select variant + copy clipboard
- ✅ `npm run build` PASS - 14 routes (Static `/`, Dynamic `/dashboard/contents` `/dashboard/contents/[id]` `/api/cron/run-workflows`)
- ✅ TypeScript zero error
- **Last verified:** 13/05/2026 - Day 11 close - 6 commits Day 11 pushed (commit cuối `6dcfa81`), production deployment LIVE

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

**Last verified:** 13/05/2026 - Day 11 close - 6 commits Day 11 pushed (1a64bf8, fb3bc56, ad0d6ae, 4ae8495, 6dcfa81 + sắp có commit HANDOFF), production deployment LIVE với end-to-end pipeline auto-trigger 7h UTC daily

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
- CTA "Xem cách hoạt động" trong Hero link tới /#how-it-works - chưa có section đó
- getBrandPrefix logic sai "Ladysfit" → `LT_` thay vì `LF_`. Fix Week 2.
- saveError banner persistent trong onboarding sau khi user edit thành công
- `npm run lint` script missing trong package.json
- Claude API chưa integrate cho synthesize brand voice trong onboarding (Day 6 dùng rule-based)
- Signup error message quá generic
- Sub-header BrandVoiceCard "Xem lại và confirm" không hợp dashboard readonly
- Drizzle client chưa setup DATABASE_URL env
- Workflow card không có button "Sửa workflow" (edit name/sources/schedule)
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
- **Schedule preset timezone bug (Day 8 preset chưa convert UTC):** UI label "Mỗi sáng 7h" map sang cron `0 7 * * *` (7h UTC = 14h VN time, không phải 7h sáng VN). Workflow Ladysfit hiện trigger 14h VN. Fix Week 2: convert preset → UTC cron khi save, hiển thị label VN time khi load. Có 2 pattern decide: lưu cron UTC + label VN HOẶC lưu cron VN + convert runtime. Cần thiết kế Week 2.
- **Inngest function chỉ scan workflow type='news_based':** Day 9 logic generate content chỉ work với news_based. Workflow type='evergreen' và 'promotional' tạo được nhưng KHÔNG generate. Sau khi cron-job.org trigger evergreen workflow, Inngest function sẽ skip silently. Fix Week 2 cùng prompt template per type.
- **Contents duplicate khi workflow chạy lại cùng source:** Image dashboard Day 11 M5 hiển thị 2 cards cùng title "Người dân sắp nhận gói khám miễn phí" với time khác nhau (test multiple lần). Schema KHÔNG có unique constraint (workflow_id, source_url). Fix Week 2: add unique index hoặc check trước insert.
- **PowerShell `Invoke-WebRequest` ErrorDetails.Message KHÔNG capture body 4xx/5xx:** Cần dùng pattern `$_.Exception.Response.GetResponseStream() + StreamReader` để đọc raw body. Day 11 M4.2 đã debug, RULE D11-3 ghi pattern.
- **Cron-job.org dependency:** ACF hiện phụ thuộc cron-job.org để trigger workflows. Nếu cron-job.org down hoặc miss event, workflow tự động ngừng. Backup plan: Setup cron job thứ 2 ở GitHub Actions (free, reliable) làm secondary trigger Week 2.
- **No content review UI status actions:** Day 11 M5 chỉ select variant + copy clipboard. Status chỉ display, KHÔNG action được (chưa có button "Duyệt"/"Từ chối"/"Đăng Facebook"). Defer Week 2-3.
- **No /dashboard/contents pagination:** Hiện limit 50 contents trong query. Khi user có > 50 content sẽ miss. Fix Week 3 cùng filter/search.
- **content-variant-selector.tsx 117 LOC** + page list 90 LOC + page detail 84 LOC - đều dưới 200 LOC limit, OK Day 11.
- **No edit variant body inline:** User chỉ chọn variant nào tốt nhất, KHÔNG sửa được text. Defer Week 2-3 cùng "Edit Brand Voice" UI.
- **deprecation warning DEP0169 url.parse() vẫn còn:** Có thể từ transitive dep rss-parser hoặc cron-parser. Defer fix khi deps update.

### D5 Gotchas (vẫn áp dụng)
- D5-6: Vercel Framework Preset có thể bị set "Other" - check Settings → Build and Deployment
- D5-7: Đừng dùng `vercel link` với "Pull env now: YES" khi Vercel chưa có env
- D5-8: Phải add env vào Vercel cho cả 3 environments (Production + Preview + Development)

## 6. Next Steps

### Day 12 / Week 2: High Priority

**P1 - Schedule preset timezone fix:**
- Decide pattern: lưu cron UTC + label VN HOẶC lưu cron VN + convert runtime
- Update Day 8 SCHEDULE_PRESETS với cron UTC chuẩn (vd "Mỗi sáng 7h VN" = `0 0 * * *` UTC)
- Migration data: convert existing workflow cron production
- Update workflow card display label theo timezone

**P2 - Content review status actions:**
- Button "Duyệt" + "Từ chối" trên detail page → update status DB
- Sidebar nav badge count contents draft
- Filter contents page by status

**P3 - Workflow types evergreen + promotional:**
- Day 9 logic chỉ work news_based. Extend Claude prompt template per type
- Evergreen: topic_focus field thay vì news_sources
- Promotional: product_link + offer field

**P4 - Multi-source batch generation:**
- Workflow `news_based` có thể có 3 nguồn RSS × 3 articles = 9 candidates
- Loop generate multiple content per workflow run
- Skip article đã có content (dedup theo source_url)
- Test với 2-3 RSS sources VN (TuoiTre, Dantri, CafeBiz)

### Week 2-3: Content Review UI + Email delivery
- Approve/reject UI với edit inline body
- Resend integration gửi content draft email cho user review
- Cloudflare R2 storage cho media assets

### Week 3: Fix outstanding known issues
- getBrandPrefix logic fix
- saveError persistent banner trong onboarding
- Add npm run lint script vào package.json
- BrandVoiceCard refactor base/wrapper
- Workflow edit form (reuse create form mode=edit)
- "Edit Brand Voice" button trên dashboard
- workflow-card.tsx + actions.ts refactor < 200 LOC
- Improve signup error message
- Content duplicate constraint
- Pagination /dashboard/contents
- Backup cron GitHub Actions

### Week 4: Payment + Polish + Launch
- PayOS integration cho 3 tier (Free/Starter/Pro)
- Stripe trial flow (14 ngày guarantee per landing)
- Sentry monitoring
- Domain autocontent.online connect Vercel
- Multi-brand support (relax MVP rule "1 brand per user")

## 7. Context cho AI

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
- Email: Resend (Week 3)
- Payment: PayOS (Week 4)
- Storage: Cloudflare R2 bucket acf-assets (Week 2-3)
- Hosting: Vercel Hobby plan
- Monitoring: Sentry (Week 4+)

### Working Environment
- OS: Windows 11
- Project root: D:\auto-content-factory
- Repo: https://github.com/vuhuyhai/auto-content-factory
- Production URL: https://auto-content-factory.vercel.app (autocontent.online connect Week 4)
- Vercel project: auto-content-factory (vuhuyhais-projects)
- Supabase: fnhgtxxuudnqxxmzdpjx (Pro plan, ap-southeast-1)
- Inngest: vuhai-acf / auto-content-factory production app, SDK 4.4.0
- cron-job.org: "ACF Workflow Runner" job */5 * * * * UTC
- Admin email: fitnessviet@gmail.com
- Node version: v24.14.0 (shadcn CLI fail)
- npm package manager

### Day 11 file structure additions
src/
├── app/dashboard/contents/
│   ├── page.tsx (list)
│   ├── actions.ts (selectVariant Server Action)
│   └── [id]/page.tsx (detail)
├── app/api/cron/run-workflows/
│   └── route.ts (POST + GET healthcheck)
├── components/contents/
│   └── content-variant-selector.tsx (Client Component 3 tabs)
├── lib/contents/
│   ├── types.ts (Content + ContentWithWorkflow + normalizeHashtag)
│   └── queries.ts (RLS-aware getCurrentUserContents + getContentById)
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

### Lưu ý cho chat tiếp theo

- HANDOFF.md raw URL: https://raw.githubusercontent.com/vuhuyhai/auto-content-factory/main/HANDOFF.md
- Em fetch HANDOFF đầu chat. Nếu cache cũ → cross-check git log local
- **Day 11 PUSHED 5 commits** (1a64bf8 → 6dcfa81) + 1 sắp có commit HANDOFF. Production LIVE end-to-end pipeline với auto-trigger cron-job.org → Vercel → Inngest → Claude → DB.
- **Production smoke test STATUS:** Day 11 M3 verified content saved DB thật (id e5dc4bce). Day 11 M4 verified cron-job.org TEST RUN 200 OK. Pipeline production READY 100%.
- Commit cuối local nên là `docs(handoff): close Day 11 - production pipeline live with auto-trigger`
- Day 12 nếu anh tiếp tục: P1 fix schedule preset timezone bug (label "7h sáng" map đúng VN time = 0h UTC, không phải 7h UTC = 14h VN)
- Workflow Ladysfit (id b01973cb-7c76-49ec-adf7-6f980d3b7480) cron `0 7 * * *` = 7h UTC = 14h VN time, sẽ auto-trigger 14h VN hằng ngày qua cron-job.org
- DB hiện có 5 contents (Day 9: 1 + Day 10: 1 + Day 11 M3 manual: 2 + Day 11 M4 localhost test: 1)
- cron-job.org production job ACTIVE: */5 * * * * UTC, next execution every 5 min, history saved
