import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllArticles, getArticleBySlug } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { withLocale, isLocale, LOCALES, type Locale } from "@/lib/i18n/locales";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getAllArticles(locale).map((e) => ({ locale, slug: e.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const entry = getArticleBySlug(locale, slug);
  if (!entry) return {};
  return { title: `${entry.title} — ${getDictionary(locale).meta.siteName}`, description: entry.description };
}

export default async function ArticleEntryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const entry = getArticleBySlug(locale, slug);
  if (!entry) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <Link
        href={withLocale(locale, "/articles")}
        className="font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)]"
      >
        {dict.articlesDetail.back}
      </Link>

      <p className="mt-6 font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)]">
        {new Date(entry.date).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        {entry.title}
      </h1>
      {entry.tags && (
        <div className="mt-4 flex gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-sm border border-[color:var(--color-carbon-line)] px-2 py-1 font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-phosphor-dim)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="signal-rule my-10" />

      <article className="prose prose-invert max-w-none prose-headings:font-[family-name:var(--font-display)] prose-a:text-[color:var(--color-phosphor)] prose-strong:text-[color:var(--color-paper)]">
        <MDXRemote source={entry.content} />
      </article>
    </div>
  );
}
