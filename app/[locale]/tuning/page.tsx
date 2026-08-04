import Link from "next/link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { withLocale, isLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

const STEP_LINKS = [
  null,
  "/tools/filters",
  "/knowledge/gyro-dterm-filters",
  "/knowledge/pid-controller-basics",
  "/tools/rates",
  "/troubleshoot",
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dict = getDictionary(locale);
  return {
    title: `${dict.tuning.title} — ${dict.meta.siteName}`,
    description: dict.tuning.subtitle,
  };
}

export default async function TuningPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const t = dict.tuning;

  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        {t.badge}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        {t.title}
      </h1>
      <p className="mt-4 max-w-xl text-[color:var(--color-ash)]">{t.subtitle}</p>

      <ol className="mt-14 space-y-10">
        {t.steps.map((s, i) => (
          <li key={s.n} className="flex gap-6">
            <span className="shrink-0 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-phosphor-dim)]">
              {s.n}
            </span>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--color-paper)]">
                {s.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ash)]">{s.desc}</p>
              {STEP_LINKS[i] && "linkLabel" in s && (
                <Link
                  href={withLocale(locale, STEP_LINKS[i] as string)}
                  className="mt-3 inline-block font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)]"
                >
                  {(s as { linkLabel: string }).linkLabel} →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
