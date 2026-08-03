import ConfigAnalyzer from "@/components/ConfigAnalyzer";

export const metadata = {
  title: "CLI Config Analyzer — OBIXCONFIG LAB",
  description:
    "Paste your Betaflight diff all output and get an instant analysis — flagged settings, what's customized from default, cross-linked to the CLI Library.",
};

export default function AnalyzerPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-signal-amber)]">
        Flagship
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        CLI Config Analyzer
      </h1>
      <p className="mt-4 max-w-xl text-[color:var(--color-ash)]">
        Paste your <code className="text-[color:var(--color-phosphor)]">diff all</code> — get an
        instant read on what&apos;s customized, what might be risky, and what each setting
        actually does.
      </p>

      <div className="mt-10">
        <ConfigAnalyzer />
      </div>
    </div>
  );
}
