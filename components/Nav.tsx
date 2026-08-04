"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import SiteSearch from "@/components/SiteSearch";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import type { SearchItem } from "@/lib/search-index";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { withLocale, type Locale } from "@/lib/i18n/locales";

export default function Nav({
  locale,
  dict,
  searchIndex,
}: {
  locale: Locale;
  dict: Dictionary;
  searchIndex: SearchItem[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();

  const LINKS = [
    { href: withLocale(locale, "/analyzer"), label: dict.nav.configAnalyzer },
    { href: withLocale(locale, "/knowledge"), label: dict.nav.knowledge },
    { href: withLocale(locale, "/cli"), label: dict.nav.cliLibrary },
    { href: withLocale(locale, "/troubleshoot"), label: dict.nav.troubleshoot },
    { href: withLocale(locale, "/tuning"), label: dict.nav.tuning },
    { href: withLocale(locale, "/tools"), label: dict.nav.tools },
    { href: withLocale(locale, "/articles"), label: dict.nav.articles },
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href={withLocale(locale, "/")} className="group flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-[color:var(--color-phosphor)] shadow-[0_0_10px_var(--color-phosphor)] transition-transform group-hover:scale-125"
          />
          <span className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.25em] text-[color:var(--color-paper)]">
            OBIXCONFIG&nbsp;<span className="text-[color:var(--color-phosphor)]">LAB</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden gap-6 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-[family-name:var(--font-mono)] text-[13px] text-[color:var(--color-ash)] transition-colors hover:text-[color:var(--color-phosphor)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SiteSearch index={searchIndex} dict={dict} />
          <LocaleSwitcher locale={locale} />

          <Link
            href={withLocale(locale, "/faq")}
            className="hidden rounded-sm border border-[color:var(--color-phosphor-dim)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)] transition-colors hover:bg-[color:var(--color-phosphor)] hover:text-[color:var(--color-carbon)] sm:inline-block"
          >
            {dict.nav.support}
          </Link>

          <button
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-[color:var(--color-carbon-line)] text-[color:var(--color-paper)] transition-colors hover:border-[color:var(--color-phosphor-dim)] md:hidden"
          >
            <span aria-hidden="true" className="relative flex h-3.5 w-4 flex-col justify-between">
              <span className={`h-[1.5px] w-full bg-current transition-transform ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
              <span className={`h-[1.5px] w-full bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`h-[1.5px] w-full bg-current transition-transform ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      <nav
        id={menuId}
        aria-label="Mobile"
        hidden={!open}
        className="border-t border-[color:var(--color-carbon-line)] px-5 py-4 md:hidden"
      >
        <ul className="flex flex-col gap-1">
          {[...LINKS, { href: withLocale(locale, "/faq"), label: dict.nav.support }].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block rounded-sm px-2 py-2.5 font-[family-name:var(--font-mono)] text-sm text-[color:var(--color-paper)] transition-colors hover:bg-[color:var(--color-carbon-raised)] hover:text-[color:var(--color-phosphor)]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
