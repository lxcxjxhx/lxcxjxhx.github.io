import type { Project } from "../types";

export const projects: Project[] = [
  {
    id: "hos-ls",
    name: "HOS-LS",
    description:
      "基于静态分析与 LLM 的漏洞语义搜索引擎，支持跨函数、跨模块的深层缺陷定位。",
    tags: ["Rust", "Python", "LLM", "静态分析"],
    status: "active",
    repoUrl: "https://github.com/lxcxjxhx/hos-ls",
    stars: 127,
    forks: 23,
  },
  {
    id: "hos-model-optimizer",
    name: "HOS-Model-Optimizer",
    description:
      "面向安全领域微调的大模型训练与量化工具集，支持 Unsloth 加速、LoRA 与 QLoRA。",
    tags: ["Python", "PyTorch", "Unsloth", "量化"],
    status: "active",
    repoUrl: "https://github.com/lxcxjxhx/hos-model-optimizer",
    stars: 89,
    forks: 15,
  },
  {
    id: "hos-forge",
    name: "HOS-Forge",
    description: "嵌入式固件模糊测试平台，集成 AFL++ 与 QEMU 系统模式仿真。",
    tags: ["C", "QEMU", "AFL++", "固件安全"],
    status: "beta",
    repoUrl: "https://github.com/lxcxjxhx/hos-forge",
    stars: 56,
    forks: 8,
  },
];
