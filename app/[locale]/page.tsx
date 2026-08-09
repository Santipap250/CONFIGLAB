import Link from "next/link";
import ScopeTrace from "@/components/ScopeTrace";
import SignalMotes from "@/components/SignalMotes";
import FacebookConnect from "@/components/FacebookConnect";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { withLocale, isLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

const MODULE_HREFS = ["/analyzer", "/knowledge", "/cli", "/troubleshoot", "/tuning", "/tools", "/articles"];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const t = dict.home;

  const modules = t.modules.map((m, i) => ({ ...m, href: MODULE_HREFS[i], featured: i === 0 }));

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[color:var(--color-carbon-line)]">
        <div className="bg-lab-grid pointer-events-none absolute inset-0" />
        <ScopeTrace />
        <SignalMotes />
        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-28 md:pt-36">
          <p className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.3em] text-[color:var(--color-phosphor)]">
            {t.badge}
          </p>
          <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.08] text-[color:var(--color-paper)] text-glow md:text-6xl">
            {t.headlineLine1}
            <span className="text-[color:var(--color-phosphor)]"> {t.headlineLine2}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--color-ash)] md:text-lg">
            {t.sub}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href={withLocale(locale, "/analyzer")}
              className="rounded-sm bg-[color:var(--color-signal-amber)] px-5 py-3 font-[family-name:var(--font-mono)] text-[13px] font-medium text-[color:var(--color-carbon)] transition-opacity hover:opacity-90"
            >
              {t.ctaPrimary}
            </Link>
            <Link
              href={withLocale(locale, "/knowledge")}
              className="rounded-sm border border-[color:var(--color-carbon-line)] px-5 py-3 font-[family-name:var(--font-mono)] text-[13px] text-[color:var(--color-paper)] transition-colors hover:border-[color:var(--color-phosphor-dim)]"
            >
              {t.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Module grid */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
          {t.channelsBadge}
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-[color:var(--color-paper)] md:text-3xl">
          {t.channelsTitle}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <Link
              key={m.href}
              href={withLocale(locale, m.href)}
              className={`group relative overflow-hidden rounded-md border p-6 transition-colors ${
                m.featured
                  ? "border-[color:var(--color-signal-amber)] bg-[color:var(--color-carbon-raised)] shadow-[0_0_30px_-10px_var(--color-signal-amber)] sm:col-span-2 lg:col-span-3"
                  : "border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] hover:border-[color:var(--color-phosphor-dim)]"
              }`}
            >
              <span
                className={`font-[family-name:var(--font-mono)] text-[11px] tracking-[0.2em] ${
                  m.featured ? "text-[color:var(--color-signal-amber)]" : "text-[color:var(--color-phosphor)]"
                }`}
              >
                {m.ch}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--color-paper)]">
                {m.title}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[color:var(--color-ash)]">{m.desc}</p>
              <span
                className={`mt-4 inline-block font-[family-name:var(--font-mono)] text-[12px] opacity-0 transition-opacity group-hover:opacity-100 ${
                  m.featured ? "text-[color:var(--color-signal-amber)]" : "text-[color:var(--color-phosphor)]"
                }`}
              >
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
          {t.whyBadge}
        </p>
        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3">
          {t.values.map((v) => (
            <div key={v.title}>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--color-paper)]">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ash)]">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="signal-rule mx-auto max-w-6xl" />

      {/* Stay connected */}
      <section className="mx-auto max-w-6xl px-5 py-20 text-center">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
          {t.stayBadge}
        </p>
        <h2 className="mx-auto mt-3 max-w-md font-[family-name:var(--font-display)] text-2xl font-semibold text-[color:var(--color-paper)] md:text-3xl">
          {t.stayTitle}
        </h2>
        <div className="mt-9 flex justify-center">
          <FacebookConnect />
        </div>
        <p className="mt-6 font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)]">
          {dict.footer.builtBy}{" "}
          <a
            href="https://www.facebook.com/santipab.songkarak"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--color-phosphor-dim)] transition-colors hover:text-[color:var(--color-phosphor)]"
          >
            Santipab Songkarak
          </a>
        </p>
      </section>
    </div>
  );
}
