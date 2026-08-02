# OBIXCONFIG LAB

FPV / Betaflight reference lab — Next.js 16 (App Router), TypeScript, Tailwind CSS v4.

## Phase 1 (this delivery)
- Project scaffold, design token system (`app/globals.css`)
- Self-hosted fonts via `@fontsource` (Space Grotesk / IBM Plex Mono / Inter —
  Google Fonts CDN fetch is blocked in the build sandbox, so fonts are bundled
  locally; works identically on Vercel)
- Layout shell: `Nav`, `Footer`, `HudFrame` (corner-bracket overlay)
- Signature element: `ScopeTrace` — animated blackbox-style waveform canvas
  in the hero, respects `prefers-reduced-motion`
- Home page with hero, 6-module "signal channel" grid, and value props

## Phase 2 (this delivery)
- MDX content system: `lib/content.ts` reads frontmatter + body from
  `content/knowledge/*.mdx` and `content/articles/*.mdx` via `gray-matter`
- `/knowledge` — index grouped by category, 4 real Fundamentals/Tuning/
  Hardware/Radio articles (PID basics, gyro & D-term filters, motor/ESC
  basics, radio link & failsafe)
- `/knowledge/[slug]` — MDX-rendered detail page (`next-mdx-remote/rsc`)
- `/articles` — reverse-chronological index, 2 real articles (reading a
  blackbox log, prop selection)
- `/articles/[slug]` — MDX-rendered detail page with tags
- All content routes pre-render statically at build time (`generateStaticParams`)
- Added `@tailwindcss/typography` for consistent prose styling on-brand
  (phosphor links, display-font headings)

To add new content: drop a new `.mdx` file with frontmatter into
`content/knowledge/` or `content/articles/` — no code changes needed, pages
pick it up automatically at build time.

## Phase 3 (this delivery)
- `/cli` — CLI Library: 18 real Betaflight settings across Filters, PID,
  Rates, Failsafe, Motor/ESC, Battery, Receiver (`lib/cli-data.ts`), with
  live search + category filter chips and expandable detail (type/default/range)
- `/troubleshoot` — Troubleshooting Center: 10 symptom-first entries
  (`lib/troubleshoot-data.ts`) — describe the symptom, get likely causes and
  a fix path, cross-linked to relevant Knowledge Hub articles
- Both are client-side filtered (`CliExplorer`, `TroubleshootExplorer`) —
  instant, no network round-trip — and driven entirely by the two typed data
  files, so adding a command or symptom is a one-object edit, no page changes

**Simplification vs. original sitemap:** `/cli/[command]` deep-link routes
were skipped for now — commands expand inline via `<details>` instead, which
covers the same "search + see defaults/ranges" job with less surface area.
Can add dedicated routes later if you want shareable per-command URLs.

## Not yet built (routes return 404 until their phase)
`/tuning`, `/tools`, `/about`, `/faq`, `/changelog`, `/resources` —
planned for Phase 4–5.

## Commands
```
npm install
npm run dev
npm run build
```
