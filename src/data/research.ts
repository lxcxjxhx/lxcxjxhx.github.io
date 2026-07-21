import type { ResearchPaper } from "../types";

export const researchPapers: ResearchPaper[] = [
  {
    id: "paper-1",
    title: "基于大语言模型的自动化漏洞挖掘与利用框架研究",
    authors: ["HOS", "合作者A", "合作者B"],
    venue: "IEEE Symposium on Security and Privacy (S&P)",
    year: 2025,
    tags: ["AI安全", "LLM", "漏洞挖掘"],
    abstract:
      "提出了一种将大型语言模型与符号执行相结合的新型漏洞挖掘框架，在真实固件数据集上实现了 34% 的漏洞发现率提升。",
    link: "#",
    pdfLink: "#",
  },
  {
    id: "paper-2",
    title: "面向 RISC-V 内核的侧信道攻击面静态分析方法",
    authors: ["HOS", "导师"],
    venue: "USENIX Security Symposium",
    year: 2024,
    tags: ["系统安全", "RISC-V", "侧信道"],
    abstract:
      "设计了针对开源 RISC-V 内核的静态分析工具链，能够自动识别微架构级侧信道泄漏点，覆盖 90% 以上的已知漏洞模式。",
    link: "#",
  },
];

export const researchDirections = [
  {
    title: "AI 驱动的程序分析",
    description: "利用大模型进行代码理解、漏洞检测与自动修复。",
  },
  {
    title: "系统底层安全",
    description: "操作系统内核、固件与硬件抽象层的安全攻防。",
  },
  {
    title: "开源安全生态",
    description: "供应链安全、依赖分析与社区漏洞响应机制。",
  },
];
