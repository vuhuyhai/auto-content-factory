# HANDOFF - Auto-Content Factory

## 1. Overview

**Project:** Auto-Content Factory (ACF)
**One-liner:** SaaS giúp SMB Việt Nam tự động hoá viết content social bằng brand voice riêng.
**Owner:** Vũ Hải (Chairman VSE, CEO Ladysfit)
**Started:** 12/05/2026
**Target launch:** Tuần 4 (~09/06/2026)
**Status:** Week 1 Day 1 - Foundation setup ✅

## 2. Current State

- ✅ Cursor pack v2.0 active (CLAUDE.md + 4 rules)
- ✅ Next.js 16.2.6 + TypeScript + Tailwind + Turbopack
- ✅ Supabase Pro plan connected (region ap-southeast-1, Singapore)
- ✅ Drizzle ORM + 6 table deployed to production DB
- ✅ GitHub repo `vuhuyhai/auto-content-factory` với 3 commits
- ✅ Localhost smoke test PASS (Ready in 476ms)
- ⏳ Auth flow (Day 2-3)
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

**Commits:**
- `81a10bd` - Initial commit from Create Next App
- `b6c2bc3` - chore: add Cursor pack v2.0 and core dependencies
- `bae7638` - feat(week1-day1): add Drizzle ORM schema with 6 tables and Supabase migration

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

## 5. Known Issues

- RLS chưa enable trên 6 table (tất cả UNRESTRICTED) - sẽ enable Week 2 sau khi có Auth
- Supabase maintenance scheduled 13-14/05/2026 (Shared pooler ap-southeast-1)
- PayOS chưa setup (Week 4)
- Resend chưa verify domain (Week 3)
- Cloudflare R2 bucket `acf-assets` chưa tạo (Week 2-3)
- Domain `autocontentfactory.com` chưa point Vercel (Week 4)

## 6. Next Steps

### Day 2-3: Supabase Auth flow
- Setup Supabase Auth helpers (server + client)
- Login page với email/password + Google OAuth
- Signup page với email verification
- Middleware bảo vệ `/dashboard` route
- Profile auto-create trigger khi user signup

### Day 4: Profile auto-create trigger
- SQL function trigger trên auth.users
- Test signup flow end-to-end
- Enable RLS cho table profiles

### Day 5-7: Landing page + Pricing
- Bento Grid hero + 4 feature cards
- Pricing section 3 tier (Free/Starter/Pro)
- Footer + CTA "Đăng ký free"
- Mobile responsive audit

## 7. Context cho AI

### Stack
- Frontend: Next.js 16.2.6 App Router, TypeScript, Tailwind, shadcn/ui (sẽ add Day 5)
- Backend: Next.js API routes
- DB: Supabase Postgres + Drizzle ORM
- Auth: Supabase Auth (email + Google OAuth)
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
