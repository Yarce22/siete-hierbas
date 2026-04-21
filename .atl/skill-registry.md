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

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| Global CLAUDE.md | ~/.claude/CLAUDE.md | Global conventions, personality, SDD orchestrator rules, Strict TDD enabled |

No project-level CLAUDE.md found — project scaffolding not yet done.
