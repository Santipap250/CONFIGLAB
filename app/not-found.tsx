import Link from "next/link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

const QUICK_LINKS = [
  { href: `/${DEFAULT_LOCALE}/analyzer`, labelKey: "analyzer" },
  { href: `/${DEFAULT_LOCALE}/knowledge`, labelKey: "knowledge" },
  { href: `/${DEFAULT_LOCALE}/cli`, labelKey: "cli" },
  { href: `/${DEFAULT_LOCALE}/troubleshoot`, labelKey: "troubleshoot" },
] as const;

export default function NotFound() {
  const dict = getDictionary(DEFAULT_LOCALE);
  const t = dict.notFound;

  return (
    <main id="main-content" className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center px-5 py-24 text-center">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-[color:var(--color-signal-amber)]">
        {t.badge}
      </p>

      <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        {t.title}
      </h1>
      <p className="mt-4 max-w-md text-[color:var(--color-ash)]">{t.subtitle}</p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {QUICK_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-sm border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] px-4 py-2 font-[family-name:var(--font-mono)] text-[13px] text-[color:var(--color-paper)] transition-colors hover:border-[color:var(--color-phosphor-dim)] hover:text-[color:var(--color-phosphor)]"
          >
            {t.links.find((l) => l.key === item.labelKey)?.label ?? item.labelKey}
          </Link>
        ))}
      </div>

      <Link
        href={`/${DEFAULT_LOCALE}`}
        className="mt-8 font-[family-name:var(--font-mono)] text-[13px] text-[color:var(--color-phosphor)]"
      >
        {t.backHome}
      </Link>
    </main>
  );
}
