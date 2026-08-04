import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

const RESOURCE_HREFS = [
  "https://github.com/betaflight/betaflight",
  "https://github.com/betaflight/betaflight-configurator",
  "https://github.com/Santipap250/LABFPV-",
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dict = getDictionary(locale);
  return { title: `${dict.resources.title} — ${dict.meta.siteName}` };
}

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const dict = getDictionary(rawLocale);
  const t = dict.resources;
  const items = t.items.map((it, i) => ({ ...it, href: RESOURCE_HREFS[i] }));

  return (
    <div className="mx-auto max-w-2xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        {t.badge}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        {t.title}
      </h1>
      <p className="mt-4 text-[color:var(--color-ash)]">{t.subtitle}</p>

      <div className="mt-12 space-y-4">
        {items.map((r) => (
          <a
            key={r.href}
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-6 transition-colors hover:border-[color:var(--color-phosphor-dim)]"
          >
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--color-paper)] transition-colors group-hover:text-[color:var(--color-phosphor)]">
              {r.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ash)]">{r.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
