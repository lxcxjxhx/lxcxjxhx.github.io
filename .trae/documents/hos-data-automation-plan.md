# HOS 个人作品集 — 真实数据整合与页面完善计划

## Summary

将当前基于 GitHub Events 的「伪博客」系统替换为从 CSDN 博客自动拉取的真实文章数据；将学术/研究方向从虚构论文转向基于 Resume 仓库的真实研究领域与成果；为 About、Projects 等页面注入真实个人信息（联系方式、认证、竞赛、技能）；重新设计 Favicon；统一并丰富各页面排版结构。所有外部数据均在构建时通过 Node.js 脚本获取并生成静态 TypeScript 数据文件，确保 GitHub Pages 纯静态托管兼容性。

---

## Current State Analysis

### 数据层

| 文件 | 当前状态 | 问题 |
|------|---------|------|
| `src/data/blog.ts` | 将 GitHub Events 包装成 `BlogPost` 接口，生成「最近动态」 | 用户明确要求博客应来自 CSDN，而非 GitHub commits |
| `src/data/research.ts` | 3 个方向卡片 + 空的 `researchPapers: never[]` | 方向描述基本合理，但缺乏 Resume 中的真实成就支撑；页面有「阅读论文」按钮却无任何论文 |
| `src/data/about.ts` | `location: ""`, `email: ""`, `experiences: []`, `education: []` | 关键个人信息全部空缺，依赖 GitHub API 的 bio 过于简略 |
| `src/data/github-data.ts` | 构建时自动生成，包含 profile/repos/events | 稳定可用，保留不变 |

### 页面层

| 文件 | 当前状态 | 问题 |
|------|---------|------|
| `src/pages/BlogPage.tsx` | 标题「最近动态」，副标题「GitHub 开源活动记录」，渲染 `getActivityFeed()` | 整页是 GitHub events 伪装成博客 |
| `src/pages/ResearchPage.tsx` | 3 个方向卡片 + 条件渲染的空论文区块 | 论文区块永远隐藏，页面单薄 |
| `src/pages/AboutPage.tsx` | Bio + 技能网格 + 条件隐藏的经历/教育 | 经历教育为空时不显示，页面内容不足 |
| `src/pages/ProjectsPage.tsx` | 项目数 + Stars 统计 + 项目卡片网格 | 缺少语言分布统计、外部平台（PyPI/HuggingFace）链接 |
| `src/components/sections/HeroSection.tsx` | 静态 badge「正在招募合作者」 | 与 Resume 中真实数据脱节，应展示真实统计 |
| `src/components/sections/BlogSection.tsx` | 首页博客预览，同样来自 GitHub events | 需同步替换为 CSDN 数据 |
| `src/components/sections/ResearchSection.tsx` | 首页研究预览，3 个方向卡片 | 需增加成就/认证预览 |
| `src/components/sections/AboutSection.tsx` | 首页关于预览，Bio + 技能 + 经历占位 | 需展示真实数据 |
| `src/components/layout/Footer.tsx` | GitHub + 邮件链接 | 缺少 CSDN、PyPI、HuggingFace 等真实活跃平台 |
| `index.html` | 无 favicon / apple-touch-icon | 浏览器标签页无图标 |

### 构建流水线

| 文件 | 当前状态 | 问题 |
|------|---------|------|
| `package.json` | `prebuild` 仅运行 `fetch-github-data.mjs` | 缺少 CSDN 数据获取步骤 |
| `.github/workflows/deploy.yml` | 仅 fetch GitHub data | 缺少 CSDN fetch 步骤 |
| `.gitignore` | 忽略 node_modules/dist 等 | 未忽略生成的 `src/data/csdn-data.ts` |

---

## Proposed Changes

### Module 1: CSDN 博客数据自动化

**目标**：构建时从 CSDN 博客获取真实文章列表，替换 GitHub Events 伪博客。

**决策前提**：CSDN 的 RSS 订阅（`https://security-hyacinth.blog.csdn.net/rss/list`）和开放 API 均被 WAF 拦截，返回 403/验证码。唯一可行的方案是 fetch 博客首页 HTML 并用正则解析。用户提到的「每天扫后五位数字」不可行，因为文章 ID 前缀会随时间变化（156xxx → 162xxx），且 ID 不连续（851113 与 840157 相差超过 10,000）。

#### 1.1 新建 `scripts/fetch-csdn-data.mjs`

- 使用原生 `fetch` 请求 `https://security-hyacinth.blog.csdn.net/`
- 解析 HTML 中的文章列表。CSDN 首页文章条目通常包含在 `.blog-list-box .blog-item-box` 或类似结构中，每个条目包含：
  - 文章链接：`/article/details/xxxxxxxxx`
  - 标题：`.title` 或 `h2 a` 的 textContent
  - 摘要：`.content .desc`
  - 发布时间：`.date`
  - 阅读量：`.read-num`
- 提取前 20 篇文章，写入 `src/data/csdn-data.ts`
- 若请求失败（WAF/网络），生成一个只包含 3 篇已知文章（ID 162851113、162840157、162044312）的 fallback 数据，确保构建不中断
- 已知文章标题和摘要可先用占位符，首次构建后会被真实数据覆盖

#### 1.2 新建 `src/data/csdn-data.ts`（生成文件，加入 `.gitignore`）

```typescript
export interface CSDNArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  readCount: number;
}
export const csdnArticles: CSDNArticle[] = [/* generated */];
export const csdnStats = { totalArticles: number, columns: number };
```

#### 1.3 重写 `src/data/blog.ts`

- 删除所有 GitHub Events 相关导入和转换逻辑
- 从 `./csdn-data` 导入 `csdnArticles`
- `export interface BlogPost` 保留（字段与 CSDNArticle 对齐）
- `export function getBlogPosts(): BlogPost[]` 直接映射 `csdnArticles`
- `getActivityFeed()` 重命名为 `getBlogPosts()`，所有引用处同步更新

#### 1.4 重写 `src/pages/BlogPage.tsx`

- 标题改为「博客文章」
- 副标题改为「CSDN 技术博客精选」
- 渲染 `getBlogPosts()` 的结果
- 每篇文章卡片展示：标题（链接到 CSDN）、摘要、发布日期、阅读量
- 增加「访问 CSDN 主页」外部链接按钮 `https://security-hyacinth.blog.csdn.net/`

#### 1.5 重写 `src/components/sections/BlogSection.tsx`

- 标题改为「博客文章」
- 副标题改为「来自 CSDN 的技术写作」
- 从 `getBlogPosts()` 取前 3 篇展示
- 卡片增加阅读量显示
- 「查看全部动态」改为「查看全部文章」

#### 1.6 更新构建流水线

- `package.json`：`prebuild` 改为 `"node scripts/fetch-csdn-data.mjs && node scripts/fetch-github-data.mjs"`
- `.github/workflows/deploy.yml`：在 Build 步骤之前增加 `Fetch CSDN Data` 步骤运行 `node scripts/fetch-csdn-data.mjs`
- `.gitignore`：增加 `src/data/csdn-data.ts`

---

### Module 2: 学术研究方向真实化

**目标**：消除虚构论文，基于 Resume 仓库中的真实信息展示研究方向、技术专栏、竞赛与认证成就。

来自 Resume 的真实信息：
- 核心领域：LLM Applications、Cybersecurity、Full-Stack、Healthcare AI、DevOps
- 竞赛：中美青年创客大赛大奖、Intel AI 竞赛
- 认证：阿里云专家博主、华为云专家博主、腾讯云创作者之星、网络安全应急响应（中级）
- CSDN：1,467 篇文章、12+ 专栏

#### 2.1 重写 `src/data/research.ts`

```typescript
export const researchDirections = [
  {
    title: "LLM 应用与安全",
    description: "探索大语言模型在代码分析、漏洞检测与自动修复中的应用，关注模型推理安全与提示注入防御。",
  },
  {
    title: "系统底层与开源基础设施",
    description: "操作系统内核、程序分析与可复用安全工具链的构建。",
  },
  {
    title: "Healthcare AI & DevOps",
    description: "医疗场景下的 AI 应用与自动化运维实践。",
  },
];

export const researchAchievements = [
  { title: "中美青年创客大赛", level: "大奖", year: "" },
  { title: "Intel AI 竞赛", level: "获奖", year: "" },
];

export const certifications = [
  "阿里云专家博主",
  "华为云专家博主",
  "腾讯云创作者之星",
  "网络安全应急响应（中级）",
];

export const columns = [
  { name: "AI 安全", articleCount: 0 },
  { name: "系统底层", articleCount: 0 },
  // CSDN 专栏数据若无法自动获取，先以静态列表呈现
];
```

#### 2.2 重写 `src/pages/ResearchPage.tsx`

页面结构改为 4 个区块（按视觉流自上而下）：

1. **研究方向**（保留现有 3 卡片，文字按 2.1 更新）
2. **技术专栏** — 网格展示 CSDN 专栏列表（从 `columns` 读取），每张卡片显示专栏名称与文章数，链接到 CSDN 专栏页
3. **竞赛与认证** — 左右两栏：左侧「竞赛奖项」列表（图标 + 名称 + 等级），右侧「专业认证」标签云
4. **论文发表** — 不再隐藏。显示一张居中的提示卡片：「目前尚未发表学术论文，正在围绕上述方向积累研究。」消除用户的「造假」顾虑，同时让页面有收尾

#### 2.3 重写 `src/components/sections/ResearchSection.tsx`

- 保留 3 个方向卡片
- 增加一行 2-3 个「最新成就」小卡片（竞赛/认证预览），点击跳转到 `/research`
- 论文区块：展示「暂无发表论文」的诚实提示，而不是条件隐藏

---

### Module 3: About 页面真实数据注入

**目标**：用 Resume 中的真实联系方式、统计数据、成就填充 About 页面。

#### 3.1 重写 `src/data/about.ts`

```typescript
export const aboutInfo = {
  name: "钱佳宏",
  handle: "lxcxjxhx",
  bio: "上海 | 信息安全与 AI 交叉方向研究者。CSDN 专家博主，累计发布 1,467 篇技术文章。开源活跃者，GitHub 年度 1,038 commits，维护 25 个仓库，PyPI 发布 7 个包。",
  location: "上海，中国",
  email: "aqfxz_zh@qq.com",
  phone: "+86 19921057118",
  github: "https://github.com/lxcxjxhx",
  csdn: "https://security-hyacinth.blog.csdn.net/",
  pypi: "https://pypi.org/user/lxcxjxhx/",
  avatarUrl: githubProfile.avatarUrl,
  publicRepos: 25,
  followers: 37,
  following: githubProfile.following,
  joinedAt: "...",
  skills: [
    { category: "核心领域", items: ["LLM Applications", "Cybersecurity", "Healthcare AI", "DevOps"] },
    { category: "编程语言", items: ["Python", "TypeScript", "C/C++", "Rust"] },
    { category: "工具链", items: ["llama.cpp", "vLLM", "SGLang", "Unsloth", "Docker", "Kubernetes"] },
  ],
  experiences: [
    {
      period: "持续",
      role: "开源贡献者",
      institution: "GitHub / PyPI",
      description: "维护 25 个开源仓库，PyPI 发布 7 个包，合并 20+ PR 到 6 个以上外部项目。",
    },
    {
      period: "持续",
      role: "技术博主",
      institution: "CSDN",
      description: "累计发布 1,467 篇技术文章，12+ 专栏，阿里云/华为云/腾讯云认证专家博主。",
    },
  ],
  education: [], // Resume 未提供教育信息，保持为空数组，页面条件隐藏
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
```

- `githubProfile` 相关字段保留动态获取（name, avatarUrl, followers, following, createdAt）
- 其余字段改为静态真实数据

#### 3.2 重写 `src/pages/AboutPage.tsx`

页面结构改为 5 个区块：

1. **个人简介卡** — 头像（左侧）+ Bio + 联系方式（邮箱、电话、地点）+ 社交按钮（GitHub、CSDN、PyPI、发邮件）
2. **数据仪表盘** — 4 个统计卡片横排：GitHub Commits、CSDN 文章数、PyPI 包数、Merged PRs。使用 `AnimatedNumber`
3. **技能矩阵** — 保留现有网格，使用 3.1 中的 `skills`
4. **成就与认证** — 标签云或卡片列表展示 `achievements`
5. **经历** — 展示 `experiences`（现在有数据了，会显示）
6. **教育** — 条件渲染（当前仍为空，自动隐藏）

---

### Module 4: Projects 页面丰富化

**目标**：增加语言分布统计、外部平台链接，让页面更具信息密度。

#### 4.1 更新 `src/pages/ProjectsPage.tsx`

- 统计区从 2 个卡片扩展到 4 个：项目总数、Stars 总数、Languages 种类数、PyPI 包数
- 增加「语言分布」横向条形图（纯 CSS/Tailwind 实现）：基于 `githubRepos` 的 `language` 字段统计，取前 5 种语言，展示占比条
- 项目卡片下方增加外部平台快捷链接行：PyPI、HuggingFace（若有）、CSDN 专栏
- 页面顶部增加一句描述：「覆盖安全工具、AI 基础设施与系统底层工程」

#### 4.2 更新 `src/components/sections/ProjectsSection.tsx`

- 同步展示语言分布迷你条形图（取前 3 种）
- 增加「PyPI 包」统计卡片

---

### Module 5: Favicon / ICO 重新设计

**目标**：设计一个符合「霓虹釉面风信子」主题的网站图标。

#### 5.1 创建 `public/favicon.svg`

- SVG 图标，使用风信子配色：以 `--hyacinth-lavender` (#B49BC4) 和 `--hyacinth-crimson` (#862C3B) 为主
- 设计元素：字母「H」的抽象几何形态，或风信子花朵的简化轮廓
- 尺寸：32x32 视口，确保在浏览器标签页和书签中清晰可辨
- 背景透明

#### 5.2 创建 `public/apple-touch-icon.png`

- 基于 favicon.svg 导出 180x180 PNG（可通过在线工具或脚本转换，若环境无 ImageMagick 则先生成 SVG，在计划中注明需用户手动转换或 CI 中处理）
- 备选：仅提供 SVG，在 `index.html` 中同时引用 SVG 和 PNG 占位

#### 5.3 更新 `index.html`

在 `<head>` 中增加：
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

---

### Module 6: 全局布局与页面结构完善

#### 6.1 `src/components/sections/HeroSection.tsx`

- Badge「正在招募合作者」改为动态数据徽章：
  - 方案 A（推荐）：「1,467 篇技术文章 · 1,038 Commits · 7 PyPI 包」滚动展示
  - 方案 B：静态文本「CSDN 专家博主 · 开源活跃者」
- 主标题「AI · 安全 · 系统底层」保留
- 副标题更新为：「上海 | 聚焦大模型安全攻防、系统底层与开源基础设施。CSDN 累计 1,467 篇技术文章。」
- CTA 按钮：「探索项目」+「阅读博客」（链接到 `/blog`）

#### 6.2 `src/components/layout/Footer.tsx`

- 左侧：保留 H logo + copyright
- 右侧链接扩展为：GitHub、CSDN、PyPI、邮件
- 邮件地址更新为 `aqfxz_zh@qq.com`
- 增加一句话：「HOS — 以代码理解世界。」保留

#### 6.3 `src/index.css`

- 检查是否已有 `line-clamp-2`、`line-clamp-3` 工具类。若 Tailwind CSS v4 未默认包含，手动添加：
```css
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
```

#### 6.4 各页面统一结构检查

- 所有页面使用 `Container` 组件，确保 `mx-auto px-4` 居中
- 页面顶部统一 `pt-24 pb-12 min-h-screen`
- Section 间距统一 `py-20`（首页 section）或 `mb-8`/`mb-12`（内容区块）

---

### Module 7: 类型定义与依赖清理

#### 7.1 新建 `src/data/types.ts`

将跨数据文件共享的接口集中：
```typescript
export interface BlogPost { ... }
export interface Project { ... }
export interface CSDNArticle { ... }
```

避免 `blog.ts` 和 `projects.ts` 各自定义接口导致的循环引用或重复。

#### 7.2 清理 `src/data/blog.ts` 中的 GitHub 依赖

- 删除 `import { githubEvents, githubRepos }`
- 删除 `formatEventTitle()` 和 `getActivityFeed()`

#### 7.3 清理未使用的导入

- 检查所有修改过的 `.tsx` 文件，删除因重构产生的未使用 import

---

## Assumptions & Decisions

| # | 决策 | 理由 |
|---|------|------|
| 1 | CSDN 数据通过 HTML 抓取而非 API/RSS | CSDN RSS 和 API 均被 WAF 拦截，返回 403/验证码。HTML 首页解析是唯一可行路径。 |
| 2 | 不实现「扫描后五位数字」的 ID 探测 | 文章 ID 前缀会随时间变化（156xxx → 162xxx），且 ID 不连续（851113 与 840157 差超 10,000）。扫描百万级 ID 不现实。 |
| 3 | CSDN 数据在构建时获取而非运行时 | GitHub Pages 为纯静态托管，无服务器端运行环境，且 CSDN 有 CORS 限制。 |
| 4 | 论文区块显示「暂无发表」而非隐藏 | 用户明确要求不能造假。诚实展示未发表论文比隐藏更符合学术诚信。 |
| 5 | 教育经历保持为空 | Resume 仓库未提供教育信息，不编造。条件渲染自动隐藏该区块。 |
| 6 | Favicon 使用 SVG + PNG 双格式 | SVG 适配现代浏览器，PNG 适配 Safari/iOS 的 apple-touch-icon。 |
| 7 | 邮箱/电话使用 Resume 中的真实信息 | Resume 仓库为公开信息源，且用户明确指定其为数据来源。 |
| 8 | 技能列表从 GitHub 语言统计 + Resume 领域合并 | GitHub 语言统计客观反映技术栈，Resume 的核心领域补充业务方向。 |

---

## Verification Steps

1. **本地构建**：运行 `npm run prebuild && npm run build`，确认 `src/data/csdn-data.ts` 被生成且无 TypeScript 错误。
2. **CSDN 数据检查**：打开生成的 `csdn-data.ts`，确认包含真实文章标题、URL、摘要。
3. **博客页面**：`npm run dev` 访问 `/blog`，确认展示的是 CSDN 文章而非 GitHub events，每篇文章点击可跳转到 CSDN。
4. **研究页面**：访问 `/research`，确认无虚构论文，有「暂无发表」提示，有竞赛/认证展示。
5. **关于页面**：访问 `/about`，确认显示真实邮箱、电话、地点、4 个统计数字、成就列表。
6. **项目页面**：访问 `/projects`，确认有语言分布条、PyPI 统计。
7. **首页**：访问 `/`，确认 Hero badge 展示真实数据，博客预览为 CSDN 文章。
8. **Favicon**：浏览器标签页显示新图标。
9. **GitHub Actions**：推送后检查 Actions 日志，确认 CSDN fetch 和 GitHub fetch 均成功执行，Pages 部署正常。
10. **移动端**：Chrome DevTools 切换手机视口，确认所有页面无横向滚动、卡片不重叠、导航正常。
