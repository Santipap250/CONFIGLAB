# OBIXCONFIG LAB

FPV / Betaflight reference lab — Next.js 16 (App Router), TypeScript, Tailwind CSS v4.

## Production

🌐 Production:
https://obixconfiglab.vercel.app

🗺️ Sitemap:
https://obixconfiglab.vercel.app/sitemap.xml

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
placeholder (`https://obixconfiglab.vercel.app`) — update both to the real
production domain once you deploy.

## Copyright and Usage

© 2026 OBIX CONFIG LAB. All Rights Reserved.

The original source code, documentation, articles, FPV knowledge
content, configuration guides, tools, calculators, visual assets,
branding, logos, and other original materials created for
OBIX CONFIG LAB are protected by applicable copyright laws.

No permission is granted to copy, modify, reproduce, redistribute,
publish, sublicense, sell, or commercially reuse the original
OBIX CONFIG LAB materials without prior written permission from
the copyright holder.

This public repository is provided for transparency, reference,
and project development. Public visibility of the repository does
not by itself grant permission to reuse the original materials.

See [LICENSE](./LICENSE) for the full copyright notice.

## Security

Security vulnerabilities should be reported privately rather than
disclosed through public GitHub Issues.

See [SECURITY.md](./SECURITY.md) for the reporting policy.

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

## Hero headline + mote swarm animation
- Home hero headline changed to the requested Thai copy: "ทุกบทความ
  ทุกการตั้งค่า ทุกคำอธิบาย เพื่อให้คุณเข้าใจ FPV อย่างแท้จริง"
  (was the English "Tune your quad like you read its blackbox — precisely.")
- `components/SignalMotes.tsx` — 8 small glowing particles drifting through
  the hero with an organic, insect-like flight path (3 different curved
  keyframe paths in `globals.css`, randomized size/color/speed/delay per
  mote) — reads as "fireflies" per your request, styled in the site's own
  phosphor/amber palette rather than literal insect artwork, so it stays
  on-brand
- Pure CSS animation (`transform` + `opacity` only, no JS/canvas loop) —
  cheap on mobile, and hidden entirely under `prefers-reduced-motion`
  the same way `ScopeTrace` is

## Custom 404 page + accessibility pass
- `app/not-found.tsx` — on-brand 404 ("signal lost" framing, a small
  glitched signal-trace graphic) with quick links back into Knowledge/
  CLI/Troubleshoot/Tools instead of a dead end
- **Fixed a real mobile navigation gap:** the header nav (`Knowledge`,
  `CLI Library`, `Troubleshoot`, `Tuning`, `Tools`, `Articles`) was
  `hidden md:flex` with no mobile equivalent — on a phone there was
  genuinely no way to reach those pages from the header at all (only via
  the footer, or from Home's module grid). `components/Nav.tsx` now has an
  accessible hamburger menu below `md`: `aria-expanded`/`aria-controls` on
  the toggle, closes on route change and on `Escape`, full keyboard
  support
- Added a **skip-to-content link** (`app/layout.tsx`) — invisible until
  keyboard-focused, jumps straight to `<main id="main-content">`, standard
  practice for any site with a nav this size
- **Language marking:** the Thai Knowledge entry now carries `lang: "th"`
  in its frontmatter, applied as an actual `lang="th"` attribute on its
  heading/article/index-card so screen readers switch pronunciation
  correctly instead of reading Thai text with English rules
- **Color contrast:** checked all text/background pairs in the token
  system against WCAG AA. Everything passes — `--color-ash` on
  `--color-carbon` is 6.6:1, the tightest pairing
  (`--color-phosphor-dim` on `--color-carbon`, used for small mono
  category labels) is 5.0:1, both clear of the 4.5:1 AA minimum for
  normal text. No color changes were needed.
- `<details>`/`<summary>` (CLI Library, Troubleshooting, FAQ) were already
  keyboard-accessible natively — no img tags anywhere without alt text,
  since the site uses no raster `<img>` elements at all (icons are inline
  SVG, all currently `aria-hidden`)

**Not done as part of this pass:** a full Lighthouse/axe run — I can check
markup and contrast math from here, but an actual automated audit needs a
real browser, which this environment doesn't have. Worth running once
deployed (Chrome DevTools → Lighthouse, or the axe browser extension).

## Site-wide search
- `lib/search-index.ts` — aggregates a single flat index across every
  content source: Knowledge (8), Articles (5), CLI commands (25),
  Troubleshooting entries (15), and the 3 Tools — computed server-side at
  request time from the same data files each section already uses, so
  there's nothing to keep in sync manually
- `components/SiteSearch.tsx` — command-palette style modal, opens from
  the search button in the header **or ⌘K / Ctrl+K from anywhere on the
  site**. Live substring filtering across title/description/category as
  you type, results grouped with a type badge (Knowledge/CLI Library/
  Troubleshoot/Article/Tool)
- Full keyboard support: ↑↓ to move selection, Enter to navigate, Escape
  to close, Tab is trapped inside the dialog while open, focus returns to
  the input on open
- Previously Knowledge/CLI/Troubleshoot each had their own local filter
  with no way to search across all of them at once — this sits on top of
  those, it doesn't replace them (each section's own filter is still
  better once you're already in that section)

## New favicon from the real OBIX Config Lab logo
- Replaced the placeholder "scope reticle" favicon with your actual logo
  (brush-lettered "OBIX CONFIG LAB" wordmark), processed from the uploaded
  PNG:
  1. **Background removed** — the near-black background was detected by
     luminance and made transparent (soft edge blend, not a hard cutout,
     so brush-stroke edges stay smooth) rather than a flat color-key that
     would leave jagged edges
  2. **`app/icon.png` (32×32 favicon):** cropped to just the bold cyan
     **X** mark rather than the full wordmark — "OBIX CONFIG LAB" in full
     would be illegible at 16–32px, the X alone reads clearly at that size
  3. **`app/apple-icon.png` (180×180):** the full wordmark, centered on a
     solid carbon (`#0a0d10`) background — Apple touch icons shouldn't be
     transparent since iOS applies its own mask/shadow
  4. **`public/brand/obix-logo.png`:** the full logo, background removed
     and trimmed to its bounding box, kept as a general brand asset for
     future use (e.g. About page, footer) — not wired into any page yet
- All three PNGs are palette-quantized (same technique as the OG image
  optimization) — **384KB source → 37KB full logo, 1.3KB favicon, 5.2KB
  apple-icon**

**I couldn't visually proof these against your original artwork from
here** — the crop boundaries were found by scanning pixel opacity/column
density, not by eye. I've attached the actual output PNGs (not just the
zip) so you can check the X crop and background removal look right before
you treat this as final — flag it if the X needs to be framed differently
or if any edge fringing is visible.

## 🚩 Flagship feature: CLI Config Analyzer
The site's main differentiator — paste a Betaflight `diff all` / `dump`
and get an instant, entirely client-side analysis. Nothing like this
exists on any other Betaflight reference site.

- `lib/cli-parser.ts` — parses `set key = value` lines (ignores comments,
  mixer/aux/resource lines, anything else), then analyzes each against the
  CLI Library data:
  - **Flags** — out-of-range values (using each command's existing
    `range` field), invalid enum values, and a handful of specific
    high-value checks (low `dshot_idle_value`, `vbat_min_cell_voltage`
    outside a sane band, `dyn_notch_min_hz` ≥ `max_hz`, capped
    `motor_output_limit`)
  - **Customized from default** — vs. the CLI Library's known default,
    with a link straight to that command's entry
  - **Unchanged from default** — collapsed by default, expandable
  - **Not yet in our reference set** — anything parsed that isn't in our
    25-command CLI Library yet, shown honestly rather than guessed at
- `lib/cli-data.ts` — added `buildCliLookup()` / `slugifyCommand()` so
  individual dump keys (e.g. `p_roll`) resolve back to grouped reference
  entries (e.g. "p_pitch / p_roll / p_yaw") and their correct positional
  default
- `components/CliExplorer.tsx` — CLI Library entries now have stable
  anchor IDs and auto-open/scroll when arriving via `#anchor` — so a flag
  in the Analyzer links straight to the exact command, expanded, in the
  CLI Library
- `components/ConfigAnalyzer.tsx` — the UI: paste box, "Load example" for
  a first-touch demo without needing your own dump handy, live summary
  stats, sectioned results
- Wired in everywhere: **primary hero CTA** on Home (replaced "Enter
  Knowledge Hub" as the top action), first item in the header nav, first
  column in Footer, in the search index, in the 404 page's recovery
  links, and in `sitemap.xml`
- Explicit privacy line in the UI ("nothing you paste is uploaded or
  stored") — true, since there's no backend at all; everything runs in
  the browser

**Honest limitation:** the analyzer is only as good as the 25-command CLI
Library behind it. A real `diff all` will contain far more settings than
that — those show up honestly in "not yet in our reference set" rather
than pretending to judge them. Growing the CLI Library directly grows
what the Analyzer can catch.

## 🌐 Full i18n — English & Thai
Complete bilingual implementation, per your call on both open questions:
**locale-prefixed URLs for everything** (`/en/...`, `/th/...`, with 308
redirects from the old bare URLs to preserve indexed SEO) and **full
content translation done now**, not gradually.

### Routing
- Every route moved under `app/[locale]/...` — `app/[locale]/layout.tsx`
  is now the true root layout (renders `<html lang={locale}>`); there is
  no `app/layout.tsx` anymore (standard pattern for App Router i18n)
- `middleware.ts` — any bare path (`/knowledge`, already indexed by
  Google) permanently redirects (308) to `/en/knowledge`. Metadata/asset
  routes (`robots.txt`, `sitemap.xml`, `icon.png`, `apple-icon.png`,
  `opengraph-image`) are explicitly excluded and stay unprefixed
- `components/LocaleSwitcher.tsx` — EN/TH toggle in the header, swaps the
  locale segment of the current path

### Content — fully translated, both directions
- `content/en/` and `content/th/` now each have all **9 Knowledge** entries
  and all **5 Articles** — including a new **English translation of the
  EP1 Noise article** (previously Thai-only) and **8 new Thai translations**
  of everything that was English-only before
- `lib/content.ts` — `getAllKnowledge(locale)` / `getAllArticles(locale)`
  etc. now take a locale and read from the matching folder
- `lib/cli-data.ts` — all **25 CLI commands** restructured with bilingual
  `description` and `category` fields; `getCliCommands(locale)` resolves
  them. `buildCliLookup(locale)` also updated
- `lib/troubleshoot-data.ts` — all **15 entries** (symptom/causes/fix)
  fully bilingual; `getTroubleshootEntries(locale)`
- `lib/cli-parser.ts` — the Config Analyzer's flag messages (out-of-range,
  low idle value, vbat warnings, etc.) are now generated per-locale too,
  not just the static UI around them

### UI chrome
- `lib/i18n/dictionaries/en.ts` + `th.ts` — one dictionary per locale,
  `th.ts` is type-checked against `en.ts`'s exact shape (`satisfies`) so a
  missing translation key is a compile error, not a silent English
  fallback
- Every component and page that had user-facing text now takes a `dict`
  prop: Nav, Footer, SiteSearch, CliExplorer, TroubleshootExplorer,
  ConfigAnalyzer, all three calculators, and all 15 page files
- `app/sitemap.ts` — emits both locale variants for every static route
  plus every Knowledge/Article slug (140 URLs total across both locales)

### Known simplifications (explicit choices, not oversights)
- **Changelog entries** stay English-only in both locales — it's a
  developer-facing project history log, not user tutorial content
- **OG image** (`app/opengraph-image.tsx`) is shared across both locales
  rather than duplicated — same reasoning, low value for the extra work
- **In-locale `not-found.tsx`** defaults to English strings — Next.js
  doesn't pass the `[locale]` param into `not-found.tsx` by convention,
  so it can't read which locale it's under. A `/th/nonexistent-page` will
  show an English-labeled 404. Fixable later with a small workaround if
  it matters enough to you.
- **`metadataBase`** now lives in `app/[locale]/layout.tsx`'s
  `generateMetadata` (was in the old root layout) — still points to
  `https://labfpv.vercel.app`

### Build verification
Full production build passes cleanly — 65 static pages generated (every
route × 2 locales), confirmed live: middleware redirects, both locale
homepages, CLI anchor deep-linking, Thai MDX rendering, and the new
English EP1 translation all tested against a running server, not just
`next build` succeeding.

**Given how much of the codebase this touched, this delivery is the full
project zip, not a file-delta** — a delta would be impractical to apply
by hand given how many files moved directories entirely.

## OG image redesign — v2
Replaced the minimal text-only OG image with a richer, poster-style
version, based on a reference design you provided:
- Uses the **real OBIX Config Lab brush logo** (`public/brand/obix-logo.png`),
  embedded directly into the generated image (loaded as base64, same
  technique as the font loading)
- **CLI Config Analyzer mockup panel** on the right — styled like the
  real tool's actual output (status pills, mono command names, a
  decorative sparkline), not a generic screenshot
- Feature tag row now includes **Config Analyzer** alongside the other
  five sections
- Domain footer updated to `obixconfiglab.vercel.app`

**Two things deliberately left out of the reference design, on purpose:**
- **No "10,000+ pilots" stat or testimonial quote** — those numbers
  aren't real, and I don't fabricate user counts or quotes to make a
  product look more popular than it is
- **No QR code** — an OG image is a link-preview thumbnail inside a feed
  post, not something a person holds up and scans; it doesn't serve a
  function there

**Bug found and fixed along the way:** the Thai tagline initially
rendered as tofu boxes (□□□) — none of the previously-loaded fonts
(Space Grotesk, IBM Plex Mono) have Thai glyph coverage. Added
`@fontsource/ibm-plex-sans-thai` (same type family as the mono font, for
visual consistency), bundled two weights into `assets/fonts/` the same
way the other fonts are, and pointed the two Thai text blocks at it.
Verified by actually rendering and viewing the output, not just a
successful build.

File size after the postbuild compression pass: ~48.5KB (was ~18.6KB for
the simpler v1 — the logo image and extra panel add real weight, but
it's still light for a 1200×630 PNG).

## Motor Sound Analyzer
The second flagship idea from the brainstorm (Config Analyzer was #1) —
`/tools/motor-sound`. Real, working microphone-based FFT tool, not a mockup:

- `components/MotorSoundAnalyzer.tsx` — `getUserMedia` → `AudioContext` →
  `AnalyserNode` (8192-point FFT) → live canvas spectrum (20Hz–2000Hz),
  amber-highlighted dominant peak, exponentially-smoothed peak readout so
  it doesn't flicker every frame, a signal-level meter, and an optional
  blade-count input that converts the peak into an estimated RPM **if**
  that peak is blade-pass frequency
- Full permission-state handling: idle → requesting → listening, plus
  explicit `denied` / `unsupported` (no Web Audio API) / `error` (non-HTTPS)
  states, each with its own message — not just a generic failure
- Mic stream and `AudioContext` are properly torn down on Stop / unmount
  (`getTracks().forEach(stop)`, `audioCtx.close()`) — doesn't leave the mic
  hot in the background
- **Accuracy is stated honestly in the tool itself**, not just in this
  README: a detected peak could be blade-pass frequency, motor electrical
  frequency, or frame resonance — not automatically one specific thing.
  Framed explicitly as a diagnostic aid, not a lab instrument, matching
  the "rule-of-thumb, not a measurement" voice used everywhere else on
  the site (Filter Range Helper, etc.)
- Privacy line: audio is processed on-device in real time, nothing is
  recorded/saved/uploaded — true, since there's no backend at all
- Wired into: Tools index (4th tool), search index (both locales),
  sitemap, full EN/TH dictionary coverage

**What I couldn't verify from here:** actual audio input — this sandbox
has no microphone. The Web Audio API code follows the standard, correct
pattern (this isn't experimental API usage), and the build/render/locale
checks all passed, but you're the first real test with an actual spinning
motor. If the peak detection feels too jumpy or too smoothed, the
`PEAK_SMOOTHING` constant at the top of the component (currently `0.85`)
is the one number to tune.

## Advanced Tuning EP2
Second entry in the "Advanced Tuning" Knowledge Hub category (`order: 10`,
right after EP1's `order: 9`) — "Where does noise actually come from in
an FPV drone." Walks through the 5 real-world noise sources (ESC/motor,
wire routing, rigid FC mounting, props/frame, VTX) and cross-links to
*Motor & ESC Basics* and *Understanding Gyro & D-term Filters*.

Unlike EP1 (which launched Thai-only and got an English translation
later), **EP2 shipped bilingual from the start** —
`content/th/knowledge/advanced-tuning-ep2-where-noise-comes-from.mdx` and
the matching `content/en/...` file went in together. No code changes
needed — it just showed up in the Knowledge Hub, search index, and
sitemap automatically once the two `.mdx` files existed, same as every
other content addition on this site.

## Commands
```
npm install
npm run dev
npm run build
```
