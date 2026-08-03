import { getAllKnowledge, getAllArticles } from "./content";
import { CLI_COMMANDS } from "./cli-data";
import { TROUBLESHOOT } from "./troubleshoot-data";

export type SearchItem = {
  type: "Knowledge" | "Article" | "CLI" | "Troubleshoot" | "Tool";
  title: string;
  description: string;
  href: string;
  meta?: string;
};

const TOOLS: SearchItem[] = [
  {
    type: "Tool",
    title: "CLI Config Analyzer",
    description: "Paste your diff all output and get an instant analysis of what's customized, risky, or unrecognized.",
    href: "/analyzer",
  },
  {
    type: "Tool",
    title: "Battery & Flight Time",
    description: "Estimate flight time and continuous-current headroom from capacity, C-rating, and cell count.",
    href: "/tools/battery",
  },
  {
    type: "Tool",
    title: "Rates Visualizer",
    description: "See the stick-to-rotation-rate curve shaped by RC Rate, Super Rate, and Expo.",
    href: "/tools/rates",
  },
  {
    type: "Tool",
    title: "Dynamic Notch Range Helper",
    description: "Get a starting dyn_notch_min_hz / max_hz range from motor KV and cell count.",
    href: "/tools/filters",
  },
];

export function getSearchIndex(): SearchItem[] {
  const knowledge: SearchItem[] = getAllKnowledge().map((k) => ({
    type: "Knowledge",
    title: k.title,
    description: k.description,
    href: `/knowledge/${k.slug}`,
    meta: k.category,
  }));

  const articles: SearchItem[] = getAllArticles().map((a) => ({
    type: "Article",
    title: a.title,
    description: a.description,
    href: `/articles/${a.slug}`,
    meta: a.tags?.join(", "),
  }));

  const cli: SearchItem[] = CLI_COMMANDS.map((c) => ({
    type: "CLI",
    title: c.command,
    description: c.description,
    href: "/cli",
    meta: c.category,
  }));

  const troubleshoot: SearchItem[] = TROUBLESHOOT.map((t) => ({
    type: "Troubleshoot",
    title: t.symptom,
    description: t.fix,
    href: "/troubleshoot",
    meta: t.category,
  }));

  return [...knowledge, ...articles, ...cli, ...troubleshoot, ...TOOLS];
}
