import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllKnowledge, getKnowledgeBySlug } from "@/lib/content";

export function generateStaticParams() {
  return getAllKnowledge().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getKnowledgeBySlug(slug);
  if (!entry) return {};
  return { title: `${entry.title} — OBIXCONFIG LAB`, description: entry.description };
}

export default async function KnowledgeEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getKnowledgeBySlug(slug);
  if (!entry) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <Link
        href="/knowledge"
        className="font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)]"
      >
        ← Knowledge Hub
      </Link>

      <p className="mt-6 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-phosphor-dim)]">
        {entry.category}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        {entry.title}
      </h1>

      <div className="signal-rule my-10" />

      <article className="prose prose-invert max-w-none prose-headings:font-[family-name:var(--font-display)] prose-a:text-[color:var(--color-phosphor)] prose-strong:text-[color:var(--color-paper)]">
        <MDXRemote source={entry.content} />
      </article>
    </div>
  );
}
