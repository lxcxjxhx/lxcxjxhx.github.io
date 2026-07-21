import { githubRepos } from "./github-data";
import type { GitHubRepo } from "./github-data";

export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  status: string;
  stars: number;
  forks: number;
  repoUrl: string;
  homepage: string | null;
  language: string | null;
  updatedAt: string;
}

/** Names to exclude from the portfolio */
const EXCLUDE_PATTERNS = ["resume", "academic-resume"];
const EXCLUDE_EXACT = ["BOS-NI", "BOS-FS"];

function shouldExclude(repo: GitHubRepo): boolean {
  const nameLower = repo.name.toLowerCase();
  if (EXCLUDE_PATTERNS.some((p) => nameLower.includes(p))) return true;
  if (EXCLUDE_EXACT.includes(repo.name)) return true;
  return false;
}

export function getProjects(): Project[] {
  return githubRepos
    .filter((repo) => !shouldExclude(repo))
    .map((repo) => ({
      id: String(repo.id),
      name: repo.name,
      description: repo.description || "暂无描述",
      tags: [repo.language || "Mixed", ...repo.topics.slice(0, 2)],
      status: repo.openIssuesCount > 0 ? "active" : "stable",
      stars: repo.stargazersCount,
      forks: repo.forksCount,
      repoUrl: repo.htmlUrl,
      homepage: repo.homepage,
      language: repo.language,
      updatedAt: new Date(repo.pushedAt).toLocaleDateString("zh-CN"),
    }));
}
