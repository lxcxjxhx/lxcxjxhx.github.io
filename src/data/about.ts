import { githubProfile, githubRepos } from "./github-data";
import type { GitHubRepo } from "./github-data";

function extractSkillsFromRepos(repos: GitHubRepo[]) {
  const langCount: Record<string, number> = {};
  repos.forEach((r) => {
    if (r.language) {
      langCount[r.language] = (langCount[r.language] || 0) + 1;
    }
  });
  const languages = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang);

  return [
    { category: "编程语言", items: languages.length > 0 ? languages : ["Python", "TypeScript"] },
    { category: "研究方向", items: ["AI 安全", "代码分析", "LLM 推理优化", "漏洞挖掘"] },
    { category: "工具链", items: ["llama.cpp", "vLLM", "SGLang", "Unsloth"] },
  ];
}

export const aboutInfo = {
  name: githubProfile.name,
  handle: githubProfile.login,
  bio: githubProfile.bio,
  location: "",
  email: "",
  github: githubProfile.htmlUrl,
  avatarUrl: githubProfile.avatarUrl,
  publicRepos: githubProfile.publicRepos,
  followers: githubProfile.followers,
  following: githubProfile.following,
  joinedAt: new Date(githubProfile.createdAt).toLocaleDateString("zh-CN"),
  skills: extractSkillsFromRepos(githubRepos),
  experiences: [] as Array<{ period: string; role: string; institution: string; description: string }>,
  education: [] as Array<{ period: string; degree: string; institution: string }>,
};
