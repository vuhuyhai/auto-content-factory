# SMOKE TEST - Auto-Content Factory

> Run before every commit milestone. Quick (Phase 1-3, ~2 min) hoặc Full (Phase 1-7, ~10 min).

## Phase 1: Pre-flight (30s)

- [ ] `git status` clean (hoặc chỉ untracked có ý định)
- [ ] `.env.local` tồn tại, 5 biến core fill xong (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL, ANTHROPIC_API_KEY)
- [ ] `node_modules` tồn tại
- [ ] `git ls-files | Select-String "\.env"` trả về RỖNG (verify .env.local không bị track)

Verify command:
```powershell
Select-String -Path .env.local -Pattern "^(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY|DATABASE_URL|ANTHROPIC_API_KEY)=.+" -Quiet
```

→ Phải return `True`.

## Phase 2: Static check (60s)

- [ ] `npm run build` không error
- [ ] TypeScript check pass: `npx tsc --noEmit`
- [ ] Không có `console.log(apiKey)` hoặc secret leak trong code

Verify command:
```powershell
# Build production
npm run build

# Type check
npx tsc --noEmit

# Scan secret leak
Select-String -Path "src/**/*.ts","src/**/*.tsx" -Pattern "console\.log.*apiKey|console\.log.*SECRET" -Recurse
```

## Phase 3: Runtime check (60s)

- [ ] `npm run dev` chạy không error
- [ ] `http://localhost:3000` load < 3s
- [ ] Không có error đỏ trong terminal
- [ ] Browser DevTools Console: 0 error

Verify steps:
1. Chạy `npm run dev`
2. Mở browser `http://localhost:3000`
3. F12 → Console tab → check error
4. Ctrl+C stop server

## Phase 4: UI check (90s)

> Áp dụng từ Day 7 trở đi (sau khi có landing page)

- [ ] Landing page hiển thị đúng (logo, hero, pricing, footer)
- [ ] Signup/Login form hoạt động (sau Day 3)
- [ ] Dashboard load được sau login (sau Day 7)
- [ ] Mobile responsive: Chrome DevTools 375px (iPhone SE)
- [ ] Tiếng Việt hiển thị đúng dấu (không bị bể font)

## Phase 5: DB check (60s)

- [ ] Supabase Dashboard → Table Editor → thấy 6 table
- [ ] Có thể query test trên Supabase SQL Editor: `SELECT * FROM profiles LIMIT 1`
- [ ] Auth.users table có user test (sau Day 3)
- [ ] RLS enabled cho table cần bảo vệ (từ Week 2)

Verify command (Supabase SQL Editor):
```sql
-- Check 6 table exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'brands', 'workflows', 'contents', 'content_logs', 'subscriptions');
-- Expect: 6 rows
```

## Phase 6: Cleanup (30s)

- [ ] Stop dev server (Ctrl+C)
- [ ] Commit changes nếu có (`git status` → `git add . && git commit`)
- [ ] Push lên GitHub (`git push origin main`)
- [ ] Cleanup temp files nếu có (`.next/`, `dist/`, `coverage/`)

## Phase 7: Report

- [ ] Tổng kết PASS/FAIL từng phase
- [ ] Note bug discover vào HANDOFF.md (section "Known Issues")
- [ ] Update HANDOFF.md "Current State" nếu có progress mới
- [ ] Note next session continuation point

Template báo cáo:
```
SMOKE TEST RESULT - <Date> <Time>
Phase 1: PASS / FAIL
Phase 2: PASS / FAIL
Phase 3: PASS / FAIL
Phase 4: PASS / FAIL (Skip if < Day 7)
Phase 5: PASS / FAIL
Phase 6: PASS / FAIL
Phase 7: COMPLETED

Issues found: <list>
Next step: <action>
```
