import { githubProfile } from "./github-data";

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Experience {
  period: string;
  role: string;
  institution: string;
  description: string;
}

export interface Education {
  period: string;
  degree: string;
  institution: string;
}

export const aboutInfo = {
  name: githubProfile.name || "钱佳宏",
  handle: "lxcxjxhx",
  bio: `${githubProfile.bio || "上海 | 信息安全与 AI 交叉方向研究者。"} CSDN 专家博主，累计发布 1,467 篇技术文章。开源活跃者，GitHub 年度 1,038+ commits，维护 25 个仓库，PyPI 发布 7 个包。`,
  location: "上海，中国",
  email: "aqfxz_zh@qq.com",
  phone: "+86 19921057118",
  github: githubProfile.htmlUrl || "https://github.com/lxcxjxhx",
  csdn: "https://security-hyacinth.blog.csdn.net/",
  pypi: "https://pypi.org/user/lxcxjxhx/",
  avatarUrl: githubProfile.avatarUrl,
  publicRepos: githubProfile.publicRepos || 25,
  followers: githubProfile.followers || 37,
  following: githubProfile.following || 0,
  joinedAt: githubProfile.createdAt || "",
  skills: [
    {
      category: "核心领域",
      items: ["LLM Applications", "Cybersecurity", "Healthcare AI", "DevOps"],
    },
    {
      category: "编程语言",
      items: ["Python", "TypeScript", "C/C++", "Rust"],
    },
    {
      category: "工具链",
      items: ["llama.cpp", "vLLM", "SGLang", "Unsloth", "Docker", "Kubernetes"],
    },
  ] as SkillGroup[],
  experiences: [
    {
      period: "持续",
      role: "开源贡献者",
      institution: "GitHub / PyPI",
      description:
        "维护 25 个开源仓库，PyPI 发布 7 个包，合并 20+ PR 到 6 个以上外部项目。",
    },
    {
      period: "持续",
      role: "技术博主",
      institution: "CSDN",
      description:
        "累计发布 1,467 篇技术文章，12+ 专栏，阿里云/华为云/腾讯云认证专家博主。",
    },
  ] as Experience[],
  education: [] as Education[],
  achievements: [
    "中美青年创客大赛 大奖",
    "Intel AI 竞赛 获奖",
    "阿里云专家博主",
    "华为云专家博主",
    "腾讯云创作者之星",
    "网络安全应急响应（中级）",
  ],
  stats: {
    githubCommits: 1038,
    csdnArticles: 1467,
    csdnColumns: 12,
    pypiPackages: 7,
    mergedPRs: 20,
  },
};
