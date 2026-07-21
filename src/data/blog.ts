import { csdnArticles, csdnStats } from "./csdn-data";
import type { CSDNArticle } from "./csdn-data";

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  readCount: number;
}

export function getBlogPosts(): BlogPost[] {
  return csdnArticles.map((a: CSDNArticle) => ({
    id: a.id,
    title: a.title,
    summary: a.summary,
    url: a.url,
    publishedAt: a.publishedAt,
    readCount: a.readCount,
  }));
}

export function getBlogStats() {
  return csdnStats;
}
