# HOS 作品集网站 — 视觉提升与内容精修计划

## 问题诊断

用户审视后的反馈归为 5 类问题：

### A. ResearchSection 放了不该放的东西
- "Healthcare AI & DevOps" 方向描述空洞，与网站主题（安全研究员）不够契合
- 竞赛奖项、专业认证放在首页 ResearchSection 占了重要位置但意义不大
- ResearchPage 也有同样问题：竞赛/认证区域占了完整两栏

### B. CSDN 文章数量硬编码
- 当前 `csdnStats.totalArticles = 1467` 是硬编码的
- 用户实际有 1,471 篇，且持续增长
- 需要构建时自动获取真实数量

### C. PyPI 链接用户名错误
- 当前所有引用使用 `pypi.org/user/lxcxjxhx/`
- 用户实际 PyPI 用户名是 `security_hyacinth`

### D. Projects 展示了不该展示的仓库
- `HOS-Qian-jia-hong-resume` 和 `academic-resume` 名字含 resume
- 这类项目不应出现在作品集的项目列表中

### E. 首页 HeroSection 缺乏视觉冲击力
- 当前 Hero 只有纯文字 + 粒子背景，没有插图/装饰图形
- 徽章文案"CSDN 1,467 篇文章 · 20+ 合并 PR"感觉不像个人信息页的合适内容
- "阅读论文"按钮（实际没有论文）指向 ResearchPage 不合理

---

## 修改方案

### 1. 精简 ResearchSection（首页）和 ResearchPage
**文件**: `src/components/sections/ResearchSection.tsx`, `src/pages/ResearchPage.tsx`

- 从首页 ResearchSection 中**移除**竞赛奖项、专业认证的展示
- 仅保留：研究方向卡片 + 技术专栏链接
- ResearchPage 中竞赛/认证移到页面底部作为补充信息，不与研究方向并列
- 从 `research.ts` 中移除 "Healthcare AI & DevOps" 方向（描述空洞且偏离主线）
- 保留两个核心方向 + "开源基础设施"方向，给出更具体的描述

### 2. CSDN 文章数自动获取
**文件**: `scripts/fetch-csdn-data.mjs`

- 在 RSS 解析之外，额外请求 `https://blog.csdn.net/lxcxjxhx/` 页面
- 用正则提取页面中的文章数（如 "原创 1,471" 文案中的数字）
- 如果页面被 WAF 拦截，回退到从 RSS feed 的 `<channel>` 元数据中获取
- 最终回退到 `csdnStats` 中的手动更新值
- 同时更新 `about.ts` 中的 `stats.csdnArticles`，使其引用 `csdnStats`

### 3. 修正 PyPI 用户名
**文件**: `src/data/about.ts`

- 将所有 `pypi.org/user/lxcxjxhx/` 替换为 `pypi.org/user/security_hyacinth/`
- 同步修改 Footer.tsx 中的 PyPI 链接

### 4. 过滤 resume 类仓库
**文件**: `src/data/projects.ts`

- 在 `getProjects()` 中添加过滤条件：排除名称包含 `resume`（不区分大小写）的仓库
- 同时排除 `BOS-NI` 和 `BOS-FS` 这类描述为占位符（如 "FUCKING SUBMIT"、"BOS-NI"）的仓库

### 5. 首页 HeroSection 重构 + 插图
**文件**: `src/components/sections/HeroSection.tsx`, `public/` 下新增插图

#### 5a. 重写 Hero 文案与布局
- 移除"CSDN xxx 文章"徽章，替换为更有个人特色的 tagline
- 将 "阅读论文" 按钮改为 "技术博客" 指向 BlogPage
- 添加一个终端风格代码片段展示区（terminal-window CSS 类已存在但未使用）

#### 5b. 生成装饰插图
- 用 GenerateImage 生成 3 张插图：
  1. **Hero 装饰图**: 风信子花穗抽象化 + 数字矩阵风格的科技插画（放在 Hero 右侧或背景）
  2. **Research 章节头图**: AI 安全主题抽象图（神经网络 + 盾牌元素）
  3. **Projects 章节头图**: 开源工具链主题抽象图（齿轮 + 代码元素）
- 存放到 `public/illustrations/` 目录
- 在 HeroSection 和各 Section 中以 `<img>` 标签引用，带 lazy loading

#### 5c. Hero 布局改为双栏
- 左栏：文字内容（tagline + 描述 + 按钮）
- 右栏：装饰插图（仅在 md 以上视口显示）
- 移动端：插图隐藏，文字居中

### 6. BlogPage 视觉增强
**文件**: `src/pages/BlogPage.tsx`

- 在文章列表上方添加统计横条（文章数 + 专栏数）
- 文章卡片左侧添加竖向色条装饰（风信子渐变色）
- 紧凑布局改进

---

## 涉及文件清单

| 操作 | 文件路径 |
|------|---------|
| 修改 | `src/components/sections/HeroSection.tsx` |
| 修改 | `src/components/sections/ResearchSection.tsx` |
| 修改 | `src/pages/ResearchPage.tsx` |
| 修改 | `src/pages/BlogPage.tsx` |
| 修改 | `src/data/research.ts` |
| 修改 | `src/data/about.ts` |
| 修改 | `src/data/projects.ts` |
| 修改 | `src/components/layout/Footer.tsx` |
| 修改 | `scripts/fetch-csdn-data.mjs` |
| 新建 | `public/illustrations/hero-decoration.jpg` |
| 新建 | `public/illustrations/research-header.jpg` |
| 新建 | `public/illustrations/projects-header.jpg` |

## 验证步骤

1. 运行 `npm run prebuild` 确认 CSDN 数据拉取成功
2. 运行 `npm run build` 确认零 TypeScript 错误
3. 检查 `dist/` 输出中包含 `illustrations/` 目录下的图片
4. 本地预览确认：
   - HeroSection 双栏布局 + 装饰图正常显示
   - ResearchSection 不再显示竞赛/认证
   - Projects 列表不含 resume 仓库
   - Footer PyPI 链接指向 `security_hyacinth`
   - Blog 统计数据来自构建时拉取
