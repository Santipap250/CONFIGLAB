import Link from "next/link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { withLocale, isLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

const TOOL_HREFS = ["/tools/battery", "/tools/rates", "/tools/filters"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dict = getDictionary(locale);
  return {
    title: `${dict.toolsIndex.title} — ${dict.meta.siteName}`,
    description: dict.toolsIndex.subtitle,
  };
}

export default async function ToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const t = dict.toolsIndex;
  const tools = t.tools.map((tool, i) => ({ ...tool, href: TOOL_HREFS[i] }));

  return (
    <div className="mx-auto max-w-5xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        {t.badge}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        {t.title}
      </h1>
      <p className="mt-4 max-w-xl text-[color:var(--color-ash)]">{t.subtitle}</p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={withLocale(locale, tool.href)}
            className="group rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-6 transition-colors hover:border-[color:var(--color-phosphor-dim)]"
          >
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--color-paper)]">
              {tool.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ash)]">{tool.desc}</p>
            <span className="mt-4 inline-block font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)] opacity-0 transition-opacity group-hover:opacity-100">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
