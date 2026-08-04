import Link from "next/link";
import { getAllArticles } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { withLocale, isLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dict = getDictionary(locale);
  return {
    title: `${dict.articlesIndex.title} — ${dict.meta.siteName}`,
    description: dict.articlesIndex.subtitle,
  };
}

export default async function ArticlesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const t = dict.articlesIndex;
  const entries = getAllArticles(locale);

  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        {t.badge}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        {t.title}
      </h1>
      <p className="mt-4 text-[color:var(--color-ash)]">{t.subtitle}</p>

      <div className="mt-12 divide-y divide-[color:var(--color-carbon-line)]">
        {entries.map((e) => (
          <Link
            key={e.slug}
            href={withLocale(locale, `/articles/${e.slug}`)}
            className="group block py-6 first:pt-0"
          >
            <p className="font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)]">
              {new Date(e.date).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-[color:var(--color-paper)] transition-colors group-hover:text-[color:var(--color-phosphor)]">
              {e.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ash)]">{e.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
