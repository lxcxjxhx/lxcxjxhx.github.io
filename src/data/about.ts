import type { AboutInfo } from "../types";

export const aboutInfo: AboutInfo = {
  name: "HOS",
  handle: "lxcxjxhx",
  bio: "聚焦 AI 安全、系统底层与开源基础设施的研究者。相信代码是理解世界最诚实的方式。",
  location: "中国",
  email: "hos@example.com",
  github: "https://github.com/lxcxjxhx",
  skills: [
    {
      category: "系统底层",
      items: ["Rust", "C/C++", "RISC-V", "QEMU", "Linux Kernel"],
    },
    {
      category: "AI / ML",
      items: ["PyTorch", "Transformers", "Unsloth", "vLLM", "Ollama"],
    },
    {
      category: "安全研究",
      items: ["静态分析", "模糊测试", "逆向工程", "漏洞挖掘", "固件安全"],
    },
    {
      category: "基础设施",
      items: ["GitHub Actions", "Docker", "Nix", "Vite", "Tailwind CSS"],
    },
  ],
  experiences: [
    {
      period: "2023 — 至今",
      role: "独立安全研究员",
      institution: "HOS Lab",
      description: "主导 HOS-LS、HOS-Model-Optimizer 等开源项目的架构与实现。",
    },
    {
      period: "2021 — 2023",
      role: "研究助理",
      institution: "某高校安全实验室",
      description: "参与国家级基金项目，负责固件侧信道分析与漏洞挖掘工具开发。",
    },
  ],
  education: [
    {
      period: "2021 — 2024",
      degree: "工学硕士",
      institution: "某大学 · 网络空间安全",
    },
    {
      period: "2017 — 2021",
      degree: "工学学士",
      institution: "某大学 · 计算机科学与技术",
    },
  ],
};
