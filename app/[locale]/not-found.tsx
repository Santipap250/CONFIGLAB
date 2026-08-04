import Link from "next/link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { withLocale, type Locale } from "@/lib/i18n/locales";

const LINK_HREFS: Record<string, string> = {
  analyzer: "/analyzer",
  knowledge: "/knowledge",
  cli: "/cli",
  troubleshoot: "/troubleshoot",
};

// Note: this component can't read the [locale] param directly (Next's
// not-found convention doesn't pass route params), so it defaults to
// English. The root app/not-found.tsx (outside any locale) covers
// truly-unmatched paths that never got a locale prefix at all.
export default function NotFound() {
  const locale: Locale = "en";
  const dict = getDictionary(locale);
  const t = dict.notFound;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center px-5 py-24 text-center">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-[color:var(--color-signal-amber)]">
        {t.badge}
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
        {t.title}
      </h1>
      <p className="mt-4 max-w-md text-[color:var(--color-ash)]">{t.subtitle}</p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {t.links.map((r) => (
          <Link
            key={r.key}
            href={withLocale(locale, LINK_HREFS[r.key])}
            className="rounded-sm border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] px-4 py-2 font-[family-name:var(--font-mono)] text-[13px] text-[color:var(--color-paper)] transition-colors hover:border-[color:var(--color-phosphor-dim)] hover:text-[color:var(--color-phosphor)]"
          >
            {r.label}
          </Link>
        ))}
      </div>

      <Link
        href={withLocale(locale, "/")}
        className="mt-8 font-[family-name:var(--font-mono)] text-[13px] text-[color:var(--color-phosphor)]"
      >
        {t.backHome}
      </Link>
    </div>
  );
}
