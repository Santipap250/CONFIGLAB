export const LOCALES = ["en", "th"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Prefix an app-relative path ("/knowledge/foo") with the locale. */
export function withLocale(locale: Locale, path: string): string {
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}
