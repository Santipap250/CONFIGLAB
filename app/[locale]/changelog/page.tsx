import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

// Historical dev log — kept in English for both locales (a project
// changelog is developer-facing record-keeping, not a tutorial); page
// chrome (badge/title) is still translated via the dictionary.
const ENTRIES = [
  {
    phase: "Phase 5",
    title: "i18n — English & Thai",
    items: [
      "Full locale-prefixed routing (/en, /th) with redirects from legacy URLs",
      "Every Knowledge, Article, CLI, and Troubleshoot entry translated",
      "Language switcher in the header",
    ],
  },
  {
    phase: "Phase 4",
    title: "Tools & Calculators",
    items: [
      "Battery & flight time calculator with current-headroom warning",
      "Rates visualizer (RC Rate / Super Rate / Expo curve)",
      "Dynamic notch range helper (KV + cell count → suggested Hz range)",
    ],
  },
  {
    phase: "Phase 3",
    title: "CLI Library & Troubleshooting Center",
    items: [
      "25-entry searchable CLI reference across 7 categories",
      "15-entry symptom-first troubleshooting index",
      "Cross-links between troubleshooting entries and Knowledge Hub",
    ],
  },
  {
    phase: "Phase 2",
    title: "Knowledge Hub & Articles",
    items: [
      "MDX-based content system — new content needs no code changes",
      "Knowledge Hub and long-form Articles sections launched",
    ],
  },
  {
    phase: "Phase 1",
    title: "Foundation",
    items: [
      "Next.js 16 + TypeScript + Tailwind v4 scaffold",
      "Design token system — carbon/phosphor/amber signal-lab palette",
      "Signature animated waveform hero (ScopeTrace)",
      "Nav, footer, HUD corner-bracket frame, Home page",
    ],
  },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dict = getDictionary(locale);
  return { title: `${dict.changelog.title} — ${dict.meta.siteName}` };
}

export default async function ChangelogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const dict = getDictionary(rawLocale);

  return (
    <div className="mx-auto max-w-2xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        {dict.changelog.badge}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        {dict.changelog.title}
      </h1>

      <div className="mt-14 space-y-12">
        {ENTRIES.map((e) => (
          <div key={e.phase} className="relative border-l border-[color:var(--color-carbon-line)] pl-6">
            <span className="absolute -left-[5px] top-1 h-[9px] w-[9px] rounded-full bg-[color:var(--color-phosphor)] shadow-[0_0_10px_var(--color-phosphor)]" />
            <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-phosphor)]">
              {e.phase}
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--color-paper)]">
              {e.title}
            </h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[color:var(--color-ash)]">
              {e.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
