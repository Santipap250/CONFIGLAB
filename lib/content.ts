import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type KnowledgeEntry = {
  slug: string;
  content: string;
  title: string;
  description: string;
  category: string;
  order?: number;
  lang?: string;
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

export function getAllKnowledge(): KnowledgeEntry[] {
  return listMdx("knowledge")
    .map((f) => readEntry("knowledge", f) as unknown as KnowledgeEntry)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getKnowledgeBySlug(slug: string): KnowledgeEntry | null {
  const file = path.join(CONTENT_DIR, "knowledge", `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return readEntry("knowledge", `${slug}.mdx`) as unknown as KnowledgeEntry;
}

export function getAllArticles(): ArticleEntry[] {
  return listMdx("articles")
    .map((f) => readEntry("articles", f) as unknown as ArticleEntry)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticleBySlug(slug: string): ArticleEntry | null {
  const file = path.join(CONTENT_DIR, "articles", `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return readEntry("articles", `${slug}.mdx`) as unknown as ArticleEntry;
}
