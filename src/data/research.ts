export interface ResearchDirection {
  title: string;
  description: string;
}

export interface Achievement {
  title: string;
  level: string;
  year: string;
}

export interface Column {
  name: string;
  articleCount: number;
  url: string;
}

export const researchDirections: ResearchDirection[] = [
  {
    title: "LLM 应用与安全",
    description:
      "探索大语言模型在代码分析、漏洞检测与自动修复中的应用，关注模型推理安全与提示注入防御。",
  },
  {
    title: "系统底层与开源基础设施",
    description:
      "操作系统内核、程序分析与可复用安全工具链的构建。",
  },
  {
    title: "Healthcare AI & DevOps",
    description:
      "医疗场景下的 AI 应用与自动化运维实践。",
  },
];

export const researchAchievements: Achievement[] = [
  { title: "中美青年创客大赛", level: "大奖", year: "" },
  { title: "Intel AI 竞赛", level: "获奖", year: "" },
];

export const certifications: string[] = [
  "阿里云专家博主",
  "华为云专家博主",
  "腾讯云创作者之星",
  "网络安全应急响应（中级）",
];

export const columns: Column[] = [
  { name: "AI 安全", articleCount: 0, url: "https://blog.csdn.net/lxcxjxhx" },
  { name: "系统底层", articleCount: 0, url: "https://blog.csdn.net/lxcxjxhx" },
  { name: "LLM 应用", articleCount: 0, url: "https://blog.csdn.net/lxcxjxhx" },
  { name: "DevOps 实践", articleCount: 0, url: "https://blog.csdn.net/lxcxjxhx" },
];

export const researchPapers: never[] = [];
