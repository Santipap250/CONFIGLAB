import Link from "next/link";
import ScopeTrace from "@/components/ScopeTrace";
import SignalMotes from "@/components/SignalMotes";
import FacebookConnect from "@/components/FacebookConnect";

const MODULES = [
  {
    ch: "CH1",
    title: "Knowledge Hub",
    desc: "Core FPV & Betaflight concepts explained without the forum noise — PID, filters, motors, radio links.",
    href: "/knowledge",
  },
  {
    ch: "CH2",
    title: "CLI Library",
    desc: "Every Betaflight CLI command, searchable, with defaults, ranges, and what actually changes when you touch it.",
    href: "/cli",
  },
  {
    ch: "CH3",
    title: "Troubleshooting Center",
    desc: "Symptom-first diagnosis — describe what the quad is doing, get the likely cause and the fix path.",
    href: "/troubleshoot",
  },
  {
    ch: "CH4",
    title: "Tuning Guide",
    desc: "A structured tuning path from first-flight defaults to blackbox-driven filter and PID refinement.",
    href: "/tuning",
  },
  {
    ch: "CH5",
    title: "Tools & Calculators",
    desc: "Prop/motor/battery math, rates visualizers, and filter calculators — instruments, not just articles.",
    href: "/tools",
  },
  {
    ch: "CH6",
    title: "Articles & Tutorials",
    desc: "Longer-form guides and build walkthroughs for when a reference page isn't enough.",
    href: "/articles",
  },
];

const VALUES = [
  {
    title: "Read the signal, not the guesswork",
    desc: "Every recommendation is traceable to a concept or a blackbox pattern — not a vibe.",
  },
  {
    title: "Built by someone who tunes",
    desc: "Structured the way a pilot actually debugs a quad: symptom → cause → CLI change → verify.",
  },
  {
    title: "Reference-grade, not a blog",
    desc: "Fast lookups, consistent structure, no scrolling through 2000 words for one setting.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[color:var(--color-carbon-line)]">
        <div className="bg-lab-grid pointer-events-none absolute inset-0" />
        <ScopeTrace />
        <SignalMotes />
        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-28 md:pt-36">
          <p className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.3em] text-[color:var(--color-phosphor)]">
            FPV Analyzer Lab
          </p>
          <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.08] text-[color:var(--color-paper)] text-glow md:text-6xl">
            ทุกบทความ ทุกการตั้งค่า ทุกคำอธิบาย
            <span className="text-[color:var(--color-phosphor)]"> เพื่อให้คุณเข้าใจ FPV อย่างแท้จริง</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--color-ash)] md:text-lg">
            OBIXCONFIG LAB is a reference lab for Betaflight configuration and
            FPV tuning: CLI commands, troubleshooting paths, and tuning
            methodology in one signal-clean place.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/knowledge"
              className="rounded-sm bg-[color:var(--color-phosphor)] px-5 py-3 font-[family-name:var(--font-mono)] text-[13px] font-medium text-[color:var(--color-carbon)] transition-opacity hover:opacity-90"
            >
              Enter Knowledge Hub
            </Link>
            <Link
              href="/cli"
              className="rounded-sm border border-[color:var(--color-carbon-line)] px-5 py-3 font-[family-name:var(--font-mono)] text-[13px] text-[color:var(--color-paper)] transition-colors hover:border-[color:var(--color-phosphor-dim)]"
            >
              Browse CLI Library
            </Link>
          </div>
        </div>
      </section>

      {/* Module grid */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
          Signal channels
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-[color:var(--color-paper)] md:text-3xl">
          Six instruments, one lab
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="group relative overflow-hidden rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-6 transition-colors hover:border-[color:var(--color-phosphor-dim)]"
            >
              <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.2em] text-[color:var(--color-phosphor)]">
                {m.ch}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--color-paper)]">
                {m.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ash)]">
                {m.desc}
              </p>
              <span className="mt-4 inline-block font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)] opacity-0 transition-opacity group-hover:opacity-100">
                open →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="signal-rule mx-auto max-w-6xl" />

      {/* Why section */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
          Why this lab
        </p>
        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title}>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--color-paper)]">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ash)]">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="signal-rule mx-auto max-w-6xl" />

      {/* Stay connected */}
      <section className="mx-auto max-w-6xl px-5 py-20 text-center">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
          Stay in the loop
        </p>
        <h2 className="mx-auto mt-3 max-w-md font-[family-name:var(--font-display)] text-2xl font-semibold text-[color:var(--color-paper)] md:text-3xl">
          Updates, community discussion, and behind-the-scenes builds
        </h2>
        <div className="mt-9 flex justify-center">
          <FacebookConnect />
        </div>
      </section>
    </div>
  );
}
