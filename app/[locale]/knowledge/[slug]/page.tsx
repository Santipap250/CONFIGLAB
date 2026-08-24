import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllKnowledge, getKnowledgeBySlug } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { withLocale, isLocale, LOCALES, type Locale } from "@/lib/i18n/locales";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getAllKnowledge(locale).map((e) => ({ locale, slug: e.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const entry = getKnowledgeBySlug(locale, slug);
  if (!entry) return {};
  return {
    title: `${entry.title} — ${getDictionary(locale).meta.siteName}`,
    description: entry.description,
    ...(entry.coverImage && { openGraph: { images: [entry.coverImage] } }),
  };
}

export default async function KnowledgeEntryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const entry = getKnowledgeBySlug(locale, slug);
  if (!entry) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <Link
        href={withLocale(locale, "/knowledge")}
        className="font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)]"
      >
        {dict.knowledgeDetail.back}
      </Link>

      <p className="mt-6 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-phosphor-dim)]">
        {entry.category}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        {entry.title}
      </h1>

      {entry.coverImage && (
        <div className="relative mt-8 aspect-[1200/630] w-full overflow-hidden rounded-md border border-[color:var(--color-carbon-line)]">
          <Image src={entry.coverImage} alt="" fill sizes="768px" className="object-cover" priority />
        </div>
      )}

      <div className="signal-rule my-10" />

      <article className="prose prose-invert max-w-none prose-headings:font-[family-name:var(--font-display)] prose-a:text-[color:var(--color-phosphor)] prose-strong:text-[color:var(--color-paper)]">
        <MDXRemote source={entry.content} />
      </article>
    </div>
  );
}
