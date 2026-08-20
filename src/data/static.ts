// 手工精选的品牌静态数据 —— 其余内容（专栏/领域/PR 等）全部实时取自 HOS-Qian-jia-hong-resume 仓库
export const BRAND = {
  name: "安全风信子",
  en: "SECURITY HYACINTH",
  handle: "Qian Jiahong · 钱佳宏",
  role: "信息安全 × AI 双域实践者",
  tagline: "以代码为武器，在 AI 与安全的交汇处，培育智能时代的坚盾与利矛。",
  location: "上海 · 中国",
  email: "aqfxz_zh@qq.com",
};

export const STATS = [
  { label: "CSDN 原创博文", value: "1,467", unit: "篇" },
  { label: "已合并 Pull Request", value: "161", unit: "个" },
  { label: "PyPI 开源包", value: "7", unit: "个" },
  { label: "年度 GitHub 贡献", value: "1,686", unit: "次" },
  { label: "博客收藏", value: "19,544", unit: "次" },
  { label: "博客粉丝", value: "3,312", unit: "人" },
];

export const LINKS = [
  { label: "CSDN 博客", href: "https://security-hyacinth.blog.csdn.net/", tag: "1,467 篇原创" },
  { label: "GitHub", href: "https://github.com/lxcxjxhx", tag: "@lxcxjxhx" },
  { label: "PyPI", href: "https://pypi.org/user/security_hyacinth/", tag: "7 Packages" },
  { label: "Hugging Face", href: "https://huggingface.co/lxcxjxhx", tag: "Models" },
  { label: "Email", href: "mailto:aqfxz_zh@qq.com", tag: "aqfxz_zh@qq.com" },
];

export const PROJECTS = [
  { name: "HOS-LS", desc: "AI 驱动的代码安全分析与攻击链推理系统 —— 用语义理解重新定义代码审计。", tags: ["Python", "Multi-Agent", "RAG", "Exploit"], url: "https://github.com/lxcxjxhx/HOS-LS" },
  { name: "HOS_SKILL_WORKFLOW", desc: "HOS 工作流提示词工厂 —— LLM 任务工作流与 Prompt 工程系统。", tags: ["TypeScript", "Prompt Engineering", "Workflow"], url: "https://github.com/lxcxjxhx/HOS_SKILL_WORKFLOW" },
  { name: "HOS-Forge", desc: "技能市场与 IDE 工具链 —— 市场后端、沙箱执行与安全隔离。", tags: ["TypeScript", "Marketplace", "Sandbox"], url: "https://github.com/lxcxjxhx/HOS-Forge" },
  { name: "HOS-ARES", desc: "移动端安全助手 —— Android 集成、Proot 运行时与 Agent 并行调度。", tags: ["Android", "Proot", "Agents"], url: "https://github.com/lxcxjxhx/HOS-ARES" },
  { name: "HOS-MATCH-PROJECT", desc: "Intel AI 竞赛 —— AI+威胁检测，Qwen2.5 与知识图谱驱动的告警研判。", tags: ["Python", "Qwen2.5", "React", "KG"], url: "https://github.com/lxcxjxhx/HOS-MATCH-PROJECT" },
  { name: "BOS-FS", desc: "基础开源安全工具集，AGPLv3 许可。", tags: ["Python"], url: "https://github.com/lxcxjxhx/BOS-FS" },
  { name: "BOS-NI", desc: "网络与基础设施安全工具，AGPLv3 许可。", tags: ["Python"], url: "https://github.com/lxcxjxhx/BOS-NI" },
  { name: "HOS-Qian-jia-hong-resume", desc: "本站数据源仓库 —— 个人成就作品集，本站内容实时读取于此。", tags: ["Markdown", "Data Source"], url: "https://github.com/lxcxjxhx/HOS-Qian-jia-hong-resume" },
];

export const ACHIEVEMENTS = [
  { icon: "🥇", title: "竞赛", items: "中美青年创客大赛特等奖 · Intel AI 竞赛 · 多项国家级/省级创新大赛" },
  { icon: "📜", title: "认证", items: "阿里云 / 华为云专家博主 · 腾讯云创作之星 · Intel AI 系列 · 网络安全应急响应（中级）" },
  { icon: "✍️", title: "分享", items: "CSDN 1,467 篇原创 · 12+ 系统化专栏 · 1.2M 访问量" },
  { icon: "🔓", title: "开源", items: "PyPI 7 个开源包 · 161 个合并 PR · Hugging Face 微调模型" },
];
