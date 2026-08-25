import { NextRequest, NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/locales";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Any static asset — anything under /public (icons, OG image route,
  // robots.txt, sitemap.xml, /covers/*.png, /brand/*.png, future assets
  // we haven't thought of yet) has a file extension on its last segment,
  // or is the extension-less /opengraph-image route. Skip middleware for
  // all of them generically instead of hand-maintaining an allowlist —
  // an allowlist is exactly what silently broke /covers/*.png before.
  const lastSegment = pathname.split("/").pop() ?? "";
  const looksLikeStaticFile = /\.[a-zA-Z0-9]+$/.test(lastSegment);

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/opengraph-image" ||
    looksLikeStaticFile
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
