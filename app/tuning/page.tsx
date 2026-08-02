import Link from "next/link";

const STEPS = [
  {
    n: "01",
    title: "Mechanical check",
    desc: "Confirm props are balanced, motors are mechanically sound, and every fastener is tight. No amount of filtering or PID tuning fixes a loose stack or a bent shaft.",
  },
  {
    n: "02",
    title: "Set the dynamic notch range",
    desc: "Estimate the notch range from motor KV and cell count, then confirm against a blackbox log.",
    link: { href: "/tools/filters", label: "Open the Filter Range Helper" },
  },
  {
    n: "03",
    title: "Set LPF cutoffs conservatively",
    desc: "Start with default gyro and D-term low-pass cutoffs. Only tighten them while watching blackbox and motor temperature — the goal is a clean trace, not a specific number.",
    link: { href: "/knowledge/gyro-dterm-filters", label: "Understanding Gyro & D-term Filters" },
  },
  {
    n: "04",
    title: "Tune P, then D, then I",
    desc: "With filters clean, raise P until the axis feels sharp without fast oscillation, add D to damp overshoot, then add I to hold against sustained disturbance like wind.",
    link: { href: "/knowledge/pid-controller-basics", label: "PID Controller Basics" },
  },
  {
    n: "05",
    title: "Shape rates to taste",
    desc: "Rates don't change how the quad flies mechanically — they change how stick input maps to rotation rate. Tune this last, once the underlying PID response feels correct.",
    link: { href: "/tools/rates", label: "Open the Rates Visualizer" },
  },
  {
    n: "06",
    title: "Verify with a real flight",
    desc: "Fly a deliberate test flight — punch-outs, direction changes, a hover — and log it. If something feels off, check the Troubleshooting Center by symptom before changing settings blindly.",
    link: { href: "/troubleshoot", label: "Open the Troubleshooting Center" },
  },
];

export const metadata = {
  title: "Tuning Guide — OBIXCONFIG LAB",
  description:
    "A structured tuning path from first-flight defaults to blackbox-driven filter and PID refinement.",
};

export default function TuningPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        CH4
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        Tuning Guide
      </h1>
      <p className="mt-4 max-w-xl text-[color:var(--color-ash)]">
        Order matters here — each step assumes the previous one is done.
        Skipping ahead usually means chasing symptoms of an earlier,
        unfixed step.
      </p>

      <ol className="mt-14 space-y-10">
        {STEPS.map((s) => (
          <li key={s.n} className="flex gap-6">
            <span className="shrink-0 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-phosphor-dim)]">
              {s.n}
            </span>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--color-paper)]">
                {s.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ash)]">
                {s.desc}
              </p>
              {s.link && (
                <Link
                  href={s.link.href}
                  className="mt-3 inline-block font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)]"
                >
                  {s.link.label} →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
