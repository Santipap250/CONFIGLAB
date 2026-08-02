export const metadata = {
  title: "About — OBIXCONFIG LAB",
  description:
    "Why OBIXCONFIG LAB exists and what it's trying to be for FPV pilots.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        About
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        Read the signal, not the guesswork
      </h1>

      <div className="prose prose-invert mt-10 max-w-none prose-headings:font-[family-name:var(--font-display)] prose-a:text-[color:var(--color-phosphor)] prose-strong:text-[color:var(--color-paper)]">
        <p>
          Most FPV tuning knowledge lives scattered across forum threads,
          Discord scrollback, and half-finished wiki pages — each one
          assuming a different starting point and rarely agreeing with the
          others. OBIXCONFIG LAB exists to put that knowledge in one place,
          structured the way a pilot actually debugs a quad: symptom, cause,
          setting, verification.
        </p>

        <h2>What this is</h2>
        <p>
          A reference lab, not a blog. Every page here is built to be looked
          up fast — a CLI command, a symptom, a formula — and every
          recommendation is traceable to a concept, not a vibe. Where a
          number depends on your specific hardware, the Lab says so instead
          of pretending there&apos;s one universal setting.
        </p>

        <h2>What this isn&apos;t</h2>
        <p>
          It isn&apos;t a replacement for reading your own blackbox logs, and
          it isn&apos;t trying to be. The tools and guides here get you to a
          sensible starting point faster — the final tuning pass always
          belongs to your specific airframe.
        </p>

        <h2>Where it&apos;s going</h2>
        <p>
          OBIXCONFIG LAB is under active development. See the{" "}
          <a href="/changelog">Changelog</a> for what&apos;s shipped so far,
          and the project repository for what&apos;s next.
        </p>

        <h2>Where the knowledge comes from</h2>
        <p>
          Much of the core tuning knowledge on this site is adapted from the{" "}
          <a
            href="https://www.facebook.com/banmysanti"
            target="_blank"
            rel="noopener noreferrer"
          >
            OBIX Config Lab Facebook page
          </a>{" "}
          — the original source for this project&apos;s tuning series,
          before it was structured into a searchable reference here.
        </p>
      </div>
    </div>
  );
}
