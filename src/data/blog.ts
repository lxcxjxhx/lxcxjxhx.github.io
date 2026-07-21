import type { BlogPost } from "../types";

export const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "从零构建静态分析器：AST 遍历与数据流分析实践",
    summary:
      "本文记录如何使用 Rust 构建一个支持跨过程分析的轻量级静态分析器，涵盖 AST 生成、CFG 构建与污点追踪。",
    tags: ["Rust", "静态分析", "编译原理"],
    publishedAt: "2025-06-15",
    readingTime: 18,
    slug: "building-static-analyzer-from-scratch",
  },
  {
    id: "post-2",
    title: "Unsloth + LoRA：安全领域大模型微调的成本控制",
    summary:
      "分享在安全数据集上微调 Qwen2.5-Coder 的经验，包括显存优化策略、训练管线搭建与量化部署。",
    tags: ["LLM", "Unsloth", "LoRA", "AI安全"],
    publishedAt: "2025-05-22",
    readingTime: 12,
    slug: "unsloth-lora-security-finetune",
  },
  {
    id: "post-3",
    title: "GitHub Actions 自动化：从 CI 到安全发布管线",
    summary:
      "设计一套覆盖代码审查、依赖扫描、SBOM 生成与签名发布的完整 GitHub Actions 工作流。",
    tags: ["DevSecOps", "GitHub Actions", "供应链安全"],
    publishedAt: "2025-04-10",
    readingTime: 15,
    slug: "github-actions-security-pipeline",
  },
];
