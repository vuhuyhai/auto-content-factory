# CLAUDE.md — Project Context for AI Assistants

> **Read this file FIRST** before any work on this project.
>
> Compatible with: Cursor Agent, Claude Code CLI, Codex, OpenCode

---

## 🎯 PROJECT META

> Anh fill phần này khi clone vào project mới

```
PROJECT_NAME: Auto-Content Factory
DESCRIPTION: SaaS giúp SMB Việt Nam tự động hoá viết content social bằng brand voice riêng
TECH_STACK: Next.js 15 (App Router) + TypeScript + Tailwind + Supabase + Drizzle ORM + PayOS + Resend + Vercel
PACKAGE_MANAGER: npm
WORKING_DIRECTORY: D:\auto-content-factory
PRODUCTION_URL: https://autocontentfactory.com (chưa connect)
REPO_URL: https://github.com/vuhuyhai/auto-content-factory
SUPABASE_PROJECT_REF: fnhgtxxuudnqxxmzdpjx
ADMIN_EMAIL: fitnessviet@gmail.com
```

---

## 🛡️ HARD RULES (NEVER violate)

### Code Quality
1. **File size:** Max **200 LOC/file**. Vượt → tách ngay, không "để sau"
2. **TypeScript strict:** No `any`. Use `unknown` + type narrowing
3. **Named exports preferred** over default exports for components
4. **Functional components only** (no class components)

### Security
5. **NEVER commit `.env*.local`** — verify `.gitignore`
6. **NEVER `console.log(apiKey)`** even when debugging
7. **NEVER use `SERVICE_ROLE_KEY` on client** — server-side only
8. **NEVER read full `.env.local`** — use `Select-String -Quiet` to check field exists
9. **NEVER paste env content into output** — only confirm "field X exists"

### Workflow
10. **1 task = 1 commit** (max 30 minutes)
11. **Database-first:** migration → types → API → UI components
12. **New file BEFORE modify existing** (zero-risk first)
13. **YAGNI + KISS + DRY** — every solution honors these

---

## 📐 CODE STYLE

### TypeScript / React
```typescript
// ✅ DO
import { useState } from 'react';                    // 1. React/Next core
import { z } from 'zod';                             // 2. Third-party libs
import { Button } from '@/components/ui/button';     // 3. Internal @/ paths
import { UserCard } from './user-card';              // 4. Relative
import type { User } from '@/lib/types';             // 5. Types LAST

interface Props {                  // interface > type for objects
  user: User;
  onSelect?: (id: string) => void;
}

export function ProfileCard({ user, onSelect }: Props) {  // Named export
  // ...
}
```

### JSX text
- Smart quotes `'…'` cho UI text
- `&apos;` cho ASCII thuần
- KHÔNG dấu thẳng `'` `"` (fail lint `react/no-unescaped-entities`)

### File naming
- Files: `kebab-case.tsx` (vd: `user-profile-card.tsx`)
- Components: `PascalCase`
- Hooks: `useCamelCase`
- Functions: `camelCase` action verb
- Constants: `SCREAMING_SNAKE_CASE`

---

## 🇻🇳 VIETNAMESE UI

- **UI labels, toasts, errors:** Tiếng Việt thân thiện, không trang trọng
- **Module/brand names:** Giữ English identity
- **Server logs:** English (debug-friendly)
- **Marketing copy:** Apply StoryBrand SB7 (User = Hero, App = Guide)

```typescript
// ✅ ĐÚNG
toast.success('Đã lưu thành công!');
toast.error('Có lỗi xảy ra, vui lòng thử lại');

// ❌ SAI
toast.success('Saved successfully!');
```

---

## 🗂️ PROJECT STRUCTURE

```
<project>/
├── CLAUDE.md                  ← This file (AI context)
├── HANDOFF.md                 ← Session memory (state of truth)
├── SMOKE_TEST.md              ← Test plan (if exists)
├── .claude/                   ← ClaudeSuperKit (CLI only)
├── .claude.local/             ← Custom hooks/commands (CLI only)
├── .cursor/rules/             ← Cursor Agent rules
├── docs/                      ← Project documentation
├── plans/                     ← Implementation plans (timestamped)
└── src/                       ← Source code
```

### File responsibilities
- **CLAUDE.md** (this file) = always-on context for ANY AI assistant
- **HANDOFF.md** = current state, milestone tracking, "memory" between sessions
- **plans/YYYYMMDD-HHmm-name/** = detailed phase plans for complex features

---

## 🔄 HANDOFF SYSTEM

`HANDOFF.md` at root is **source of truth** for project state. Has 7 sections:

1. Project Overview
2. Current State (milestone N, % done)
3. Done So Far (commits + features)
4. Architecture Decisions (with reasoning)
5. Known Issues / Tech Debt
6. Next Steps (with blockers)
7. Context for AI

### Update workflow
**End of each milestone, BEFORE deploy:**
- Update HANDOFF.md (commit hashes, decisions, next steps)
- Push HANDOFF.md to repo
- Then deploy

---

## 🛠️ COMMANDS REFERENCE

### Claude Code CLI (terminal)
```bash
claude /ck:resume          # Load session context
claude /ck:vu-hai "<task>" # Apply Vũ Hải's standards
claude /ck:cook "<task>"   # Multi-agent feature build
claude /ck:plan:hard       # Deep planning
claude /ck:smoke full      # 7-phase smoke test
claude /ck:fix:hard        # Multi-agent debugging
```

### Cursor Agent (panel)
- Press `Ctrl+L` → ask in chat
- Use `@filename` to reference files
- Cursor Agent reads this CLAUDE.md automatically

### Both
- Apply rules above
- Reference HANDOFF.md for context
- Ask 1 clarifying question max before starting

---

## 🧪 TESTING & DEPLOY

### Smoke test (7-phase)
File `SMOKE_TEST.md` describes test phases. Run before every commit milestone:

```bash
# Quick (Phase 1-3, ~2 min)
claude /ck:smoke quick

# Full (Phase 1-7, ~10 min)
claude /ck:smoke full
```

### Deploy rules
- 1 deploy per milestone end (NOT mid-milestone)
- Update HANDOFF.md FIRST → smoke test pass → deploy → verify
- Never deploy `.env*.local` content

---

## 🐛 ERROR HANDLING WORKFLOW

When code breaks:
1. Read error message FIRST
2. Check git log for recent changes (`git log --oneline -5`)
3. If stuck after 3 attempts → STOP, `git checkout .`, change approach
4. Use `claude /ck:fix:hard` for multi-file debugging

### Anti-patterns to avoid
- **Two Steps Back:** fix loop where each fix breaks something else → restart
- **Demo-Quality Trap:** "looks ok" without edge case handling
- **House of Cards:** code AI made you don't understand → refactor before merge

---

## 🔧 ENVIRONMENT NOTES

### Windows-specific
- **Path Unicode (tiếng Việt):** Use junction NTFS for AI tools
- **Playwright screenshot:** Skip filename param (auto-saves to `.playwright-mcp/`)
- **PowerShell parse Vietnamese:** Use `curl` instead of `Invoke-WebRequest`
- **Check env field exists:** `Select-String -Pattern "^FIELD_NAME=" -Quiet` (NOT read full file)

### MCP tools available (Claude Desktop)
- Desktop Commander (PowerShell + filesystem)
- Playwright (browser automation)
- Supabase MCP (DB query + migrations)
- Vercel MCP (deployments + logs)

→ Prefer MCP tools over manual UI clicks (AUTOMATION-FIRST)

---

## 📚 REFERENCE FILES

When you need more context:
- **HANDOFF.md** — current project state
- **SMOKE_TEST.md** — test plan
- **.claude/agents/** — subagent definitions (CLI)
- **.claude.local/commands/** — custom slash commands (CLI)
- **.cursor/rules/** — Cursor Agent rules

---

## 🎯 BEHAVIOR EXPECTATIONS

When user gives you a task:
1. Read HANDOFF.md to understand current state
2. Check this CLAUDE.md for rules
3. Identify task complexity:
   - Simple (1 file) → direct edit
   - Medium (2-5 files) → plan steps first
   - Complex (>5 files) → suggest `/ck:plan:hard` for proper planning
4. Apply Hard Rules above WITHOUT exception
5. Report TRUTHFULLY — no hallucinated tool results
6. End with: what was done, what's next, any blockers

---

## ⚖️ DECISION FRAMEWORK

When facing trade-offs, use this hierarchy:
1. **Security** > everything (never compromise on leaks/secrets)
2. **Correctness** > speed (don't ship broken code fast)
3. **Maintainability** > cleverness (boring code that works > clever code that breaks)
4. **User experience** > developer experience (loading states, error messages matter)
5. **Now** > later (ship MVP, iterate based on feedback)

---

**Last updated:** 2026-05-12
**Maintained by:** Vũ Hải
**Pack version:** v1.0
