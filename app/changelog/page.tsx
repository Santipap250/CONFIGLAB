const ENTRIES = [
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
      "18-entry searchable CLI reference across 7 categories",
      "10-entry symptom-first troubleshooting index",
      "Cross-links between troubleshooting entries and Knowledge Hub",
    ],
  },
  {
    phase: "Phase 2",
    title: "Knowledge Hub & Articles",
    items: [
      "MDX-based content system — new content needs no code changes",
      "4 Knowledge Hub entries: PID basics, filters, motors/ESCs, radio link",
      "2 long-form articles: reading blackbox, choosing props",
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

export const metadata = {
  title: "Changelog — OBIXCONFIG LAB",
  description: "What's shipped so far on OBIXCONFIG LAB, by phase.",
};

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        Updates
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        Changelog
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
