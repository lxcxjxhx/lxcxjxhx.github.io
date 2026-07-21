export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  tags: string[];
  abstract: string;
  link?: string;
  pdfLink?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  status: "active" | "beta" | "planned" | "archived";
  repoUrl?: string;
  demoUrl?: string;
  stars?: number;
  forks?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  publishedAt: string;
  readingTime: number;
  slug: string;
}

export interface AboutInfo {
  name: string;
  handle: string;
  bio: string;
  avatar?: string;
  location: string;
  email: string;
  github: string;
  scholar?: string;
  orcid?: string;
  skills: { category: string; items: string[] }[];
  experiences: { period: string; role: string; institution: string; description: string }[];
  education: { period: string; degree: string; institution: string }[];
}
