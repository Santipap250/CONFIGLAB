import { getAllKnowledge, getAllArticles } from "./content";
import { getCliCommands } from "./cli-data";
import { getTroubleshootEntries } from "./troubleshoot-data";
import { withLocale, type Locale } from "./i18n/locales";

export type SearchItem = {
  type: "Knowledge" | "Article" | "CLI" | "Troubleshoot" | "Tool";
  title: string;
  description: string;
  href: string;
  meta?: string;
};

const TOOLS_BY_LOCALE: Record<Locale, Omit<SearchItem, "type">[]> = {
  en: [
    {
      title: "CLI Config Analyzer",
      description: "Paste your diff all output and get an instant analysis of what's customized, risky, or unrecognized.",
      href: "/analyzer",
    },
    {
      title: "Battery & Flight Time",
      description: "Estimate flight time and continuous-current headroom from capacity, C-rating, and cell count.",
      href: "/tools/battery",
    },
    {
      title: "Rates Visualizer",
      description: "See the stick-to-rotation-rate curve shaped by RC Rate, Super Rate, and Expo.",
      href: "/tools/rates",
    },
    {
      title: "Dynamic Notch Range Helper",
      description: "Get a starting dyn_notch_min_hz / max_hz range from motor KV and cell count.",
      href: "/tools/filters",
    },
  ],
  th: [
    {
      title: "CLI Config Analyzer",
      description: "วาง diff all แล้วรับผลวิเคราะห์ทันทีว่าค่าไหนถูกปรับ เสี่ยง หรือยังไม่มีในฐานข้อมูล",
      href: "/analyzer",
    },
    {
      title: "Battery & Flight Time",
      description: "ประมาณเวลาบินและกระแสสำรองต่อเนื่อง จากความจุ, C-rating และจำนวนเซลล์",
      href: "/tools/battery",
    },
    {
      title: "Rates Visualizer",
      description: "ดูกราฟความสัมพันธ์ระหว่างสติ๊กกับความเร็วหมุน จาก RC Rate, Super Rate และ Expo",
      href: "/tools/rates",
    },
    {
      title: "Dynamic Notch Range Helper",
      description: "หาค่าเริ่มต้นของ dyn_notch_min_hz / max_hz จาก KV มอเตอร์และจำนวนเซลล์",
      href: "/tools/filters",
    },
  ],
};

export function getSearchIndex(locale: Locale): SearchItem[] {
  const knowledge: SearchItem[] = getAllKnowledge(locale).map((k) => ({
    type: "Knowledge",
    title: k.title,
    description: k.description,
    href: withLocale(locale, `/knowledge/${k.slug}`),
    meta: k.category,
  }));

  const articles: SearchItem[] = getAllArticles(locale).map((a) => ({
    type: "Article",
    title: a.title,
    description: a.description,
    href: withLocale(locale, `/articles/${a.slug}`),
    meta: a.tags?.join(", "),
  }));

  const cli: SearchItem[] = getCliCommands(locale).map((c) => ({
    type: "CLI",
    title: c.command,
    description: c.description,
    href: withLocale(locale, "/cli"),
    meta: c.category,
  }));

  const troubleshoot: SearchItem[] = getTroubleshootEntries(locale).map((t) => ({
    type: "Troubleshoot",
    title: t.symptom,
    description: t.fix,
    href: withLocale(locale, "/troubleshoot"),
    meta: t.category,
  }));

  const tools: SearchItem[] = TOOLS_BY_LOCALE[locale].map((t) => ({
    type: "Tool",
    ...t,
    href: withLocale(locale, t.href),
  }));

  return [...knowledge, ...articles, ...cli, ...troubleshoot, ...tools];
}
