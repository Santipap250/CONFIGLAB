import type { MetadataRoute } from "next";
import { getAllKnowledge, getAllArticles } from "@/lib/content";

const BASE_URL = "https://labfpv.vercel.app";

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
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const knowledgeEntries: MetadataRoute.Sitemap = getAllKnowledge().map((k) => ({
    url: `${BASE_URL}/knowledge/${k.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const articleEntries: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${BASE_URL}/articles/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...knowledgeEntries, ...articleEntries];
}
