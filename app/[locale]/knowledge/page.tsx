import Link from "next/link";
import Image from "next/image";
import { getAllKnowledge } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { withLocale, isLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dict = getDictionary(locale);
  return {
    title: `${dict.knowledgeIndex.title} — ${dict.meta.siteName}`,
    description: dict.knowledgeIndex.subtitle,
  };
}

export default async function KnowledgePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const t = dict.knowledgeIndex;

  const entries = getAllKnowledge(locale);
  const categories = Array.from(new Set(entries.map((e) => e.category)));

  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        {t.badge}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        {t.title}
      </h1>
      <p className="mt-4 max-w-xl text-[color:var(--color-ash)]">{t.subtitle}</p>

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
                  href={withLocale(locale, `/knowledge/${e.slug}`)}
                  className="group overflow-hidden rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] transition-colors hover:border-[color:var(--color-phosphor-dim)]"
                >
                  {e.coverImage && (
                    <div className="relative aspect-[1200/630] w-full overflow-hidden border-b border-[color:var(--color-carbon-line)]">
                      <Image
                        src={e.coverImage}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--color-paper)]">
                      {e.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ash)]">
                      {e.description}
                    </p>
                    <span className="mt-4 inline-block font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)] opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
