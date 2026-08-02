import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllArticles, getArticleBySlug } from "@/lib/content";

export function generateStaticParams() {
  return getAllArticles().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getArticleBySlug(slug);
  if (!entry) return {};
  return { title: `${entry.title} — OBIXCONFIG LAB`, description: entry.description };
}

export default async function ArticleEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getArticleBySlug(slug);
  if (!entry) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <Link
        href="/articles"
        className="font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)]"
      >
        ← Articles
      </Link>

      <p className="mt-6 font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)]">
        {new Date(entry.date).toLocaleDateString("en-US", {
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
          {entry.tags.map((t) => (
            <span
              key={t}
              className="rounded-sm border border-[color:var(--color-carbon-line)] px-2 py-1 font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-phosphor-dim)]"
            >
              {t}
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
