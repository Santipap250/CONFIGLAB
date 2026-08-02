import { CLI_COMMANDS } from "@/lib/cli-data";
import CliExplorer from "@/components/CliExplorer";

export const metadata = {
  title: "CLI Library — OBIXCONFIG LAB",
  description:
    "Every core Betaflight CLI command, searchable, with defaults, ranges, and what actually changes when you touch it.",
};

export default function CliPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        CH2
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        CLI Library
      </h1>
      <p className="mt-4 max-w-xl text-[color:var(--color-ash)]">
        Search or filter by category. Tap a command to see its type, default,
        and valid range.
      </p>

      <div className="mt-10">
        <CliExplorer commands={CLI_COMMANDS} />
      </div>
    </div>
  );
}
