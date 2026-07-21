# HOS-BLOG 视觉提升收尾计划

## 当前状态

Steps 1-5（数据修正、HeroSection 重构、插图生成）已完成。剩余：2 处遗漏修复 + 插图集成 + BlogPage 增强 + 构建部署。

---

## 修改清单

### 1. 修复 about.ts 核心领域残留项
**文件**: `src/data/about.ts` 第42行

`items: ["LLM Applications", "Cybersecurity", "Healthcare AI", "DevOps"]`
→ `items: ["LLM 应用与安全", "系统底层与程序分析", "开源基础设施"]`

原因：research.ts 已移除 Healthcare AI & DevOps 方向，核心领域应与之一致。

### 2. 修复 ProjectsPage.tsx PyPI 链接
**文件**: `src/pages/ProjectsPage.tsx` 第108行

`https://pypi.org/user/lxcxjxhx/` → `https://pypi.org/user/security_hyacinth/`

原因：about.ts 和 Footer.tsx 已修正，此处遗漏。

### 3. ResearchPage 集成装饰插图
**文件**: `src/pages/ResearchPage.tsx` SectionTitle 之后、研究方向卡片之前

插入 research-header.jpg 装饰图（圆角边框、opacity-80、仅子页面）。

### 4. ProjectsPage 集成装饰插图
**文件**: `src/pages/ProjectsPage.tsx` SectionTitle 之后

插入 projects-header.jpg 装饰图，同上模式。

### 5. BlogPage 文章卡片视觉增强
**文件**: `src/pages/BlogPage.tsx`

- 卡片加左侧竖向色条：`border-l-[3px] border-l-[var(--hyacinth-light)]`
- 内边距紧凑化：`p-6` → `p-5`
- 列表间距紧凑化：`space-y-6` → `space-y-4`
- 不添加统计横条（SectionTitle subtitle 已覆盖文章数+专栏数）

### 6. 构建验证 + 部署
- `npm run build` 确认零 error
- `git add -A && git commit && git push`

---

## 不做的事项
- 首页不加插图（用户明确反对）
- 不新增统计横条（与 subtitle 重复）
- 不引入新依赖
- 不修改已完成的组件（HeroSection、Footer、ResearchSection 首页）
