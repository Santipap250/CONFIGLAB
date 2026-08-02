const FAQS = [
  {
    q: "Is this specific to Betaflight, or does it cover other firmware?",
    a: "OBIXCONFIG LAB focuses on Betaflight — the most widely used FPV flight controller firmware. There's no plan currently to cover other firmware in depth.",
  },
  {
    q: "Are the CLI defaults and ranges guaranteed accurate for my firmware version?",
    a: "Defaults and ranges shift slightly between Betaflight versions. Treat CLI Library values as a strong reference point, and always cross-check against `diff` output from your own flight controller for anything safety-critical.",
  },
  {
    q: "Why don't the calculators give one exact number?",
    a: "Because there isn't one — the right value depends on your specific frame, motors, props, and flying style. The tools here get you to a sensible, explained starting point rather than a false sense of precision.",
  },
  {
    q: "Can I contribute an article, CLI entry, or troubleshooting case?",
    a: "Yes — the project is open on GitHub. Open an issue or a pull request with what you'd like to add.",
  },
  {
    q: "I found something inaccurate. How do I report it?",
    a: "Open an issue on the GitHub repository with the page and what you believe is wrong — accuracy here matters more than anything else.",
  },
];

export const metadata = {
  title: "FAQ — OBIXCONFIG LAB",
  description: "Frequently asked questions and how to reach the project.",
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        Support
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        FAQ
      </h1>

      <div className="mt-12 space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] open:border-[color:var(--color-phosphor-dim)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
              <span className="font-[family-name:var(--font-display)] text-[15px] font-medium text-[color:var(--color-paper)]">
                {f.q}
              </span>
              <span className="shrink-0 font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)] transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="border-t border-[color:var(--color-carbon-line)] px-5 py-4">
              <p className="text-sm leading-relaxed text-[color:var(--color-paper)]">
                {f.a}
              </p>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-14 rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-6">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-phosphor)]">
          Still need something?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ash)]">
          Open an issue on the project&apos;s GitHub repository — that&apos;s
          the fastest way to reach the team behind OBIXCONFIG LAB.
        </p>
        <a
          href="https://github.com/Santipap250/LABFPV-"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-sm border border-[color:var(--color-phosphor-dim)] px-4 py-2 font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)] transition-colors hover:bg-[color:var(--color-phosphor)] hover:text-[color:var(--color-carbon)]"
        >
          Open GitHub repository
        </a>
      </div>
    </div>
  );
}
