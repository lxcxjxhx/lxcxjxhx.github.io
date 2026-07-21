import { githubEvents, githubRepos } from "./github-data";
import type { GitHubEvent } from "./github-data";

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  slug: string;
  publishedAt: string;
  readingTime: number;
}

function formatEventTitle(event: GitHubEvent): string {
  const repoName = event.repo.split("/")[1] || event.repo;
  switch (event.type) {
    case "PushEvent":
      return `代码更新: ${repoName}`;
    case "PullRequestEvent":
      return `PR ${event.payload?.action || ""}: ${repoName}`;
    case "CreateEvent":
      return `创建分支: ${repoName}`;
    case "IssueCommentEvent":
      return `评论了 Issue: ${repoName}`;
    case "IssuesEvent":
      return `Issue ${event.payload?.action || ""}: ${repoName}`;
    case "DeleteEvent":
      return `删除分支: ${repoName}`;
    case "ReleaseEvent":
      return `发布: ${repoName}`;
    case "WatchEvent":
      return `Star: ${repoName}`;
    case "ForkEvent":
      return `Fork: ${repoName}`;
    default:
      return `${event.type}: ${repoName}`;
  }
}

export function getActivityFeed(): BlogPost[] {
  const repoMap = new Map(githubRepos.map((r) => [r.fullName, r]));

  return githubEvents
    .filter((e) => {
      if (e.type === "ForkEvent") return false;
      if (e.repo === "lxcxjxhx/lxcxjxhx") return false;
      if (e.repo === "lxcxjxhx/lxcxjxhx.github.io") return false;
      return true;
    })
    .slice(0, 20)
    .map((event, i) => {
      const repo = repoMap.get(event.repo);
      return {
        id: `event-${i}`,
        title: formatEventTitle(event),
        summary: repo?.description || event.repo,
        tags: [event.type.replace("Event", ""), event.repo.split("/")[1]],
        slug: `activity-${i}`,
        publishedAt: new Date(event.createdAt).toLocaleDateString("zh-CN"),
        readingTime: 1,
      };
    });
}
