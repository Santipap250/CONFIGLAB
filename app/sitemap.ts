import type { MetadataRoute } from "next";
import { getAllKnowledge, getAllArticles } from "@/lib/content";
import { LOCALES, withLocale } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL;

const STATIC_ROUTES = [
  "",
  "/about",
  "/analyzer",
  "/knowledge",
  "/cli",
  "/troubleshoot",
  "/tuning",
  "/tools",
  "/tools/battery",
  "/tools/rates",
  "/tools/filters",
  "/articles",
  "/faq",
  "/changelog",
  "/resources",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const route of STATIC_ROUTES) {
      entries.push({
        url: `${BASE_URL}${withLocale(locale, route)}`,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.7,
      });
    }
    for (const k of getAllKnowledge(locale)) {
      entries.push({
        url: `${BASE_URL}${withLocale(locale, `/knowledge/${k.slug}`)}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const a of getAllArticles(locale)) {
      entries.push({
        url: `${BASE_URL}${withLocale(locale, `/articles/${a.slug}`)}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
