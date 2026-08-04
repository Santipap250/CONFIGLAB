import RatesVisualizer from "@/components/RatesVisualizer";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dict = getDictionary(locale);
  return { title: `${dict.rates.title} — ${dict.meta.siteName}` };
}

export default async function RatesToolPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const dict = getDictionary(rawLocale);

  return (
    <div className="mx-auto max-w-4xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        {dict.rates.label}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        {dict.rates.title}
      </h1>
      <div className="mt-10">
        <RatesVisualizer dict={dict} />
      </div>
    </div>
  );
}
