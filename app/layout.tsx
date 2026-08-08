import type { Metadata } from "next";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/locales";

export const metadata: Metadata = {
  title: "OBIX CONFIG LAB",
  description: "FPV configuration, tuning, troubleshooting, and knowledge lab.",

  verification: {
  google: "Eyh1zNAgmJEbGr52OpkGTmradGijdm7KMIlOex-6ppQ",
},
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params?: Promise<{ locale?: string }>;
}>) {
  const resolved = params ? await params : undefined;
  const rawLocale = resolved?.locale;
  const locale: Locale = rawLocale && isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-[color:var(--color-phosphor)] focus:px-4 focus:py-2 focus:font-[family-name:var(--font-mono)] focus:text-[13px] focus:text-[color:var(--color-carbon)]"
        >
          {dict.nav.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
