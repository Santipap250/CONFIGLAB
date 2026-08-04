import { getDictionary } from "@/lib/i18n/get-dictionary";
import { withLocale, isLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dict = getDictionary(locale);
  return { title: `${dict.about.title} — ${dict.meta.siteName}` };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const t = dict.about;

  return (
    <div className="mx-auto max-w-2xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        {t.badge}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        {t.title}
      </h1>

      <div className="prose prose-invert mt-10 max-w-none prose-headings:font-[family-name:var(--font-display)] prose-a:text-[color:var(--color-phosphor)] prose-strong:text-[color:var(--color-paper)]">
        <p>{t.p1}</p>

        <h2>{t.h2What}</h2>
        <p>{t.pWhat}</p>

        <h2>{t.h2WhatNot}</h2>
        <p>{t.pWhatNot}</p>

        <h2>{t.h2Going}</h2>
        <p>
          {t.pGoing1} <a href={withLocale(locale, "/changelog")}>{t.changelogLink}</a> {t.pGoing2}
        </p>

        <h2>{t.h2Knowledge}</h2>
        <p>
          {t.pKnowledge1}{" "}
          <a href="https://www.facebook.com/banmysanti" target="_blank" rel="noopener noreferrer">
            {t.fbLink}
          </a>{" "}
          {t.pKnowledge2}
        </p>
      </div>
    </div>
  );
}
