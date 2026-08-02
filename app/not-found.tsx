import Link from "next/link";

const REDISCOVER = [
  { href: "/knowledge", label: "Knowledge Hub" },
  { href: "/cli", label: "CLI Library" },
  { href: "/troubleshoot", label: "Troubleshooting Center" },
  { href: "/tools", label: "Tools & Calculators" },
];

export const metadata = {
  title: "Signal Lost — OBIXCONFIG LAB",
  description: "This page doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center px-5 py-24 text-center">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-[color:var(--color-signal-amber)]">
        404 — no signal
      </p>

      <div className="relative mt-6 h-20 w-full max-w-xs">
        <svg viewBox="0 0 320 80" className="h-full w-full" aria-hidden="true">
          <line x1="0" y1="40" x2="320" y2="40" stroke="var(--color-carbon-line)" strokeWidth="1" />
          <path
            d="M0 40 L60 40 L75 12 L95 68 L115 40 L320 40"
            fill="none"
            stroke="var(--color-signal-amber)"
            strokeWidth="2"
          />
        </svg>
      </div>

      <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        This page dropped off the link
      </h1>
      <p className="mt-4 max-w-md text-[color:var(--color-ash)]">
        Whatever you were looking for isn&apos;t at this address — moved,
        renamed, or it never existed. Try one of these instead.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {REDISCOVER.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="rounded-sm border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] px-4 py-2 font-[family-name:var(--font-mono)] text-[13px] text-[color:var(--color-paper)] transition-colors hover:border-[color:var(--color-phosphor-dim)] hover:text-[color:var(--color-phosphor)]"
          >
            {r.label}
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="mt-8 font-[family-name:var(--font-mono)] text-[13px] text-[color:var(--color-phosphor)]"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
