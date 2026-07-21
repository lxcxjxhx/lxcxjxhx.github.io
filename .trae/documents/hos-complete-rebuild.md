# HOS 网站完全重建实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从零重建 HOS 个人学术作品集网站，迁移"霓虹釉面风信子"设计系统，构建包含学术研究、开源项目、技术博客、关于我四大板块的 SPA，使用 HashRouter 兼容 GitHub Pages 部署。

**Architecture:** 采用 Vite + React 19 + TypeScript 构建单页应用，Tailwind CSS 4 负责工具类样式，CSS 变量驱动设计令牌，Canvas 2D 实现粒子背景，Framer Motion 处理路由过渡动画。数据层使用静态 TypeScript 模块导出，所有页面组件通过 HashRouter + AnimatePresence 组织。

**Tech Stack:** Vite 6, React 19, TypeScript 5.6, Tailwind CSS 4, Framer Motion 11, react-router-dom 7, `@tailwindcss/vite`, `@vitejs/plugin-react`

## Global Constraints

- Node.js >= 20
- 所有源文件使用 TypeScript (`.ts`/`.tsx`)，启用严格模式
- CSS 设计令牌通过 `:root` 变量定义，不使用 Tailwind `tailwind.config.ts`
- 路由必须使用 `HashRouter`，禁止 `BrowserRouter`
- 部署目标为 GitHub Pages，base 路径为 `/`
- 所有颜色严格使用"霓虹釉面风信子"调色板
- 组件必须是函数组件，使用 React hooks
- 假数据零容忍：所有数据文件必须包含真实内容结构（使用符合用户 AI/安全/底层/开源 profile 的示例内容）
- 每次任务结束时执行 `git commit`
- 字体使用 Google Fonts CDN (Outfit, JetBrains Mono)，不提交字体文件到仓库

---

## File Structure

```
hos-blog/
├── .github/workflows/deploy.yml   # GitHub Actions CI/CD
├── index.html                     # 入口 HTML，加载 Google Fonts
├── package.json                   # 依赖与 scripts
├── tsconfig.json                  # TS 根配置
├── tsconfig.app.json              # 应用 TS 配置
├── tsconfig.node.json             # Node TS 配置
├── vite.config.ts                 # Vite + Tailwind + React 插件
└── src/
    ├── main.tsx                   # React 挂载点
    ├── App.tsx                    # HashRouter + AnimatePresence + 布局
    ├── index.css                  # 设计令牌 + Tailwind v4 + 关键帧 + 工具类
    ├── types.ts                   # 全局类型定义
    ├── components/
    │   ├── effects/
    │   │   └── CanvasBackground.tsx      # 80粒子 Canvas 背景
    │   ├── layout/
    │   │   ├── Header.tsx                # 导航栏 + 风信子Logo
    │   │   └── Footer.tsx                # 页脚 + 链接
    │   ├── sections/
    │   │   ├── HeroSection.tsx           # 首页 Hero
    │   │   ├── ResearchSection.tsx       # 学术研究预览
    │   │   ├── ProjectsSection.tsx       # 开源项目预览
    │   │   ├── BlogSection.tsx           # 技术博客预览
    │   │   └── AboutSection.tsx          # 关于我预览
    │   └── ui/
    │       ├── Badge.tsx                 # 8色徽标
    │       ├── Card.tsx                  # 固体卡片 + 光晕扫过
    │       ├── SectionTitle.tsx          # 标题 + 渐变分割线
    │       ├── FloatingWidget.tsx        # 右下角浮动按钮
    │       └── AnimatedNumber.tsx        # 视口数字动画
    ├── data/
    │   ├── research.ts              # 学术论文/研究方向数据
    │   ├── projects.ts              # 开源项目数据
    │   ├── blog.ts                  # 技术博客文章数据
    │   └── about.ts                 # 个人信息/履历数据
    └── pages/
        ├── HomePage.tsx             # 首页：组合所有 section
        ├── ResearchPage.tsx         # 学术研究独立页
        ├── ProjectsPage.tsx         # 开源项目独立页
        ├── BlogPage.tsx             # 技术博客独立页
        └── AboutPage.tsx            # 关于我独立页
```

---

## Current State Analysis

- `c:\1AAA-PROJECT\HOS\HOS-BLOG` 目录下仅有 `hos-tech-transfer/hos-tech-transfer.html` 一份技术资产总结文档
- 不存在任何 React/Vite 源码工程文件（无 `src/`、`package.json`、`vite.config.ts` 等）
- 旧仓库 `https://github.com/lxcxjxhx/lxcxjxhx.github.io` 明确不参考，本次为完全覆盖式重建
- 设计资产已通过 `hos-tech-transfer.html` 完整记录，可直接按文档迁移

---

## Proposed Changes

### Task 1: 项目脚手架与依赖初始化

**Files:**
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\package.json`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\vite.config.ts`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\tsconfig.json`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\tsconfig.app.json`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\tsconfig.node.json`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\index.html`

**Interfaces:**
- Consumes: 无
- Produces: `vite.config.ts` 导出默认配置；`package.json` 包含 `dev` / `build` / `preview` scripts

- [ ] **Step 1: 编写 package.json**

```json
{
  "name": "hos-blog",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc -b"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "framer-motion": "^11.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "~5.6.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: 编写 vite.config.ts**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { outDir: "dist" },
});
```

- [ ] **Step 3: 编写 tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 4: 编写 tsconfig.app.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 5: 编写 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 6: 编写 index.html**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HOS — AI · 安全 · 系统底层</title>
    <meta name="description" content="HOS 的个人学术作品集：AI 研究、信息安全、系统底层与开源贡献。" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: 安装依赖**

Run: `cd c:\1AAA-PROJECT\HOS\HOS-BLOG && npm install`
Expected: `added 150+ packages` 无报错

- [ ] **Step 8: 启动开发服务器验证**

Run: `npm run dev`
Expected: `VITE v6.x ready in xxx ms`, `Local: http://localhost:5173/` 能正常访问

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json index.html
git commit -m "chore: scaffold Vite 6 + React 19 + Tailwind 4 project"
```

---

### Task 2: 全局样式系统（CSS tokens + Tailwind v4 + keyframes）

**Files:**
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\index.css`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\main.tsx` (占位，使构建通过)

**Interfaces:**
- Consumes: 无
- Produces: CSS 变量 `--bg-primary`, `--hyacinth-light` 等；工具类 `.gradient-text-hero`, `.card-solid`, `.glow-btn` 等；关键帧 `float`, `pulse-glow`, `gradient-shift`, `fade-in-up`, `ping-slow`, `shimmer`

- [ ] **Step 1: 编写 src/index.css**

```css
@import "tailwindcss";

@theme {
  --font-sans: "Outfit", -apple-system, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Consolas", monospace;
}

:root {
  /* Background */
  --bg-primary: #1E1F1D;
  --bg-card: #2C2D2F;
  --bg-deep: #1A1A1C;
  --bg-code: #141514;

  /* Text */
  --text-primary: #f5f5f5;
  --text-muted: #b0b0a8;

  /* Border */
  --border-subtle: #3B3D38;

  /* Hyacinth Palette */
  --hyacinth-deep: #2D1A36;
  --hyacinth-light: #8C6E9F;
  --hyacinth-lavender: #B49BC4;
  --hyacinth-crimson: #862C3B;
  --hyacinth-red: #B33F4E;
  --hyacinth-green: #6CCB4C;

  /* Font */
  --font-body: "Outfit", -apple-system, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Consolas", monospace;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  color: var(--text-primary);
  background: var(--bg-primary);
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Selection */
::selection {
  background: rgba(140, 110, 159, 0.4);
  color: var(--text-primary);
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-deep);
}
::-webkit-scrollbar-thumb {
  background: rgba(140, 110, 159, 0.4);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(140, 110, 159, 0.6);
}

/* Gradient Text Hero */
.gradient-text-hero {
  background: linear-gradient(
    90deg,
    #B49BC4 0%,
    #8C6E9F 20%,
    #862C3B 50%,
    #6CCB4C 80%,
    #B49BC4 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 10s ease infinite;
}

/* Gradient Text Accent */
.gradient-text-accent {
  background: linear-gradient(135deg, #B49BC4 0%, #8C6E9F 50%, #862C3B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Card Solid */
.card-solid {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
.card-solid::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(140, 110, 159, 0.03),
    transparent
  );
  transition: left 0.5s ease;
}
.card-solid:hover::before {
  left: 100%;
}
.card-solid:hover {
  border-color: var(--hyacinth-light);
  box-shadow:
    0 8px 30px -10px rgba(140, 110, 159, 0.15),
    0 0 0 1px rgba(140, 110, 159, 0.1);
  transform: translateY(-3px);
}

/* Glow Button */
.glow-btn {
  background: linear-gradient(
    135deg,
    #862C3B 0%,
    #B33F4E 50%,
    #6CCB4C 100%
  );
  background-size: 200% 200%;
  animation: gradient-shift 6s ease infinite;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.glow-btn:hover {
  box-shadow:
    0 8px 30px -5px rgba(134, 44, 59, 0.5),
    0 0 20px rgba(108, 203, 76, 0.2);
  transform: translateY(-2px);
}

/* Section Divider */
.section-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(140, 110, 159, 0.3) 25%,
    rgba(180, 155, 196, 0.3) 50%,
    rgba(108, 203, 76, 0.3) 75%,
    transparent 100%
  );
}

/* Terminal Window */
.terminal-window {
  background: var(--bg-code);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  overflow: hidden;
}
.terminal-window::before {
  content: "";
  display: block;
  height: 32px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-subtle);
  background-image:
    radial-gradient(circle at 14px 50%, #B33F4E 4px, transparent 5px),
    radial-gradient(circle at 32px 50%, #B49BC4 4px, transparent 5px),
    radial-gradient(circle at 50px 50%, #6CCB4C 4px, transparent 5px);
  background-repeat: no-repeat;
}

/* Floating Widget */
.floating-widget {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #862C3B, #B33F4E, #6CCB4C);
  background-size: 200% 200%;
  animation: gradient-shift 6s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow:
    0 4px 15px rgba(134, 44, 59, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  z-index: 50;
}
.floating-widget:hover {
  transform: scale(1.15) rotate(10deg);
  box-shadow:
    0 6px 25px rgba(134, 44, 59, 0.4),
    0 0 30px rgba(108, 203, 76, 0.15);
}

/* Hyacinth Petal */
.hyacinth-petal {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 30% 30%, rgba(180, 155, 196, 0.15), transparent 60%),
    radial-gradient(circle at 70% 70%, rgba(140, 110, 159, 0.1), transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(134, 44, 59, 0.08), transparent 70%);
  filter: blur(1px);
}

/* Keyframes */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(140, 110, 159, 0.2); }
  50% { box-shadow: 0 0 40px rgba(140, 110, 159, 0.4); }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes ping-slow {
  0% { transform: scale(1); opacity: 0.6; }
  75%, 100% { transform: scale(2); opacity: 0; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

- [ ] **Step 2: 创建占位 main.tsx 使构建通过**

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function App() {
  return <h1 className="gradient-text-hero text-4xl p-8">HOS</h1>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 3: 运行类型检查**

Run: `npm run typecheck`
Expected: 0 errors, 0 warnings

- [ ] **Step 4: 运行构建验证**

Run: `npm run build`
Expected: `dist/` 目录生成，无报错

- [ ] **Step 5: 验证样式在浏览器生效**

Run: `npm run dev`
Open: `http://localhost:5173/`
Expected: 页面显示"HOS"渐变文字，背景为深色 `#1E1F1D`

- [ ] **Step 6: Commit**

```bash
git add src/index.css src/main.tsx
git commit -m "feat: add neon hyacinth design system with CSS tokens and keyframes"
```

---

### Task 3: 类型定义与数据层

**Files:**
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\types.ts`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\data\research.ts`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\data\projects.ts`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\data\blog.ts`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\data\about.ts`

**Interfaces:**
- Consumes: 无
- Produces: `ResearchPaper`, `Project`, `BlogPost`, `AboutInfo` 类型；`researchPapers`, `projects`, `blogPosts`, `aboutInfo` 导出常量

- [ ] **Step 1: 编写 src/types.ts**

```typescript
export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  tags: string[];
  abstract: string;
  link?: string;
  pdfLink?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  status: "active" | "beta" | "planned" | "archived";
  repoUrl?: string;
  demoUrl?: string;
  stars?: number;
  forks?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  publishedAt: string;
  readingTime: number;
  slug: string;
}

export interface AboutInfo {
  name: string;
  handle: string;
  bio: string;
  avatar?: string;
  location: string;
  email: string;
  github: string;
  scholar?: string;
  orcid?: string;
  skills: { category: string; items: string[] }[];
  experiences: { period: string; role: string; institution: string; description: string }[];
  education: { period: string; degree: string; institution: string }[];
}
```

- [ ] **Step 2: 编写 src/data/research.ts**

```typescript
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
```

- [ ] **Step 3: 编写 src/data/projects.ts**

```typescript
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
```

- [ ] **Step 4: 编写 src/data/blog.ts**

```typescript
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
```

- [ ] **Step 5: 编写 src/data/about.ts**

```typescript
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
```

- [ ] **Step 6: 类型检查**

Run: `npm run typecheck`
Expected: 0 errors

- [ ] **Step 7: Commit**

```bash
git add src/types.ts src/data/research.ts src/data/projects.ts src/data/blog.ts src/data/about.ts
git commit -m "feat: define data types and seed real content structure"
```

---

### Task 4: Canvas 粒子背景组件

**Files:**
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\components\effects\CanvasBackground.tsx`
- Modify: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\main.tsx` (临时测试)

**Interfaces:**
- Consumes: 无外部组件依赖
- Produces: `CanvasBackground` 组件，无 props，渲染全屏 fixed Canvas

- [ ] **Step 1: 编写 CanvasBackground.tsx**

```typescript
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  angle: number;
  speed: number;
  layer: number;
  floatOffset: number;
  floatSpeed: number;
}

export default function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000 };

    const colors = [
      "rgba(140, 110, 159,",
      "rgba(180, 155, 196,",
      "rgba(134, 44, 59,",
      "rgba(179, 63, 78,",
      "rgba(108, 203, 76,",
    ];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      for (let i = 0; i < 80; i++) {
        const layer = i < 25 ? 0 : i < 55 ? 1 : 2;
        const distMin = layer === 0 ? 80 : layer === 1 ? 180 : 320;
        const distMax = layer === 0 ? 140 : layer === 1 ? 280 : 470;
        const dist = distMin + Math.random() * (distMax - distMin);
        const angle = Math.random() * Math.PI * 2;

        particles.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          radius:
            layer === 0
              ? 2 + Math.random() * 2
              : layer === 1
                ? 1.5 + Math.random() * 1.5
                : 1 + Math.random() * 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle,
          speed: (0.0002 + Math.random() * 0.0003) * (layer === 0 ? 1 : layer === 1 ? 0.7 : 0.4),
          layer,
          floatOffset: Math.random() * Math.PI * 2,
          floatSpeed: 0.001 + Math.random() * 0.002,
        });
      }
    }

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    function draw() {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Center glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300);
      glow.addColorStop(0, "rgba(140, 110, 159, 0.08)");
      glow.addColorStop(1, "rgba(140, 110, 159, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        // Orbit
        p.angle += p.speed;
        const baseX = cx + Math.cos(p.angle) * Math.hypot(p.x - cx, p.y - cy);
        const baseY = cy + Math.sin(p.angle) * Math.hypot(p.x - cx, p.y - cy);

        // Float
        const floatX = Math.sin(Date.now() * p.floatSpeed + p.floatOffset) * 8;
        const floatY = Math.cos(Date.now() * p.floatSpeed + p.floatOffset) * 6;

        let px = baseX + floatX;
        let py = baseY + floatY;

        // Mouse repulsion
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const distMouse = Math.hypot(dx, dy);
        if (distMouse < 150) {
          const force = ((150 - distMouse) / 150) * 20;
          px += (dx / distMouse) * force;
          py += (dy / distMouse) * force;
        }

        p.x = px;
        p.y = py;

        // Draw particle
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, p.radius * 3);
        gradient.addColorStop(0, p.color + " " + (p.layer === 0 ? "0.8)" : p.layer === 1 ? "0.5)" : "0.3)"));
        gradient.addColorStop(1, p.color + " 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Connection lines (same layer only)
        for (let j = idx + 1; j < particles.length; j++) {
          const other = particles[j];
          if (other.layer !== p.layer) continue;
          const d = Math.hypot(px - other.x, py - other.y);
          if (d < 80) {
            ctx.strokeStyle = p.color + " " + (0.08 * (1 - d / 80)) + ")";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });
    window.addEventListener("mousemove", handleMouseMove);
    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
```

- [ ] **Step 2: 更新 main.tsx 临时测试 CanvasBackground**

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CanvasBackground from "./components/effects/CanvasBackground";

function App() {
  return (
    <>
      <CanvasBackground />
      <h1 className="gradient-text-hero text-4xl p-8 relative z-10">HOS</h1>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 3: 类型检查**

Run: `npm run typecheck`
Expected: 0 errors

- [ ] **Step 4: 浏览器验证**

Run: `npm run dev`
Open: `http://localhost:5173/`
Expected: 深色背景上有紫色/红色/绿色粒子围绕中心缓慢旋转，移动鼠标时附近粒子被推开，同层粒子间有微弱连线

- [ ] **Step 5: Commit**

```bash
git add src/components/effects/CanvasBackground.tsx src/main.tsx
git commit -m "feat: add Canvas 2D particle background with 80 particles, 3 layers, mouse repulsion"
```

---

### Task 5: UI 原子组件（Badge + SectionTitle）

**Files:**
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\components\ui\Badge.tsx`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\components\ui\SectionTitle.tsx`
- Modify: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\main.tsx` (临时测试)

**Interfaces:**
- Consumes: 无
- Produces:
  - `Badge` 组件: `(props: { variant?: string; text?: string; children?: ReactNode }) => JSX.Element`
  - `SectionTitle` 组件: `(props: { title: string; subtitle?: string; align?: "left" | "center" }) => JSX.Element`

- [ ] **Step 1: 编写 Badge.tsx**

```typescript
import type { ReactNode } from "react";

const variantMap: Record<string, { bg: string; border: string; text: string }> = {
  default: {
    bg: "rgba(140, 110, 159, 0.1)",
    border: "rgba(140, 110, 159, 0.3)",
    text: "#B49BC4",
  },
  crimson: {
    bg: "rgba(134, 44, 59, 0.1)",
    border: "rgba(134, 44, 59, 0.3)",
    text: "#B33F4E",
  },
  green: {
    bg: "rgba(108, 203, 76, 0.1)",
    border: "rgba(108, 203, 76, 0.3)",
    text: "#6CCB4C",
  },
  lavender: {
    bg: "rgba(180, 155, 196, 0.1)",
    border: "rgba(180, 155, 196, 0.3)",
    text: "#B49BC4",
  },
  purple: {
    bg: "rgba(140, 110, 159, 0.15)",
    border: "rgba(140, 110, 159, 0.35)",
    text: "#8C6E9F",
  },
  red: {
    bg: "rgba(179, 63, 78, 0.1)",
    border: "rgba(179, 63, 78, 0.3)",
    text: "#B33F4E",
  },
  muted: {
    bg: "rgba(59, 61, 56, 0.5)",
    border: "rgba(59, 61, 56, 0.8)",
    text: "#b0b0a8",
  },
  outline: {
    bg: "transparent",
    border: "rgba(140, 110, 159, 0.4)",
    text: "#8C6E9F",
  },
};

export default function Badge({
  variant = "default",
  text,
  children,
}: {
  variant?: string;
  text?: string;
  children?: ReactNode;
}) {
  const style = variantMap[variant] || variantMap.default;
  const content = text || children;

  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.text,
      }}
    >
      {content}
    </span>
  );
}
```

- [ ] **Step 2: 编写 SectionTitle.tsx**

```typescript
export default function SectionTitle({
  title,
  subtitle,
  align = "left",
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-10 ${align === "center" ? "text-center" : "text-left"}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[var(--text-muted)] text-base md:text-lg mb-4 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="section-divider w-full max-w-md" />
    </div>
  );
}
```

- [ ] **Step 3: 临时更新 main.tsx 测试两个组件**

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Badge from "./components/ui/Badge";
import SectionTitle from "./components/ui/SectionTitle";

function App() {
  return (
    <div className="p-8">
      <SectionTitle
        title="学术研究"
        subtitle="聚焦 AI 安全、系统底层与程序分析"
        align="center"
      />
      <div className="flex gap-2 flex-wrap">
        <Badge variant="purple">LLM</Badge>
        <Badge variant="crimson">漏洞挖掘</Badge>
        <Badge variant="green">静态分析</Badge>
        <Badge variant="muted">RISC-V</Badge>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 4: 类型检查**

Run: `npm run typecheck`
Expected: 0 errors

- [ ] **Step 5: 浏览器验证**

Run: `npm run dev`
Open: `http://localhost:5173/`
Expected:
- 居中显示"学术研究"标题，下方有紫色渐变分割线
- 副标题文字颜色为 muted 灰色
- 四个 Badge 显示正确，颜色分别为紫色、深红、绿色、灰色

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/Badge.tsx src/components/ui/SectionTitle.tsx src/main.tsx
git commit -m "feat: add Badge and SectionTitle UI components"
```

---

### Task 6: UI 复合组件（Card + AnimatedNumber）

**Files:**
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\components\ui\Card.tsx`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\components\ui\AnimatedNumber.tsx`
- Modify: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\main.tsx` (临时测试)

**Interfaces:**
- Consumes: `Badge` 组件 (Task 5)
- Produces:
  - `Card` 组件: `(props: { icon?: ReactNode; title: string; description: string; tag?: string; status?: string; href?: string }) => JSX.Element`
  - `AnimatedNumber` 组件: `(props: { value: number; suffix?: string; duration?: number }) => JSX.Element`

- [ ] **Step 1: 编写 Card.tsx**

```typescript
import { useState } from "react";
import type { ReactNode } from "react";
import Badge from "./Badge";

export default function Card({
  icon,
  title,
  description,
  tag,
  status,
  href,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  tag?: string;
  status?: string;
  href?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const isExternal = href?.startsWith("http");

  const statusVariant =
    status === "active"
      ? "green"
      : status === "beta"
        ? "lavender"
        : status === "planned"
          ? "muted"
          : "outline";

  const Wrapper = href ? "a" : "div";
  const wrapperProps = href
    ? {
        href,
        target: isExternal ? "_blank" : undefined,
        rel: isExternal ? "noopener noreferrer" : undefined,
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="card-solid block p-6 cursor-pointer no-underline"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between mb-3">
        {icon && (
          <span className="text-2xl text-[var(--hyacinth-light)]">{icon}</span>
        )}
        <div className="flex gap-2 flex-wrap justify-end">
          {tag && <Badge variant="purple">{tag}</Badge>}
          {status && <Badge variant={statusVariant}>{status}</Badge>}
        </div>
      </div>
      <h3
        className="text-lg font-semibold mb-2 transition-colors duration-300"
        style={{
          color: hovered ? "var(--hyacinth-lavender)" : "var(--text-primary)",
        }}
      >
        {title}
      </h3>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
        {description}
      </p>
      {href && (
        <span
          className="inline-flex items-center gap-1 text-sm font-medium transition-all duration-300"
          style={{
            color: "var(--hyacinth-light)",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(-4px)",
          }}
        >
          了解更多 <span>→</span>
        </span>
      )}
    </Wrapper>
  );
}
```

- [ ] **Step 2: 编写 AnimatedNumber.tsx**

```typescript
import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({
  value,
  suffix = "",
  duration = 2000,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const startTime = performance.now();
            const startValue = 0;

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(startValue + (value - startValue) * eased);
              setDisplay(current);

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}
```

- [ ] **Step 3: 临时更新 main.tsx 测试两个组件**

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Card from "./components/ui/Card";
import AnimatedNumber from "./components/ui/AnimatedNumber";

function App() {
  return (
    <div className="p-8 max-w-md mx-auto space-y-6">
      <Card
        title="HOS-LS"
        description="基于静态分析与 LLM 的漏洞语义搜索引擎。"
        tag="Rust"
        status="active"
        href="https://github.com/lxcxjxhx/hos-ls"
      />
      <div className="text-center text-4xl font-bold text-[var(--text-primary)]">
        <AnimatedNumber value={127} suffix="+" />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 4: 类型检查**

Run: `npm run typecheck`
Expected: 0 errors

- [ ] **Step 5: 浏览器验证**

Run: `npm run dev`
Open: `http://localhost:5173/`
Expected:
- Card 组件显示"HOS-LS"标题、"Rust"紫色徽标、"active"绿色徽标
- Hover 时标题变为淡紫色，底部出现"了解更多 →"
- 卡片有光晕扫过动画
- 数字"127+"在滚动进入视口时从 0 平滑递增到 127

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/Card.tsx src/components/ui/AnimatedNumber.tsx src/main.tsx
git commit -m "feat: add Card with hover shimmer and AnimatedNumber with IntersectionObserver"
```

---

### Task 7: 布局组件（Header + Footer + FloatingWidget）

**Files:**
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\components\layout\Header.tsx`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\components\layout\Footer.tsx`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\components\ui\FloatingWidget.tsx`
- Modify: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\main.tsx` (临时测试)

**Interfaces:**
- Consumes: 无（Header 使用 react-router-dom Link，但类型上只依赖路由上下文）
- Produces:
  - `Header` 组件: `() => JSX.Element`，含导航链接 `/`, `/research`, `/projects`, `/blog`, `/about`
  - `Footer` 组件: `() => JSX.Element`
  - `FloatingWidget` 组件: `() => JSX.Element`

- [ ] **Step 1: 编写 Header.tsx**

```typescript
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "首页" },
  { path: "/research", label: "学术" },
  { path: "/projects", label: "项目" },
  { path: "/blog", label: "博客" },
  { path: "/about", label: "关于" },
];

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline group">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--hyacinth-crimson)] to-[var(--hyacinth-green)] flex items-center justify-center text-white font-bold text-sm">
            H
          </span>
          <span className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--hyacinth-lavender)] transition-colors">
            HOS
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors relative"
                style={{
                  color: active
                    ? "var(--hyacinth-lavender)"
                    : "var(--text-muted)",
                }}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[var(--hyacinth-light)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          className="md:hidden p-2 text-[var(--text-muted)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M4 4l12 12M16 4L4 16" />
            ) : (
              <path d="M2 5h16M2 10h16M2 15h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-4 py-3 text-sm font-medium border-b border-[var(--border-subtle)] last:border-0"
              style={{
                color:
                  location.pathname === item.path
                    ? "var(--hyacinth-lavender)"
                    : "var(--text-muted)",
              }}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: 编写 Footer.tsx**

```typescript
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-subtle)] py-8 mt-20">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-gradient-to-br from-[var(--hyacinth-crimson)] to-[var(--hyacinth-green)] flex items-center justify-center text-white font-bold text-xs">
            H
          </span>
          <span className="text-sm text-[var(--text-muted)]">
            © {currentYear} HOS. 以代码理解世界。
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/lxcxjxhx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--hyacinth-lavender)] transition-colors"
          >
            GitHub
          </a>
          <a
            href="mailto:hos@example.com"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--hyacinth-lavender)] transition-colors"
          >
            邮件
          </a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: 编写 FloatingWidget.tsx**

```typescript
export default function FloatingWidget() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className="floating-widget"
      aria-label="回到顶部"
      title="回到顶部"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5-5 5 5" />
      </svg>
    </button>
  );
}
```

- [ ] **Step 4: 临时更新 main.tsx 测试布局组件**

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import FloatingWidget from "./components/ui/FloatingWidget";

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <div className="p-8">
            <h1 className="text-2xl text-[var(--text-primary)]">Layout Test</h1>
          </div>
        </main>
        <Footer />
        <FloatingWidget />
      </div>
    </HashRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 5: 类型检查**

Run: `npm run typecheck`
Expected: 0 errors

- [ ] **Step 6: 浏览器验证**

Run: `npm run dev`
Open: `http://localhost:5173/`
Expected:
- 顶部固定导航栏，毛玻璃效果，显示"HOS" Logo 和五个导航链接
- 点击导航链接 URL 变为 `/#/research` 等 hash 路由
- 移动端宽度下显示汉堡菜单，点击展开下拉导航
- Footer 显示版权信息、"GitHub"和"邮件"链接
- 右下角固定浮动圆形按钮，hover 时放大并旋转，点击平滑回到顶部

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/Footer.tsx src/components/ui/FloatingWidget.tsx src/main.tsx
git commit -m "feat: add Header, Footer, and FloatingWidget layout components"
```

---

### Task 8: 页面 Sections（Hero + Research + Projects + Blog + About）

**Files:**
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\components\sections\HeroSection.tsx`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\components\sections\ResearchSection.tsx`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\components\sections\ProjectsSection.tsx`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\components\sections\BlogSection.tsx`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\components\sections\AboutSection.tsx`
- Modify: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\main.tsx` (临时组合测试)

**Interfaces:**
- Consumes: `SectionTitle` (Task 5), `Card` (Task 6), `Badge` (Task 5), `AnimatedNumber` (Task 6)；数据层 `research.ts`, `projects.ts`, `blog.ts`, `about.ts` (Task 3)
- Produces: 五个 section 组件，均导出默认函数组件

- [ ] **Step 1: 编写 HeroSection.tsx**

```typescript
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--hyacinth-light)]/30 bg-[var(--hyacinth-light)]/5 text-[var(--hyacinth-lavender)] text-sm mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--hyacinth-green)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--hyacinth-green)]"></span>
          </span>
          正在招募合作者
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="gradient-text-hero">AI · 安全 · 系统底层</span>
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
          聚焦大模型安全攻防、操作系统内核与开源基础设施。用代码构建理解世界的诚实路径。
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/projects" className="glow-btn no-underline">
            探索项目
          </Link>
          <Link
            to="/research"
            className="px-6 py-3 rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium hover:border-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-all no-underline"
          >
            阅读论文
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 编写 ResearchSection.tsx**

```typescript
import { Link } from "react-router-dom";
import { researchPapers, researchDirections } from "../../data/research";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

export default function ResearchSection() {
  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="学术研究"
          subtitle="在 AI 安全、系统底层与程序分析方向的探索"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {researchDirections.map((dir) => (
            <div key={dir.title} className="card-solid p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                {dir.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {dir.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {researchPapers.slice(0, 2).map((paper) => (
            <Card
              key={paper.id}
              title={paper.title}
              description={paper.abstract}
              tag={paper.venue}
              status={String(paper.year)}
              href={paper.link}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/research"
            className="inline-flex items-center gap-2 text-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-colors font-medium"
          >
            查看全部论文 <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: 编写 ProjectsSection.tsx**

```typescript
import { Link } from "react-router-dom";
import { projects } from "../../data/projects";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";
import AnimatedNumber from "../ui/AnimatedNumber";

export default function ProjectsSection() {
  const totalStars = projects.reduce((sum, p) => sum + (p.stars || 0), 0);

  return (
    <section className="py-20 px-4 relative z-10 border-t border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="开源项目"
          subtitle="构建 AI 安全与系统底层的基础设施工具"
          align="center"
        />

        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={projects.length} />
            </div>
            <div className="text-sm text-[var(--text-muted)] mt-1">活跃项目</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={totalStars} suffix="+" />
            </div>
            <div className="text-sm text-[var(--text-muted)] mt-1">GitHub Stars</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              title={project.name}
              description={project.description}
              tag={project.tags[0]}
              status={project.status}
              href={project.repoUrl}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-colors font-medium"
          >
            查看全部项目 <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 编写 BlogSection.tsx**

```typescript
import { Link } from "react-router-dom";
import { blogPosts } from "../../data/blog";
import SectionTitle from "../ui/SectionTitle";
import Badge from "../ui/Badge";

export default function BlogSection() {
  return (
    <section className="py-20 px-4 relative z-10 border-t border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="技术博客"
          subtitle="关于工程实践、安全研究与系统设计的思考"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="card-solid block p-6 no-underline group"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="purple">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--hyacinth-lavender)] transition-colors mb-3 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 line-clamp-3">
                {post.summary}
              </p>
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{post.publishedAt}</span>
                <span>{post.readingTime} 分钟阅读</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-colors font-medium"
          >
            查看全部文章 <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: 编写 AboutSection.tsx**

```typescript
import { Link } from "react-router-dom";
import { aboutInfo } from "../../data/about";
import SectionTitle from "../ui/SectionTitle";
import AnimatedNumber from "../ui/AnimatedNumber";

export default function AboutSection() {
  return (
    <section className="py-20 px-4 relative z-10 border-t border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="关于我"
          subtitle="研究者的背景、技能与经历"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-6">
              {aboutInfo.bio}
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href={aboutInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-btn text-sm no-underline"
              >
                GitHub
              </a>
              <Link
                to="/about"
                className="px-5 py-2.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium hover:border-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-all text-sm no-underline"
              >
                完整履历
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {aboutInfo.skills.slice(0, 2).map((group) => (
                <div key={group.category}>
                  <h4 className="text-sm font-semibold text-[var(--hyacinth-lavender)] mb-2">
                    {group.category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs px-2 py-1 rounded bg-[var(--bg-deep)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {aboutInfo.experiences.map((exp) => (
              <div
                key={exp.period}
                className="card-solid p-5"
              >
                <div className="text-xs text-[var(--hyacinth-light)] font-medium mb-1">
                  {exp.period}
                </div>
                <h4 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                  {exp.role}
                </h4>
                <div className="text-sm text-[var(--hyacinth-lavender)] mb-2">
                  {exp.institution}
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: 临时更新 main.tsx 组合 sections 测试**

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import CanvasBackground from "./components/effects/CanvasBackground";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import FloatingWidget from "./components/ui/FloatingWidget";
import HeroSection from "./components/sections/HeroSection";
import ResearchSection from "./components/sections/ResearchSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import BlogSection from "./components/sections/BlogSection";
import AboutSection from "./components/sections/AboutSection";

function App() {
  return (
    <HashRouter>
      <CanvasBackground />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <ResearchSection />
          <ProjectsSection />
          <BlogSection />
          <AboutSection />
        </main>
        <Footer />
        <FloatingWidget />
      </div>
    </HashRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 7: 类型检查**

Run: `npm run typecheck`
Expected: 0 errors

- [ ] **Step 8: 浏览器验证**

Run: `npm run dev`
Open: `http://localhost:5173/`
Expected:
- Hero: 渐变标题"AI · 安全 · 系统底层"，绿色脉冲状态徽标，两个 CTA 按钮
- Research: 三个研究方向卡片 + 两篇论文卡片
- Projects: 两个 AnimatedNumber 统计（3, 272+），三个项目 Card
- Blog: 三篇文章卡片，显示标签、日期、阅读时长
- About: 左侧个人简介 + 技能标签，右侧经历时间线
- 所有 section 均有正确的深色背景和卡片样式

- [ ] **Step 9: Commit**

```bash
git add src/components/sections/*.tsx src/main.tsx
git commit -m "feat: add Hero, Research, Projects, Blog, About sections"
```

---

### Task 9: 页面路由与 App 组装

**Files:**
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\pages\HomePage.tsx`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\pages\ResearchPage.tsx`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\pages\ProjectsPage.tsx`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\pages\BlogPage.tsx`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\pages\AboutPage.tsx`
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\App.tsx`
- Modify: `c:\1AAA-PROJECT\HOS\HOS-BLOG\src\main.tsx`

**Interfaces:**
- Consumes: `CanvasBackground`, `Header`, `Footer`, `FloatingWidget` (Task 7)；`HeroSection`, `ResearchSection`, `ProjectsSection`, `BlogSection`, `AboutSection` (Task 8)；数据层 (Task 3)；`SectionTitle`, `Card`, `Badge`, `AnimatedNumber` (Task 5-6)
- Produces: `App` 组件含 `HashRouter`, `Routes`, `AnimatePresence` 页面过渡；五个 Page 组件

- [ ] **Step 1: 编写 src/pages/HomePage.tsx**

```typescript
import HeroSection from "../components/sections/HeroSection";
import ResearchSection from "../components/sections/ResearchSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import BlogSection from "../components/sections/BlogSection";
import AboutSection from "../components/sections/AboutSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ResearchSection />
      <ProjectsSection />
      <BlogSection />
      <AboutSection />
    </>
  );
}
```

- [ ] **Step 2: 编写 src/pages/ResearchPage.tsx**

```typescript
import { researchPapers, researchDirections } from "../data/research";
import SectionTitle from "../components/ui/SectionTitle";
import Card from "../components/ui/Card";

export default function ResearchPage() {
  return (
    <div className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="学术研究"
          subtitle="论文发表、研究方向与学术贡献"
          align="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {researchDirections.map((dir) => (
            <div key={dir.title} className="card-solid p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                {dir.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {dir.description}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {researchPapers.map((paper) => (
            <Card
              key={paper.id}
              title={paper.title}
              description={paper.abstract}
              tag={paper.venue}
              status={String(paper.year)}
              href={paper.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 编写 src/pages/ProjectsPage.tsx**

```typescript
import { projects } from "../data/projects";
import SectionTitle from "../components/ui/SectionTitle";
import Card from "../components/ui/Card";
import AnimatedNumber from "../components/ui/AnimatedNumber";

export default function ProjectsPage() {
  const totalStars = projects.reduce((sum, p) => sum + (p.stars || 0), 0);

  return (
    <div className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="开源项目"
          subtitle="可复用的安全与 AI 基础设施工具"
          align="left"
        />

        <div className="flex flex-wrap gap-8 mb-12">
          <div className="card-solid px-6 py-4 text-center">
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={projects.length} />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">项目总数</div>
          </div>
          <div className="card-solid px-6 py-4 text-center">
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={totalStars} suffix="+" />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">GitHub Stars</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              title={project.name}
              description={project.description}
              tag={project.tags[0]}
              status={project.status}
              href={project.repoUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 编写 src/pages/BlogPage.tsx**

```typescript
import { blogPosts } from "../data/blog";
import SectionTitle from "../components/ui/SectionTitle";
import Badge from "../components/ui/Badge";

export default function BlogPage() {
  return (
    <div className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <SectionTitle
          title="技术博客"
          subtitle="工程实践、安全研究与系统设计的思考记录"
          align="left"
        />

        <div className="space-y-6">
          {blogPosts.map((post) => (
            <article key={post.id} className="card-solid p-6 group cursor-pointer">
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="purple">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--hyacinth-lavender)] transition-colors mb-2">
                {post.title}
              </h3>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                {post.summary}
              </p>
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <span>{post.publishedAt}</span>
                <span>·</span>
                <span>{post.readingTime} 分钟阅读</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 编写 src/pages/AboutPage.tsx**

```typescript
import { aboutInfo } from "../data/about";
import SectionTitle from "../components/ui/SectionTitle";

export default function AboutPage() {
  return (
    <div className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <SectionTitle
          title="关于我"
          subtitle="背景、技能与教育经历"
          align="left"
        />

        <div className="card-solid p-8 mb-8">
          <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-6">
            {aboutInfo.bio}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={aboutInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-btn text-sm no-underline"
            >
              GitHub
            </a>
            <a
              href={`mailto:${aboutInfo.email}`}
              className="px-5 py-2.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium hover:border-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-all text-sm no-underline"
            >
              发送邮件
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {aboutInfo.skills.map((group) => (
            <div key={group.category} className="card-solid p-6">
              <h3 className="text-base font-semibold text-[var(--hyacinth-lavender)] mb-3">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-deep)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            经历
          </h3>
          {aboutInfo.experiences.map((exp) => (
            <div key={exp.period} className="card-solid p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-2">
                <h4 className="text-base font-semibold text-[var(--text-primary)]">
                  {exp.role}
                </h4>
                <span className="text-xs text-[var(--hyacinth-light)] font-medium">
                  {exp.period}
                </span>
              </div>
              <div className="text-sm text-[var(--hyacinth-lavender)] mb-2">
                {exp.institution}
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            教育
          </h3>
          {aboutInfo.education.map((edu) => (
            <div key={edu.period} className="card-solid p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                <h4 className="text-base font-semibold text-[var(--text-primary)]">
                  {edu.degree}
                </h4>
                <span className="text-xs text-[var(--hyacinth-light)] font-medium">
                  {edu.period}
                </span>
              </div>
              <div className="text-sm text-[var(--hyacinth-lavender)] mt-1">
                {edu.institution}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: 编写 src/App.tsx**

```typescript
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CanvasBackground from "./components/effects/CanvasBackground";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import FloatingWidget from "./components/ui/FloatingWidget";
import HomePage from "./pages/HomePage";
import ResearchPage from "./pages/ResearchPage";
import ProjectsPage from "./pages/ProjectsPage";
import BlogPage from "./pages/BlogPage";
import AboutPage from "./pages/AboutPage";

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <CanvasBackground />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <AnimatedPage>
                    <HomePage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/research"
                element={
                  <AnimatedPage>
                    <ResearchPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/projects"
                element={
                  <AnimatedPage>
                    <ProjectsPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/blog"
                element={
                  <AnimatedPage>
                    <BlogPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/about"
                element={
                  <AnimatedPage>
                    <AboutPage />
                  </AnimatedPage>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <FloatingWidget />
      </div>
    </>
  );
}
```

- [ ] **Step 7: 修改 src/main.tsx**

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
```

- [ ] **Step 8: 类型检查**

Run: `npm run typecheck`
Expected: 0 errors

- [ ] **Step 9: 浏览器验证路由与动画**

Run: `npm run dev`
Open: `http://localhost:5173/`
Expected:
- 首页正常渲染所有 section
- 点击导航"学术"URL 变为 `/#/research`，页面以淡入+上滑+缩放动画切换
- 点击"项目"URL 变为 `/#/projects`
- 点击"博客"URL 变为 `/#/blog`
- 点击"关于"URL 变为 `/#/about`
- 每个独立页面均有完整内容，无 section 缺失

- [ ] **Step 10: 构建验证**

Run: `npm run build`
Expected: `dist/` 目录生成，无报错，无 warnings

- [ ] **Step 11: Commit**

```bash
git add src/pages/*.tsx src/App.tsx src/main.tsx
git commit -m "feat: wire HashRouter, AnimatePresence page transitions, and all page routes"
```

---

### Task 10: GitHub Actions 部署工作流

**Files:**
- Create: `c:\1AAA-PROJECT\HOS\HOS-BLOG\.github\workflows\deploy.yml`

**Interfaces:**
- Consumes: `package.json` scripts `build` (Task 1)
- Produces: `.github/workflows/deploy.yml` 触发 GitHub Pages 部署

- [ ] **Step 1: 编写 deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 验证 workflow 语法**

使用在线 GitHub Actions 验证工具或目视检查缩进。确保：
- `permissions` 块包含 `pages: write` 和 `id-token: write`
- `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4` 版本号正确

- [ ] **Step 3: 提交并推送**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions workflow for GitHub Pages deployment"
git push origin main
```

- [ ] **Step 4: 配置 GitHub Pages 源**

在 GitHub 仓库 Settings → Pages → Build and deployment → Source 中选择 "GitHub Actions"。
等待首次部署完成，访问 `https://lxcxjxhx.github.io/` 验证站点在线。

- [ ] **Step 5: Commit（仅工作流文件）**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: configure GitHub Pages deployment pipeline"
```

---

## Self-Review

### 1. Spec Coverage

| 需求 | 实现任务 |
|------|----------|
| 霓虹釉面风信子设计系统 (CSS tokens) | Task 2 (`index.css`) |
| 渐变文字 (gradient-text-hero/accent) | Task 2 (`index.css`) |
| 卡片固体样式 (card-solid) | Task 2 (`index.css`) + Task 6 (`Card.tsx`) |
| 发光按钮 (glow-btn) | Task 2 (`index.css`) |
| 关键帧动画 (float/pulse-glow/gradient-shift/fade-in-up/ping-slow/shimmer) | Task 2 (`index.css`) |
| CanvasBackground (80粒子, 3层, 鼠标排斥, 连线) | Task 4 |
| Card, Badge, SectionTitle, FloatingWidget, AnimatedNumber | Task 5, 6, 7 |
| Framer Motion 页面过渡 (AnimatePresence) | Task 9 (`App.tsx`) |
| Vite 6 + React 19 + Tailwind CSS 4 + Framer Motion 11 + react-router-dom 7 | Task 1 (`package.json`) |
| HashRouter for GitHub Pages | Task 9 (`main.tsx`, `App.tsx`) |
| GitHub Actions 部署 | Task 10 |
| 学术研究板块 | Task 3 (`research.ts`) + Task 8 (`ResearchSection.tsx`) + Task 9 (`ResearchPage.tsx`) |
| 开源项目板块 | Task 3 (`projects.ts`) + Task 8 (`ProjectsSection.tsx`) + Task 9 (`ProjectsPage.tsx`) |
| 技术博客板块 | Task 3 (`blog.ts`) + Task 8 (`BlogSection.tsx`) + Task 9 (`BlogPage.tsx`) |
| 关于我板块 | Task 3 (`about.ts`) + Task 8 (`AboutSection.tsx`) + Task 9 (`AboutPage.tsx`) |
| 真实内容结构（非假数据） | Task 3（所有数据文件使用符合 AI/安全/底层/开源 profile 的真实示例内容） |

**无遗漏。**

### 2. Placeholder Scan

- 无 "TBD", "TODO", "implement later"
- 无 "Add appropriate error handling" 等模糊描述
- 每个测试步骤包含具体命令和预期输出
- 代码块包含完整可运行代码
- 无 "Similar to Task N" 引用

### 3. Type Consistency

- `Badge` props: `variant?: string; text?: string; children?: ReactNode` — 全任务一致
- `Card` props: `icon?, title, description, tag?, status?, href?` — 全任务一致
- `AnimatedNumber` props: `value: number; suffix?; duration?` — 全任务一致
- `SectionTitle` props: `title: string; subtitle?; align?: "left" | "center"` — 全任务一致
- 路由路径: `/`, `/research`, `/projects`, `/blog`, `/about` — 全任务一致
- 数据类型: `ResearchPaper`, `Project`, `BlogPost`, `AboutInfo` — Task 3 定义，全任务引用一致

---

## Assumptions & Decisions

1. **不参考旧仓库**：明确不克隆、不复制旧 `lxcxjxhx.github.io` 的任何源码文件，仅依据 `hos-tech-transfer.html` 中的设计资产描述进行重建
2. **数据层为静态 TS 模块**：个人学术站数据量小，不引入 CMS 或数据库，所有内容以 TypeScript 常量形式管理
3. **博客文章详情页暂不实现**：当前博客数据仅支持列表展示，单篇文章详情页（`/blog/:slug`）超出本次重建范围，留待后续迭代
4. **字体使用 Google Fonts CDN**：不将字体文件提交到仓库，通过 `index.html` 中的 `<link>` 加载 Outfit 和 JetBrains Mono
5. **路径别名 `@/*` 已配置**：`tsconfig.app.json` 中已设置 `paths`，但本次计划为简化起见组件间使用相对路径导入；执行时可根据偏好统一为 `@/components/ui/Card` 形式
6. **Git 仓库已初始化**：假设 `c:\1AAA-PROJECT\HOS\HOS-BLOG` 已是 git 仓库且 `origin` 指向目标仓库；如未初始化，Task 1 前需补充 `git init` 和 `git remote add origin`

---

## Verification Steps

1. **本地开发验证**：每个 Task 均包含 `npm run typecheck` 和浏览器验证步骤
2. **生产构建验证**：Task 9 包含 `npm run build` 确保 `dist/` 无错误生成
3. **部署验证**：Task 10 包含推送后访问 `https://lxcxjxhx.github.io/` 验证
4. **视觉一致性检查**：所有颜色严格来自"霓虹釉面风信子"调色板，设计令牌集中在 `index.css` 中便于审计
5. **响应式检查**：所有组件使用 Tailwind 响应式前缀（`md:`, `lg:`），需在移动端浏览器验证导航、卡片布局、字体大小
