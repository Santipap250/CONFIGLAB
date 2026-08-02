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

## Phase 4 (this delivery)
- `/tools` — index of 3 instruments
- `/tools/battery` — flight-time estimate + continuous-current headroom
  from capacity/C-rating/cell count, with a warning state when average draw
  is close to the pack's continuous rating
- `/tools/rates` — SVG rate-curve visualizer (RC Rate / Super Rate / Expo),
  clearly labeled as an approximation for visualizing feel, not a firmware
  replica
- `/tools/filters` — dynamic notch range helper: estimates motor RPM from
  KV + cell count and suggests a `dyn_notch_min_hz` / `max_hz` starting
  range, cross-linked to the CLI Library and the filters Knowledge article
- All three are self-contained client components (`BatteryCalculator`,
  `RatesVisualizer`, `FilterRangeHelper`) — no new dependencies

## Phase 5 (this delivery) — launch-ready
- `/about` — mission / why OBIXCONFIG LAB
- `/tuning` — 6-step ordered tuning path, cross-linked to Knowledge Hub,
  CLI Library, Tools, and Troubleshooting Center
- `/faq` — accordion FAQ + GitHub-repo contact channel (real link, no
  invented contact details)
- `/changelog` — genuine phase-by-phase log of this project's actual build
  history (Phase 1–4)
- `/resources` — links to the official Betaflight repo, Betaflight
  Configurator, and this project's own repo
- SEO: `metadataBase`, Open Graph + Twitter card defaults, `robots.txt`
  (`app/robots.ts`), and a dynamic `sitemap.xml` (`app/sitemap.ts`) that
  includes every static route plus all current Knowledge/Article MDX slugs
  automatically — new content appears in the sitemap with no manual edits

**Before deploying:** `metadataBase` and the sitemap/robots `BASE_URL` are
placeholder (`https://obixconfig-lab.vercel.app`) — update both to the real
production domain once you deploy.

## Status: all sitemap pages from the original brief are live
25 routes total, all statically pre-rendered. Every route from the Phase 0
information architecture now resolves — nothing left returning 404.

## Commands
```
npm install
npm run dev
npm run build
```
