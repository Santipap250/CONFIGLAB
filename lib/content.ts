import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "./i18n/locales";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type KnowledgeEntry = {
  slug: string;
  content: string;
  title: string;
  description: string;
  category: string;
  order?: number;
  coverImage?: string;
};

export type ArticleEntry = {
  slug: string;
  content: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
};

function listMdx(sub: string) {
  const dir = path.join(CONTENT_DIR, sub);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
}

function readEntry(sub: string, file: string) {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, sub, file), "utf8");
  const { data, content } = matter(raw);
  return { slug: file.replace(/\.mdx$/, ""), content, ...(data as Record<string, unknown>) };
}

export function getAllKnowledge(locale: Locale): KnowledgeEntry[] {
  const sub = `${locale}/knowledge`;
  return listMdx(sub)
    .map((f) => readEntry(sub, f) as unknown as KnowledgeEntry)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getKnowledgeBySlug(locale: Locale, slug: string): KnowledgeEntry | null {
  const sub = `${locale}/knowledge`;
  const file = path.join(CONTENT_DIR, sub, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return readEntry(sub, `${slug}.mdx`) as unknown as KnowledgeEntry;
}

export function getAllArticles(locale: Locale): ArticleEntry[] {
  const sub = `${locale}/articles`;
  return listMdx(sub)
    .map((f) => readEntry(sub, f) as unknown as ArticleEntry)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticleBySlug(locale: Locale, slug: string): ArticleEntry | null {
  const sub = `${locale}/articles`;
  const file = path.join(CONTENT_DIR, sub, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return readEntry(sub, `${slug}.mdx`) as unknown as ArticleEntry;
}
