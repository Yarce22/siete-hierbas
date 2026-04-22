# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `~/.claude/skills/_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Writing Go tests, using teatest, adding test coverage | go-testing | ~/.claude/skills/go-testing/SKILL.md |
| "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" | judgment-day | ~/.claude/skills/judgment-day/SKILL.md |
| Creating a pull request, opening a PR, preparing changes for review | branch-pr | ~/.claude/skills/branch-pr/SKILL.md |
| Creating a GitHub issue, reporting a bug, requesting a feature | issue-creation | ~/.claude/skills/issue-creation/SKILL.md |

## Project Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Building web components, pages, artifacts, posters, or applications (UI/styling) | frontend-design | .claude/.agents/skills/frontend-design/SKILL.md |
| Writing, reviewing, or refactoring Next.js code | next-best-practices | .claude/.agents/skills/next-best-practices/SKILL.md |
| React components, Next.js pages, data fetching, bundle optimization, performance improvements | vercel-react-best-practices | .claude/.agents/skills/vercel-react-best-practices/SKILL.md |
| "review my UI", "check accessibility", "audit design", "review UX", "check my site" | web-design-guidelines | .claude/.agents/skills/web-design-guidelines/SKILL.md |
| UI/UX design, color palettes, typography, design systems, design tokens, style guides, design intelligence | ui-ux-pro-max | .claude/.agents/skills/ui-ux-pro-max |
| Creating new AI skills, adding agent instructions, documenting patterns for AI | skill-creator | .claude/.agents/skills/skill-creator/SKILL.md |
| Marketing copy, product descriptions, landing page text | copywriting | .claude/.agents/skills/copywriting/SKILL.md |
| Browser automation, navigating pages, filling forms, taking screenshots, testing web apps | agent-browser | .claude/.agents/skills/agent-browser/SKILL.md |
| Finding, discovering, or installing new agent skills | find-skills | .claude/.agents/skills/find-skills/SKILL.md |
| Remotion video creation, React-based animations, compositions | remotion-best-practices | .claude/.agents/skills/remotion-best-practices/SKILL.md |
| Creating a git commit at end of session or on request | caveman-commit | .claude/.agents/skills/caveman-commit/SKILL.md |
| Supabase SDK usage, auth, RLS helpers, storage, realtime, edge functions | supabase | .claude/.agents/skills/supabase/SKILL.md |
| PostgreSQL schema design, RLS policies, migrations, triggers, indexes on Supabase | supabase-postgres-best-practices | .claude/.agents/skills/supabase-postgres-best-practices/SKILL.md |
| Open-ended exploration, design decisions, comparing approaches before implementing | brainstorming | .claude/.agents/skills/brainstorming/SKILL.md |
| Fetching up-to-date library/framework docs by ID (e.g. `/vercel/next.js`) | context7 | .claude/.agents/skills/context7/SKILL.md |
| "security review", "audit code for vulnerabilities", "check for injection/XSS/auth issues" | security-review | .claude/.agents/skills/security-review/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### go-testing
- Use table-driven tests: `[]struct{name, input, expected, wantErr}` with `t.Run(tc.name, ...)`
- Golden files for complex outputs → `testdata/` directory
- Use `teatest` for Bubbletea TUI testing
- Use `t.Parallel()` for independent subtests
- Never use global mutable state in tests — use function-scoped helpers

### judgment-day
- Launch TWO blind judge sub-agents in parallel via delegate (async, never sequential)
- Each judge receives same target + same criteria, works independently — no cross-contamination
- Synthesize verdicts: critical (must fix) / warning (should fix) / suggestion
- Run Fix Agent for critical issues only, then re-judge (max 2 iterations)
- Never review yourself — orchestrator role is coordination only

### branch-pr
- Every PR MUST link an approved issue (`status:approved` label) — no exceptions
- Branch naming MUST match: `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$`
- Exactly one `type:*` label per PR
- Run shellcheck on modified scripts before opening PR
- Use conventional commits only

### issue-creation
- MUST use a template (bug report or feature request) — blank issues are disabled
- Issues auto-get `status:needs-review`; maintainer MUST add `status:approved` before any PR
- Search for duplicates before creating
- Questions go to Discussions, not issues

### skill-creator
- Skills go in `skills/{skill-name}/SKILL.md` with frontmatter: name, description, license, metadata
- description MUST include "Trigger:" line for registry auto-detection
- Keep SKILL.md under 200 lines — read at runtime, not by humans
- Compact rules: 5-15 lines, actionable only (no motivation, no full examples)

### next-best-practices
- RSC by default; `'use client'` only for interactivity, hooks, or browser APIs
- Never make RSC async client components — invalid pattern
- `params` and `searchParams` are async in Next.js 15+ — always await
- Avoid data waterfalls: use `Promise.all()` for independent fetches, Suspense for streaming
- Import directly from source — avoid barrel file imports (bundle size)
- Default to Node.js runtime; Edge only for low-latency geo/auth needs
- Error boundaries: `error.tsx`, `global-error.tsx`, `not-found.tsx`
- Use `generateMetadata` for dynamic metadata, export `metadata` object for static

### vercel-react-best-practices
- `Promise.all()` for independent async operations — eliminate waterfalls (CRITICAL)
- Import directly from source, never from barrel files — reduces bundle size (CRITICAL)
- Use `next/dynamic` for heavy components not needed on initial render
- `React.cache()` for per-request deduplication in RSC
- Minimize data serialized into RSC props — keep client components lean
- Use SWR for client-side data fetching with automatic deduplication
- `after()` for non-blocking post-response work (analytics, logging)
- Passive event listeners for scroll handlers

### frontend-design
- Commit to a BOLD, specific aesthetic direction before writing code — no generic AI aesthetics
- Write real, working code — no placeholders, no stubs
- Understand purpose, tone, and audience before designing
- Implement complete CSS/styling (never leave as TODO)

### web-design-guidelines
- Review files for Web Interface Guidelines compliance
- Checks: accessibility, visual hierarchy, spacing, typography, contrast
- Triggered by: "review my UI", "check accessibility", "audit design", "review UX"

### copywriting
- Write marketing copy targeted to the defined audience and tone
- Adapt voice: formal, conversational, or persuasive based on context
- Focus on benefits, not features

### agent-browser
- Use `agent-browser` CLI for all browser automation tasks
- Prefer over built-in browser tools or custom Playwright scripts
- Available for web testing, form filling, screenshots, scraping, and Electron apps

### ui-ux-pro-max
- Use for design intelligence: color palettes, typography, UI styles, design systems, UX guidelines
- Supports 10+ stacks: React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, HTML/CSS
- Covers 161+ product types, 99 UX guidelines, 25 chart types, 50+ styles
- Use `python3 src/ui-ux-pro-max/scripts/search.py` for querying design data
- Available domains: product, style, typography, color, landing, chart, ux
- Command: `python3 src/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain> --stack <stack>`

### caveman-commit
- Use Conventional Commits format: `<type>(<scope>): <subject>` — types: feat, fix, chore, docs, style, refactor, perf, test, build, ci, revert
- Subject in imperative present ("add", not "added"), lowercase, no trailing period, <72 chars
- NEVER add "Co-Authored-By" or AI attribution (global user rule)
- Group by scope if many unrelated changes — ask user before splitting into multiple commits
- Body explains WHY, not WHAT (diff shows what) — optional for simple changes
- Run at end of session: stage relevant files (not `-A`), draft message, confirm with user before commit

### supabase
- Use `@supabase/ssr` (`createBrowserClient` / `createServerClient`) for Next.js — NEVER the legacy `@supabase/auth-helpers-nextjs`
- Server client MUST use `cookies()` from `next/headers` with `getAll/setAll` pattern; wrap `setAll` in try/catch for RSC contexts
- Always type the client: `createClient<Database>(...)` using generated types from `src/types/supabase.ts`
- Regenerate types after EVERY schema change: `pnpm dlx supabase gen types typescript --project-id <id> > src/types/supabase.ts`
- Use service role key ONLY on server (Route Handlers, Server Actions) — never expose to browser
- Realtime: subscribe via `supabase.channel()` in client components; always unsubscribe in cleanup
- Storage: use signed URLs for private buckets; public URLs only for truly public assets

### supabase-postgres-best-practices
- Enable RLS on EVERY table — no exceptions. Public tables still need explicit `for select using (true)` policy
- Use `security definer` + `set search_path = ''` on helper functions that query RLS-protected tables (avoids recursion)
- Use `auth.uid()` inside policies — never pass user IDs from the client
- Separate policies by action (select / insert / update / delete) — clearer than combining
- PKs: `uuid default gen_random_uuid()` for public-facing entities; `bigint generated always as identity` for monotonic counters
- Money in integer (smallest unit) — never float. For COP, store pesos directly (no centavos)
- Soft delete with `deleted_at timestamptz` — filter in views or RLS, never hard delete audit-critical data
- Triggers for `updated_at` and audit logging; keep trigger functions minimal and idempotent
- Indexes: on FKs, on columns used in RLS policies, on columns used in `where`/`order by`. Use partial indexes for soft-deleted filters
- Migrations are append-only after first deploy — no editing past migrations

### brainstorming
- HARD GATE: do NOT implement, scaffold, or write code until user approves a design
- Ask clarifying questions FIRST (goal, constraints, success criteria, non-goals)
- Present 2-3 options with tradeoffs — never a single "obvious" answer
- Use when user asks "how should we approach", "what do you think", "ideas for X"
- End with explicit "¿Te alineo con la opción X?" before any build action

### context7
- Use to fetch CURRENT docs for libraries/frameworks when knowledge cutoff might be stale
- Format: `resolve-library-id` first if unsure, then `get-library-docs` with ID like `/vercel/next.js`
- Best for: breaking changes, new APIs, version-specific behavior (e.g. Next 16 proxy vs middleware)
- Prefer over WebSearch for official library documentation — faster and more structured

### security-review
- Trigger on: auth flows, user input handling, DB queries, API endpoints, file uploads, env var handling
- Check OWASP top 10: injection (SQL, XSS, command), broken auth, sensitive data exposure, CSRF, SSRF
- Validate at system boundaries (user input, external APIs) — trust internal code
- RLS is not optional for multi-tenant data — verify every new table has policies
- Never log secrets, tokens, or PII; never commit `.env*` files
- Prefer parameterized queries / ORM — no string interpolation in SQL

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| Global CLAUDE.md | ~/.claude/CLAUDE.md | Global conventions, personality, SDD orchestrator rules, Strict TDD enabled |
| Project CLAUDE.md | ./CLAUDE.md | Stack (Next.js + Supabase), business rules, non-technical admin UX, Spanish domain |
| Master plan | ./.atl/planning/master-plan.md | 8 fases: scaffolding → MVP e-commerce → MVP hostal → admin → analytics → UX helpers → launch → post-launch |
| Admin UX ideas | ./.atl/planning/admin-dashboard-ideas.md | 30 ideas tiered S/A/B/C para dashboard amigable no-técnico |
| DB docs | ./docs/database.md | Schema, RLS policies, cómo aplicar migrations y generar tipos |
| Env docs | ./docs/environment.md | Variables requeridas (harness bloquea escribir .env* directamente) |

### Session-end convention
- At end of every session (before `mem_session_summary`), invoke the `caveman-commit` skill to create a conventional-commits commit summarizing the session's changes.
- Confirm the commit message with the user before executing when the session touched multiple scopes.
