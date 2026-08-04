import { NextRequest, NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/locales";

// Metadata/asset routes that must never get a locale prefix.
const RESERVED_PATHS = new Set([
  "/robots.txt",
  "/sitemap.xml",
  "/icon.png",
  "/apple-icon.png",
  "/opengraph-image",
  "/favicon.ico",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    RESERVED_PATHS.has(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return NextResponse.next();

  // Bare paths (e.g. /knowledge, already indexed by Google before i18n
  // existed) permanently redirect to the default-locale equivalent so
  // that existing SEO equity carries over rather than 404ing.
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
