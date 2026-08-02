import Link from "next/link";
import { getAllArticles } from "@/lib/content";

export const metadata = {
  title: "Articles & Tutorials — OBIXCONFIG LAB",
  description: "Longer-form guides and build walkthroughs.",
};

export default function ArticlesPage() {
  const entries = getAllArticles();

  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        CH6
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        Articles &amp; Tutorials
      </h1>
      <p className="mt-4 text-[color:var(--color-ash)]">
        Longer-form guides for when a reference page isn&apos;t enough.
      </p>

      <div className="mt-12 divide-y divide-[color:var(--color-carbon-line)]">
        {entries.map((e) => (
          <Link
            key={e.slug}
            href={`/articles/${e.slug}`}
            className="group block py-6 first:pt-0"
          >
            <p className="font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)]">
              {new Date(e.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-[color:var(--color-paper)] transition-colors group-hover:text-[color:var(--color-phosphor)]">
              {e.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ash)]">
              {e.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
