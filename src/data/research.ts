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
  url: string;
}

export const researchDirections: ResearchDirection[] = [
  {
    title: "LLM 应用与安全",
    description:
      "大语言模型在代码分析、漏洞检测与自动修复中的应用，关注模型推理安全、Prompt 注入防御与 AI 对抗样本。",
  },
  {
    title: "系统底层与程序分析",
    description:
      "操作系统内核安全、二进制分析、符号执行与可复用安全工具链的构建，强调从底层理解安全机制。",
  },
  {
    title: "开源基础设施",
    description:
      "面向 AI 与安全领域的开源工具链开发，包括代码安全审计引擎、模型优化框架和 AI 原生 IDE。",
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
  { name: "AI 安全攻防", url: "https://blog.csdn.net/lxcxjxhx" },
  { name: "系统与内核", url: "https://blog.csdn.net/lxcxjxhx" },
  { name: "LLM 应用开发", url: "https://blog.csdn.net/lxcxjxhx" },
  { name: "开源工具链", url: "https://blog.csdn.net/lxcxjxhx" },
];

export const researchPapers: never[] = [];
