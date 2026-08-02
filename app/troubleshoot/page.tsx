import { TROUBLESHOOT } from "@/lib/troubleshoot-data";
import TroubleshootExplorer from "@/components/TroubleshootExplorer";

export const metadata = {
  title: "Troubleshooting Center — OBIXCONFIG LAB",
  description:
    "Symptom-first diagnosis — describe what the quad is doing, get the likely cause and the fix path.",
};

export default function TroubleshootPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-signal-amber)]">
        CH3
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        Troubleshooting Center
      </h1>
      <p className="mt-4 max-w-xl text-[color:var(--color-ash)]">
        Symptom-first: describe what the quad is doing, not what setting you
        think is wrong.
      </p>

      <div className="mt-10">
        <TroubleshootExplorer entries={TROUBLESHOOT} />
      </div>
    </div>
  );
}
