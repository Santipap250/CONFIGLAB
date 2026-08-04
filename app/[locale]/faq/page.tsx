import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dict = getDictionary(locale);
  return { title: `${dict.faq.title} — ${dict.meta.siteName}` };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const dict = getDictionary(rawLocale);
  const t = dict.faq;

  return (
    <div className="mx-auto max-w-2xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        {t.badge}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        {t.title}
      </h1>

      <div className="mt-12 space-y-3">
        {t.items.map((f) => (
          <details
            key={f.q}
            className="group rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] open:border-[color:var(--color-phosphor-dim)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
              <span className="font-[family-name:var(--font-display)] text-[15px] font-medium text-[color:var(--color-paper)]">
                {f.q}
              </span>
              <span className="shrink-0 font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)] transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="border-t border-[color:var(--color-carbon-line)] px-5 py-4">
              <p className="text-sm leading-relaxed text-[color:var(--color-paper)]">{f.a}</p>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-14 rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-6">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-phosphor)]">
          {t.stillNeed}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ash)]">{t.stillNeedNote}</p>
        <a
          href="https://github.com/Santipap250/LABFPV-"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-sm border border-[color:var(--color-phosphor-dim)] px-4 py-2 font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)] transition-colors hover:bg-[color:var(--color-phosphor)] hover:text-[color:var(--color-carbon)]"
        >
          {t.openRepo}
        </a>
      </div>
    </div>
  );
}
