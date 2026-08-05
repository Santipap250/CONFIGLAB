import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HudFrame from "@/components/HudFrame";
import { getSearchIndex } from "@/lib/search-index";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";

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
    metadataBase: new URL(SITE_URL),
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
    <>
      <HudFrame />
      <Nav locale={locale} dict={dict} searchIndex={getSearchIndex(locale)} />
      <main id="main-content">{children}</main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
