import Link from "next/link";

const TOOLS = [
  {
    href: "/tools/battery",
    title: "Battery & Flight Time",
    desc: "Estimate flight time and continuous-current headroom from capacity, C-rating, and cell count.",
  },
  {
    href: "/tools/rates",
    title: "Rates Visualizer",
    desc: "See the stick-to-rotation-rate curve shaped by RC Rate, Super Rate, and Expo.",
  },
  {
    href: "/tools/filters",
    title: "Dynamic Notch Range Helper",
    desc: "Get a starting dyn_notch_min_hz / max_hz range from motor KV and cell count.",
  },
];

export const metadata = {
  title: "Tools & Calculators — OBIXCONFIG LAB",
  description:
    "Prop, motor, and battery math, rates visualizers, and filter calculators — instruments, not just articles.",
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        CH5
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        Tools &amp; Calculators
      </h1>
      <p className="mt-4 max-w-xl text-[color:var(--color-ash)]">
        Instruments, not just articles — run your own numbers.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-6 transition-colors hover:border-[color:var(--color-phosphor-dim)]"
          >
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--color-paper)]">
              {t.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ash)]">
              {t.desc}
            </p>
            <span className="mt-4 inline-block font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)] opacity-0 transition-opacity group-hover:opacity-100">
              open →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
