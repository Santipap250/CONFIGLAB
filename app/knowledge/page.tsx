import Link from "next/link";
import { getAllKnowledge } from "@/lib/content";

export const metadata = {
  title: "Knowledge Hub — OBIXCONFIG LAB",
  description:
    "Core FPV and Betaflight concepts, explained precisely: PID, filters, motors, radio link.",
};

export default function KnowledgePage() {
  const entries = getAllKnowledge();
  const categories = Array.from(new Set(entries.map((e) => e.category)));

  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        CH1
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        Knowledge Hub
      </h1>
      <p className="mt-4 max-w-xl text-[color:var(--color-ash)]">
        Core concepts explained precisely, without the forum noise. Start
        with Fundamentals if you&apos;re new to tuning.
      </p>

      {categories.map((cat) => (
        <section key={cat} className="mt-14">
          <h2 className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.2em] text-[color:var(--color-phosphor)]">
            {cat}
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {entries
              .filter((e) => e.category === cat)
              .map((e) => (
                <Link
                  key={e.slug}
                  href={`/knowledge/${e.slug}`}
                  lang={e.lang}
                  className="group rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-6 transition-colors hover:border-[color:var(--color-phosphor-dim)]"
                >
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--color-paper)]">
                    {e.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ash)]">
                    {e.description}
                  </p>
                  <span className="mt-4 inline-block font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)] opacity-0 transition-opacity group-hover:opacity-100">
                    read →
                  </span>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
