# HANDOFF - Auto-Content Factory

## 1. Overview

**Project:** Auto-Content Factory (ACF)
**One-liner:** SaaS giúp SMB Việt Nam tự động hoá viết content social bằng brand voice riêng.
**Owner:** Vũ Hải (Chairman VSE, CEO Ladysfit)
**Started:** 12/05/2026
**Target launch:** Tuần 4 (~09/06/2026)
**Status:** Week 1 Day 15 close - Edit inline 4 field variant (hook/title/body/hashtags) qua VariantEditor 158 LOC + fetch-merge-update JSONB pattern + defense-in-depth ownership. Production deploy ce87564 READY 44s 0 error. Plan Week 2-3 chốt Profile A soft validation (3-5 paid + 10 trial, launch 09/06/2026). Day 16 START email infra Resend.

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
- ✅ Production: ✅ LIVE - https://auto-content-factory.vercel.app. Cron production ĐÊM ĐẦU TIÊN PASS - workflow Ladysfit 07:04 VN ngày 14/05/2026 auto-trigger qua cron-job.org → Vercel → Inngest → Claude → DB, content saved status=draft
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
- **Last verified:** 14/05/2026 - Day 15 close - Edit inline body variant + plan Week 2-3 chốt Profile A soft validation. Production deploy ce87564 READY 0 error.

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

- **Mobile tab "Đã từ chối" overflow cắt chữ:** Filter tabs 4 nhãn quá dài trên viewport < 380px, overflow-x-auto work nhưng UX cảm giác chật. Defer Week 2: cân nhắc bỏ count badge mobile hoặc shorten label "Từ chối" thay "Đã từ chối"
- **Filter tab transition animation thiếu:** Active border đổi instant khi click, không có sliding animation. UX acceptable nhưng có thể polish Week 3
- **Empty state messages dynamic theo filter, nhưng KHÔNG có CTA "tạo workflow":** User vào tab "Chờ duyệt" rỗng chỉ thấy "Không có content nào chờ duyệt. 🎉" - thiếu hành động đi tiếp. Defer Week 2 cùng workflow types evergreen + promotional
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
- **Sticky bottom bar che content cuối list trên mobile:** Position fixed bottom-0, content cuối có thể bị bar 60px che. Defer Week 2: thêm padding-bottom dynamic cho list khi selectedIds.size > 0
- **Bulk reject KHÔNG có confirmation dialog:** User click "Từ chối" 7 contents là apply ngay, không có "Bạn có chắc?". OK cho draft (vì có thể revert) nhưng risky khi user có > 50 contents. Defer Week 2 khi có data nhiều: thêm AlertDialog cho bulk reject > 5 items
- **Pagination KHÔNG có jump-to-page input:** Chỉ Prev/Next, không có "Trang [_] / 10" để nhảy nhanh. OK Day 14 (DB chỉ có 7 content), defer Week 3 khi có > 100 contents
- **content-list-item.tsx checkbox click area nhỏ:** Mobile tap target < 44x44px. Defer accessibility audit Week 3
- **No keyboard shortcut bulk action:** Ctrl+A select all, Esc clear selection, Cmd+Enter approve - chưa có. Defer Week 4 khi có power users

### Issues Day 15 (mới phát sinh)

- **VariantEditor parse hashtags split by space/comma KHÔNG handle hashtag chứa khoảng trắng:** Hashtag `#Tap Sau Sinh` sẽ bị split thành 3 hashtag `#Tap` + `Sau` + `Sinh`. Defer Week 3 nếu user complain. Hiện tại pattern Facebook là 1 hashtag = 1 word, KHÔNG có space → OK MVP
- **Optimistic UI KHÔNG có retry khi network fail:** Nếu Server Action throw network error, toast hiển thị "Lưu thất bại, vui lòng thử lại" và state localVariants không revert. User phải Click "Sửa nội dung" lại từ đầu. Defer Week 3 thêm retry button + auto-revert
- **KHÔNG có "Discard changes" warning khi user click "Huỷ" sau khi edit nhiều:** User edit 10 phút, click Huỷ nhầm → mất hết. Defer Week 2 thêm AlertDialog confirm

### D5 Gotchas (vẫn áp dụng)
- D5-6: Vercel Framework Preset có thể bị set "Other" - check Settings → Build and Deployment
- D5-7: Đừng dùng `vercel link` với "Pull env now: YES" khi Vercel chưa có env
- D5-8: Phải add env vào Vercel cho cả 3 environments (Production + Preview + Development)

## 6. Next Steps

### Day 16: Email infra setup (Welcome email) - Phase 1 Week 2 START

**M1-M5 (~2h):**
- **M1:** Setup Resend account + API key Production (15 phút)
- **M2:** Install SDK + env vars `RESEND_API_KEY` + `RESEND_FROM_EMAIL` (10 phút)
- **M3:** Welcome email template React Email (30 phút)
- **M4:** Trigger email sau signup verify hook `/auth/callback` (40 phút)
- **M5:** Smoke test 3 email Gmail + Yahoo + Outlook (25 phút)

**Output:** User mới đăng ký → verify email Supabase → nhận welcome email từ ACF

**Plan Week 2-3 đã chốt Profile A:**
- Phase 1 Week 2: Email infra (Day 16-17) + Bug fix + duplicate constraint (Day 18) + Workflow edit form (Day 19-20) + Polish Day 21-22
- Phase 2 Week 3: Pricing PayOS (Day 23-24) + Trial countdown (Day 25) + Bug fix round 2 (Day 26) + Landing polish (Day 27) + Soft launch (Day 28-29)
- Context: anh có 5-10 khách sẵn trial 14 ngày

### Day 14 / Week 2: High Priority

**✅ Day 13:** Workflow types evergreen + promotional

**P2 - Multi-source batch generation (~2-3h):**
- Workflow news_based có 3 nguồn RSS × 3 articles = 9 candidates per run
- Loop generate multiple content, skip article đã có (dedup theo source_url)
- Test với 2-3 RSS sources VN (TuoiTre, Dantri, CafeBiz)

**P3 PARTIAL (Day 14 M2): Bulk actions DONE. Edit inline 4 field defer Day 15.**
- ✅ Bulk approve/reject checkbox + action bar (Day 14 M2)
- ✅ Pagination /dashboard/contents song song với filter tabs (Day 14 M1)
- Edit body variant inline (textarea + save) → carry-over Day 15 M3

**P4 - Workflow edit form (reuse create form mode=edit):**
- User sửa được name/sources/schedule/type-specific config sau khi tạo

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

### Lưu ý cho chat tiếp theo

- HANDOFF.md raw URL: https://raw.githubusercontent.com/vuhuyhai/auto-content-factory/main/HANDOFF.md
- Em fetch HANDOFF đầu chat. Nếu cache cũ → cross-check git log local
- **Week 1 Day 1-15 đã commit + push:** Day 15 M3 commit `ce87564` đã push, Vercel deploy READY 44s 0 error. Production LIVE end-to-end pipeline với auto-trigger cron-job.org → Vercel → Inngest → Claude → DB. **Đêm 13→14/05/2026: cron Ladysfit tự chạy lần đầu thành công không có Vũ Hải can thiệp.**
- **Production smoke test STATUS:** Day 15 M3 đã verify localhost browser PASS. Production deploy `ce87564` READY 0 error/warning.
- Commit cuối local nên là `docs(handoff): close Day 15 - edit inline variant + plan Week 2-3 chốt Profile A`
- Day 15 DONE. Day 16 tiếp tục: Email infra Resend setup (M1-M5 ~2h). Sau Day 17 → Day 18 bug fix + duplicate constraint → Day 19-20 workflow edit form.
- Workflow Ladysfit `b01973cb` cron `0 0 * * *` UTC = 7h sáng VN, sẽ auto-trigger 7h sáng VN ngày 15/05 (đêm 14→15) và mỗi ngày sau
- DB hiện có 7 contents tại thời điểm Day 14 close (4 approved + 1 draft + 2 rejected). Day 15 chỉ edit nội dung existing, KHÔNG generate mới. Recheck Supabase MCP đầu Day 16 nếu cần count thực tế.
- 2 workflow test Day 13 (5926eb93 + d4fbdbd7) đã disable, KHÔNG auto-trigger
- cron-job.org production job ACTIVE: */5 * * * * UTC, next execution every 5 min
- **Context Week 2-3 đã chốt: Profile A soft validation, plan 14 ngày 22-30h, anh có 5-10 khách sẵn trial 14 ngày, giữ thứ tự email Day 16 → PayOS Day 23**
- cron-job.org production job ACTIVE: */5 * * * * UTC, next execution every 5 min, history saved
