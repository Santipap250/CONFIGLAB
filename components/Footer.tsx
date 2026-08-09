import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { withLocale, type Locale } from "@/lib/i18n/locales";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const COLUMNS = [
    {
      title: dict.footer.library,
      links: [
        { href: withLocale(locale, "/analyzer"), label: dict.footer.configAnalyzer },
        { href: withLocale(locale, "/knowledge"), label: dict.footer.knowledgeHub },
        { href: withLocale(locale, "/cli"), label: dict.footer.cliLibrary },
        { href: withLocale(locale, "/articles"), label: dict.footer.articles },
      ],
    },
    {
      title: dict.footer.diagnose,
      links: [
        { href: withLocale(locale, "/troubleshoot"), label: dict.footer.troubleshooting },
        { href: withLocale(locale, "/tuning"), label: dict.footer.tuningGuide },
        { href: withLocale(locale, "/tools"), label: dict.footer.toolsCalculators },
      ],
    },
    {
      title: dict.footer.project,
      links: [
        { href: withLocale(locale, "/about"), label: dict.footer.about },
        { href: withLocale(locale, "/changelog"), label: dict.footer.changelog },
        { href: withLocale(locale, "/faq"), label: dict.footer.faqSupport },
        { href: withLocale(locale, "/resources"), label: dict.footer.community },
      ],
    },
  ];

  return (
    <footer className="border-t border-[color:var(--color-carbon-line)]">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <span className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.25em] text-[color:var(--color-paper)]">
              OBIXCONFIG&nbsp;<span className="text-[color:var(--color-phosphor)]">LAB</span>
            </span>
            <p className="mt-3 max-w-[22ch] font-[family-name:var(--font-mono)] text-[12px] leading-relaxed text-[color:var(--color-ash)]">
              {dict.footer.tagline}
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-phosphor-dim)]">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-[color:var(--color-ash)] transition-colors hover:text-[color:var(--color-phosphor)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="signal-rule my-10" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)]">
            © {new Date().getFullYear()} {dict.footer.copyright}
          </p>
          <p className="font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)]">
            {dict.footer.builtBy}{" "}
            <a
              href="https://www.facebook.com/santipab.songkarak"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--color-phosphor-dim)] transition-colors hover:text-[color:var(--color-phosphor)]"
            >
              Santipab Songkarak
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
