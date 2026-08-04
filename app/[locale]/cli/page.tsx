import { getCliCommands } from "@/lib/cli-data";
import CliExplorer from "@/components/CliExplorer";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dict = getDictionary(locale);
  return {
    title: `${dict.cli.title} — ${dict.meta.siteName}`,
    description: dict.cli.subtitle,
  };
}

export default async function CliPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const t = dict.cli;

  return (
    <div className="mx-auto max-w-4xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        {t.badge}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        {t.title}
      </h1>
      <p className="mt-4 max-w-xl text-[color:var(--color-ash)]">{t.subtitle}</p>

      <div className="mt-10">
        <CliExplorer commands={getCliCommands(locale)} dict={dict} />
      </div>
    </div>
  );
}
