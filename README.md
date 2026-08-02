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
25 routes total (26 including the OG image route), all statically
pre-rendered. Every route from the Phase 0 information architecture now
resolves — nothing left returning 404.

## Post-launch: OG image + mobile perf pass
- `app/opengraph-image.tsx` — code-generated 1200×630 social share image
  (`next/og` `ImageResponse`), on-brand with the same tokens/waveform motif
  as the hero. Auto-applies to Open Graph + Twitter card for every page
  that doesn't set its own. Fonts are bundled locally under `assets/fonts/`
  (Space Grotesk 700/500, IBM Plex Mono 500) rather than fetched at
  render time.
- `components/ScopeTrace.tsx` — mobile/battery hardening:
  - Pauses entirely when the hero scrolls off-screen (`IntersectionObserver`)
    or the tab is backgrounded (`visibilitychange`) — was previously running
    forever regardless of visibility
  - Throttled from a full 60fps RAF loop to ~30fps — halves draw/composite
    cost with no visible difference for a slow ambient waveform
  - DPR cap tightened to 1.5 on viewports under 768px (was 2 everywhere) —
    fewer pixels to fill on phones
  - `prefers-reduced-motion` now renders one static frame and fully stops
    the loop, instead of just skipping the next RAF call

**Note on "mobile QA":** these are the standard, well-established fixes for
this exact class of problem (always-on hero canvas). I can't run this on a
physical phone from here — worth a quick spot-check with Chrome DevTools'
mobile CPU/network throttling, or an actual device, before you call it done.

## Content expansion
- Knowledge Hub: 4 → **8** entries. Added: RPM Filtering Explained,
  Throttle PID Attenuation (TPA), Flight Modes (Angle/Horizon/Acro),
  Antenna Basics for FPV Video & Control Links
- Articles: 2 → **5**. Added: Setting Up Bidirectional DSHOT & RPM
  Filtering step-by-step, A Beginner's First Betaflight Setup Checklist,
  Understanding Blackbox Step Response Plots
- CLI Library: 18 → **25** commands. Added: gyro_lpf2_static_hz, tpa_rate,
  tpa_breakpoint, anti_gravity_gain, rc_smoothing_auto_factor,
  motor_output_limit, small_angle
- Troubleshooting Center: 10 → **15** entries. Added: tips over on takeoff,
  garbled OSD, sluggish punch-outs, vibration increase after a crash repair

All additions went through the existing system — new `.mdx` files for
Knowledge/Articles, new objects appended to the `CLI_COMMANDS` /
`TROUBLESHOOT` arrays. No page code was touched.

## Favicon / icons
- `app/icon.png` (32×32) and `app/apple-icon.png` (180×180) — a small
  on-brand "scope reticle" mark (ring + center dot + tick marks, phosphor
  cyan on carbon), generated from a single SVG source and rasterized with
  `sharp`. Replaces the default Next.js favicon that was still in place
  from scaffolding (`app/favicon.ico`, now removed).

## OG image weight optimization
Started at 86.6KB. Two passes:
1. Removed `textShadow`/`boxShadow` glow effects from the OG image JSX —
   blur/glow is the single biggest cost for PNG size (soft gradients defeat
   lossless compression). → **71.6KB**
2. Added `scripts/optimize-og-image.mjs`, wired as `postbuild` in
   `package.json` — automatically palette-quantizes the generated PNG with
   `sharp` (`{ palette: true, quality: 85 }`, pngquant-equivalent, no
   system binary needed so it works on Vercel's build image) after every
   `npm run build`. → **~18.6KB final (-73% from the original)**

No manual step required — this runs automatically every time you build or
deploy. The script only overwrites the file if the compressed version is
actually smaller, and never fails the build if something goes wrong with it.

## Facebook Page connect button
- `components/FacebookConnect.tsx` — animated pill button on the Home page
  ("Stay in the loop" section), linking to
  https://www.facebook.com/banmysanti
- Two staggered pulsing rings behind the icon (pure CSS `@keyframes
  pulse-ring` in `globals.css`, no JS/animation library) — reads as a
  signal ping, on-brand with the rest of the site rather than a generic
  social badge
- Icon uses actual Facebook blue (`#1877F2`) on a small badge for instant
  recognizability, while the button shell stays in the site's carbon/
  phosphor palette
- Hover: border and glow shift to phosphor, icon scales up slightly, arrow
  nudges — all CSS transitions, no JS
- Respects `prefers-reduced-motion` (rings simply don't render/animate)
- `lucide-react` was added as a dependency for the arrow icon (Facebook's
  own brand mark isn't in lucide's current icon set, so that one is a
  small hand-written inline SVG instead)

## First content sourced from the Facebook page
- `content/knowledge/advanced-tuning-ep1-what-is-noise.mdx` — Thai-language
  Knowledge Hub entry adapted from the "Advanced Tuning EP1: Noise" post,
  filed under a new **"Advanced Tuning"** category (your call — moved here
  from Articles), cross-linked to *Understanding Gyro & D-term Filters*
- **Language decision (per your call):** kept in Thai as-is rather than
  translated, since the rest of the site is English — the site is now
  intentionally mixed-language until proper i18n is built. Nothing extra
  was built for this yet (no locale routing/switcher) — just noting it as
  a known, deliberate state, not an oversight.
- `app/about/page.tsx` — added a "Where the knowledge comes from" section
  linking back to the source Facebook page

**When you're ready to send more FB posts**, paste the text (not just a
link — Facebook blocks automated fetching) and say which EP/topic it is;
future "Advanced Tuning" EPs can slot into this same category by giving
them the next `order` number.

## Commands
```
npm install
npm run dev
npm run build
```
