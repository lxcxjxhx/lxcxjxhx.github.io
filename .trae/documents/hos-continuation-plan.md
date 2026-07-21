# HOS 作品集网站 — 剩余任务执行计划

## 当前状态

模块1-4核心数据与页面已完成：
- CSDN RSS 自动拉取 (`fetch-csdn-data.mjs` + `csdn-data.ts`，含20篇文章)
- 学术方向真实化 (`research.ts` → 3个研究方向 + 竞赛获奖 + 认证)
- About 真实数据注入 (`about.ts` → 简历仓库真实信息)
- Projects/Blog/Research/About 页面全部重写完成

## 剩余任务

### 1. HeroSection 徽章更新
- **文件**: `src/components/sections/HeroSection.tsx`
- **改动**: 将"正在招募合作者"替换为动态统计徽章，例如"CSDN 1,467 篇文章 · 25 个开源项目"

### 2. Footer 扩展
- **文件**: `src/components/layout/Footer.tsx`
- **改动**: 
  - 修正邮箱为 `aqfxz_zh@qq.com`
  - 添加 CSDN、PyPI 外部链接
  - 保持现有设计风格

### 3. Favicon / ICO 设计
- **新建**: `public/favicon.svg`（风信子主题 SVG 图标）
- **新建**: `public/apple-touch-icon.png`
- **修改**: `index.html` 引入 favicon 链接

### 4. 构建流水线更新
- **文件**: `package.json`
- **改动**: `prebuild` 同时执行 `fetch-github-data.mjs` 和 `fetch-csdn-data.mjs`
- **文件**: `.github/workflows/deploy.yml`
- **改动**: 添加 CSDN 数据拉取步骤

### 5. 样式与类型清理
- **文件**: `src/index.css`
- **改动**: 添加 `line-clamp` 工具类（如博客卡片摘要需要）
- **检查**: 清理未使用的导入、统一类型定义

### 6. 构建验证与部署
- 运行 `npm run prebuild && npm run build`
- 修复 TypeScript 错误
- 推送至 `https://github.com/lxcxjxhx/lxcxjxhx.github.io`
