# lxcxjxhx.github.io — 安全风信子 · SECURITY HYACINTH

信息安全 × AI 双域实践者（钱佳宏）的个人数字花圃。单页 SPA，主题为「夜花园 × 荧光数据流」：Canvas 手绘风信子绽放动画 + 轻量 Markdown 渲染器 + 仓库即数据库架构。

## 架构

```
scripts/fetch-resume-data.mjs  ──构建期──▶  src/data/readme.ts   （README.md 原文内嵌）
     （重试 ×4 直连 raw）                     src/data/pr_readme.ts（PR/README.md 原文内嵌）
                                                        │
Vite + React 18 + TS（无 router / 无 Tailwind）          ▼
src/App.tsx           页面组装（8 个章节：根系/花圃/温室/授粉/土壤/果实/数据源）
src/components/Markdown.tsx   轻量 Markdown 渲染器（HTML 表格→管道表、徽章→chip）
src/components/FlowerCanvas.tsx  Hero 风信子 Canvas 动画
src/data/static.ts    手工精选品牌数据（项目卡/成就/联系方式）
src/styles.css        全套设计系统
```

## 数据源：HOS-Qian-jia-hong-resume 仓库即数据库

- 温室专栏、探索领域、完整 README 预览：**构建时**从 `lxcxjxhx/HOS-Qian-jia-hong-resume` 拉取 `README.md` 并内嵌；
- 授粉 PR 记录：拉取 `PR/README.md`；
- 「数据源」章节在**运行时**直连 raw.githubusercontent 校验新鲜度，失败自动回退构建快照；
- 修改数据源仓库后，重新构建本站即可同步内容：`npm run fetch-data && npm run build`。

## 本地开发

```bash
npm install
npm run dev        # 开发
npm run build      # 生产构建（tsc + vite）
npm run fetch-data # 手动刷新数据源内嵌
```

## 部署

`.github/workflows/deploy.yml` 推送 main 后自动构建并发布 GitHub Pages（构建前执行 `fetch-resume-data.mjs` 拉取数据源）。

## License

GNU Affero General Public License v3.0 (AGPLv3)。向本项目（或其修改版）作为 SaaS / 云服务对外提供时，必须向所有用户公开完整的服务端源代码。商业使用请联系项目维护者。向本项目贡献代码即表示你同意 [DCO](https://developercertificate.org/)，请参阅 CONTRIBUTING.md。
