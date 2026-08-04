"use client";

import { usePathname } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/i18n/locales";

const LABEL: Record<Locale, string> = { en: "EN", th: "ไทย" };

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || `/${locale}`;

  function pathForLocale(target: Locale) {
    const segments = pathname.split("/");
    // segments[0] is "" (leading slash), segments[1] is the current locale
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }

  return (
    <div className="flex items-center rounded-sm border border-[color:var(--color-carbon-line)] font-[family-name:var(--font-mono)] text-[12px]">
      {LOCALES.map((l) => (
        <a
          key={l}
          href={pathForLocale(l)}
          aria-current={l === locale ? "true" : undefined}
          className={`px-2 py-1.5 transition-colors ${
            l === locale
              ? "bg-[color:var(--color-phosphor)] text-[color:var(--color-carbon)]"
              : "text-[color:var(--color-ash)] hover:text-[color:var(--color-phosphor)]"
          }`}
        >
          {LABEL[l]}
        </a>
      ))}
    </div>
  );
}
