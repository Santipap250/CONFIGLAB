import type { Metadata } from "next";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "../globals.css";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HudFrame from "@/components/HudFrame";
import { getSearchIndex } from "@/lib/search-index";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n/locales";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL("https://labfpv.vercel.app"),
    title: {
      default: dict.meta.defaultTitle,
      template: "%s",
    },
    description: dict.meta.defaultDescription,
    alternates: {
      languages: { en: "/en", th: "/th" },
    },
    openGraph: {
      title: dict.meta.defaultTitle,
      description: dict.meta.defaultDescription,
      type: "website",
      siteName: dict.meta.siteName,
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.defaultTitle,
      description: dict.meta.defaultDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);

  return (
    <html lang={locale}>
      <body className="antialiased">
        <HudFrame />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-[color:var(--color-phosphor)] focus:px-4 focus:py-2 focus:font-[family-name:var(--font-mono)] focus:text-[13px] focus:text-[color:var(--color-carbon)]"
        >
          {dict.nav.skipToContent}
        </a>
        <Nav locale={locale} dict={dict} searchIndex={getSearchIndex(locale)} />
        <main id="main-content">{children}</main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
