import { useEffect, useMemo, useState, type ReactNode } from "react";
import { markdown as resumeMd, source as resumeSource } from "./data/readme";
import { markdown as prMd } from "./data/pr_readme";
import { ACHIEVEMENTS, BRAND, LINKS, PROJECTS, STATS } from "./data/static";
import { Markdown } from "./components/Markdown";
import { FlowerCanvas } from "./components/FlowerCanvas";

const NAV = [
  { id: "top", label: "入口" },
  { id: "about", label: "关于" },
  { id: "projects", label: "项目" },
  { id: "columns", label: "专栏" },
  { id: "pr", label: "开源" },
  { id: "areas", label: "领域" },
  { id: "achievements", label: "成就" },
  { id: "source", label: "数据源" },
];

// 滚动显现
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add("revealed");
            io.unobserve(en.target);
          }
        }
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// 运行时直连仓库，检验"仓库即数据库"
function useLiveSource() {
  const [live, setLive] = useState<{ ok: boolean; text: string; at: string }>({ ok: false, text: "", at: "" });
  useEffect(() => {
    let alive = true;
    fetch("https://raw.githubusercontent.com/lxcxjxhx/HOS-Qian-jia-hong-resume/main/README.md")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then((t) => {
        if (alive) setLive({ ok: true, text: t, at: new Date().toISOString() });
      })
      .catch(() => {
        if (alive) setLive({ ok: false, text: "", at: "" });
      });
    return () => {
      alive = false;
    };
  }, []);
  return live;
}

interface ExtSource {
  updatedAt: string;
  [k: string]: unknown;
}
interface ExtData {
  updatedAt: string;
  sources: Record<string, ExtSource>;
}
interface LatestPost {
  title: string;
  url: string;
  publishedAt: string;
}

// 运行时读取外部数据快照（public/data/external.json，由 GitHub Actions 定时采集）
function useExternal() {
  const [ext, setExt] = useState<ExtData | null>(null);
  useEffect(() => {
    let alive = true;
    fetch(`./data/external.json?ts=${Date.now()}`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<ExtData>;
      })
      .then((d) => {
        if (alive) setExt(d);
      })
      .catch(() => {
        /* 保持 null，站点使用静态兜底数据 */
      });
    return () => {
      alive = false;
    };
  }, []);
  return ext;
}

const fmtNum = (v: unknown): string => (typeof v === "number" ? v.toLocaleString("en-US") : typeof v === "string" && v ? v : "—");

const fmtTime = (t: unknown): string => (typeof t === "string" ? t.replace("T", " ").slice(0, 16) + " UTC" : "—");

function describeSource(key: string, s: ExtSource): string {
  switch (key) {
    case "github":
      return `${fmtNum(s.followers)} 粉丝 · ${fmtNum(s.publicRepos)} 仓库 · ${fmtNum(s.totalStars)} ⭐ · ${fmtNum(s.totalForks)} 复刻`;
    case "hf":
      return `${fmtNum(s.models)} 个模型`;
    case "pypi":
      return `${fmtNum(s.packages)} 个开源包${Array.isArray(s.names) && s.names.length ? " · " + (s.names as string[]).join(" / ") : ""}`;
    case "csdn":
      return `最新博文 ${Array.isArray(s.latest) ? (s.latest as LatestPost[]).length : 0} 篇已同步`;
    default:
      return "已同步";
  }
}

// GitHub 观测面板（多维度数值）
function GithubPanel({ s }: { s: ExtSource }) {
  const langs = Array.isArray(s.topLanguages) ? (s.topLanguages as string[]) : [];
  const top = s.topRepo as { name?: string; stars?: number } | undefined;
  const items: { k: string; v: unknown }[] = [
    { k: "Followers", v: s.followers },
    { k: "Following", v: s.following },
    { k: "Repos", v: s.publicRepos },
    { k: "Gists", v: s.publicGists },
    { k: "总 Star", v: s.totalStars },
    { k: "总 Fork", v: s.totalForks },
    { k: "账号", v: typeof s.accountYears === "number" ? `${s.accountYears} 年` : undefined },
  ];
  return (
    <div className="gh-panel">
      <div className="gh-stats">
        {items.map((it) => (
          <div className="gh-stat" key={it.k}>
            <b className="mono">{fmtNum(it.v)}</b>
            <span>{it.k}</span>
          </div>
        ))}
      </div>
      {langs.length > 0 && (
        <div className="gh-langs">
          <span className="gh-langs-label mono">top languages</span>
          {langs.map((l) => (
            <span className="gh-lang mono" key={l}>
              {l}
            </span>
          ))}
        </div>
      )}
      {top && (
        <p className="gh-top mono">
          ★ 最高星仓库：
          <a href={`https://github.com/lxcxjxhx/${top.name}`} target="_blank" rel="noreferrer">
            {top.name}
          </a>
          {typeof top.stars === "number" ? ` · ${top.stars} ⭐` : ""}
        </p>
      )}
    </div>
  );
}

// 数字滚动（缓动计数）
function useCountUp(target: number, duration = 1400): string {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val.toLocaleString("en-US");
}

// SOC 仪表：竖向信号柱 + 数字滚动
function Meter({ label, value, unit, max }: { label: string; value: string; unit: string; max: number }) {
  const target = Number(value.replace(/,/g, "")) || 0;
  const pct = Math.max(8, Math.min(100, Math.round((target / max) * 100)));
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="meter">
      <div className="meter-value mono">
        {useCountUp(target)}
        <i>{unit}</i>
      </div>
      <div className="meter-bar">
        <i style={{ height: on ? `${pct}%` : "0%" }} />
      </div>
      <span className="meter-label">{label}</span>
    </div>
  );
}

// 从原始 README 中截取某个 ## 章节（跳过标题行，直到下一个 ## ）
function sliceSection(md: string, title: string): string {
  const lines = md.split("\n");
  const start = lines.findIndex((l) => l.includes(title));
  if (start < 0) return "";
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ") && !lines[i].includes(title)) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end).join("\n");
}

interface PrRow {
  repo: string;
  pr: string;
  title: string;
  date: string;
}

// 从 PR/README.md 的管道表中抽取前 N 条合并记录
function extractPrRows(md: string, max: number): PrRow[] {
  const rows: PrRow[] = [];
  for (const line of md.split("\n")) {
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length < 4) continue;
    const repoM = cells[0].match(/\[([^\]]+)\]\(([^)]+)\)/);
    const prM = cells[1].match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (!repoM || !prM) continue;
    rows.push({ repo: repoM[1], pr: prM[1], title: cells[2], date: cells[3] });
    if (rows.length >= max) break;
  }
  return rows;
}

function Section({ id, no, title, sub, children }: { id: string; no: string; title: string; sub: string; children: ReactNode }) {
  return (
    <section id={id} className="sec" data-reveal>
      <header className="sec-head">
        <div className="sec-head-left">
          <span className="sec-no mono">{no}</span>
          <div className="sec-title">
            <span className="sec-prompt mono">$ ls garden/{id}</span>
            <h2>{title}</h2>
          </div>
        </div>
        <span className="sec-sub mono">{sub}</span>
      </header>
      <div className="sec-body">{children}</div>
    </section>
  );
}

export default function App() {
  useReveal();
  const live = useLiveSource();
  const columnsMd = sliceSection(resumeMd, "Featured Columns");
  const areasMd = sliceSection(resumeMd, "Core Exploration Areas");
  const prRows = extractPrRows(prMd, 12);
  const prTotal = prMd.match(/\*\*Total Merged PRs\*\*:\s*(\d+)/)?.[1] ?? "—";
  const prProjects = prMd.match(/\*\*Projects\*\*:\s*(\d+)/)?.[1] ?? "—";
  const ext = useExternal();
  const latestPosts = (ext?.sources?.csdn?.latest as unknown as LatestPost[] | undefined) ?? [];
  const extEntries = ext ? Object.entries(ext.sources) : [];
  const tickerItems = useMemo(() => {
    const items: { label: string; href?: string }[] = [];
    for (const p of latestPosts.slice(0, 6)) items.push({ label: p.title, href: p.url });
    for (const s of STATS) items.push({ label: `${s.label} · ${s.value}${s.unit}` });
    return items;
  }, [latestPosts]);

  return (
    <div className="site">
      <nav className="nav">
        <a className="nav-brand" href="#top">
          ⟢ 安全风信子 <em>SECURITY HYACINTH</em>
        </a>
        <div className="nav-links">
          {NAV.filter((n) => n.id !== "top").map((n) => (
            <a key={n.id} href={`#${n.id}`}>
              {n.label}
            </a>
          ))}
        </div>
      </nav>

      <main>
        <section id="top" className="hero">
          <FlowerCanvas />
          <div className="hero-overlay" aria-hidden="true" />
          <div className="stamp stamp-tl mono">TOP SECRET // 观测站 01</div>
          <div className="stamp stamp-br mono">HYACINTH.SIG · v2.0 · SEC×AI</div>
          <div className="hero-inner">
            <div className="hero-left">
              <p className="hero-kicker">⟡ 数字花圃 · 观测站 01 / 风信子的花语：重生的爱</p>
              <div className="hero-title-wrap">
                <span className="title-watermark" aria-hidden="true">
                  风信子
                </span>
                <h1 className="hero-title">安全风信子</h1>
              </div>
              <p className="hero-en">SECURITY HYACINTH — SIGNAL ANALYZER</p>
              <p className="hero-role">{BRAND.role}</p>
              <p className="hero-tagline">{BRAND.tagline}</p>
              <div className="hero-cta">
                <a className="btn btn-primary" href={LINKS[0].href} target="_blank" rel="noreferrer">
                  阅读博客 ↗
                </a>
                <a className="btn btn-ghost" href={LINKS[1].href} target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a className="btn btn-ghost" href={`mailto:${BRAND.email}`}>
                  联系
                </a>
              </div>
            </div>
            <div className="hero-instruments">
              <div className="radar" aria-hidden="true">
                <div className="radar-ring r1" />
                <div className="radar-ring r2" />
                <div className="radar-sweep" />
                <div className="radar-core">
                  <b className="mono">{extEntries.length || "…"}</b>
                  <span>LIVE SOURCES</span>
                </div>
              </div>
              <div className="meters">
                {STATS.map((s) => (
                  <Meter key={s.label} label={s.label} value={s.value} unit={s.unit} max={s.max} />
                ))}
              </div>
              <p className="hero-hint mono">⇆ 光标倾斜花茎 · 点击激起花粉</p>
            </div>
          </div>
          <div className="hero-console">
            <div className="console-lines mono">
              <p>⟢ hyacinth_garden v2.0 — boot sequence</p>
              <p>
                &gt; seed_db: HOS-Qian-jia-hong-resume/main
                <span className={live.ok ? "t-ok" : "t-off"}> ● {live.ok ? "connected" : "snapshot"}</span>
              </p>
              <p>
                &gt; sources: {extEntries.map((e) => e[0]).join(" / ") || "static"}
                <span className={ext ? "t-ok" : "t-off"}> {ext ? `${extEntries.length} live` : "fallback"}</span>
              </p>
              <p>
                &gt; data: {ext ? ext.updatedAt.slice(0, 10) : resumeSource.fetchedAt.slice(0, 10)} · deploy: GitHub
                Actions
              </p>
            </div>
            <div className="ticker">
              <div className="ticker-track">
                {[...tickerItems, ...tickerItems].map((it, i) =>
                  it.href ? (
                    <a key={i} className="ticker-item" href={it.href} target="_blank" rel="noreferrer">
                      <span className="ticker-sep">⟡</span> {it.label}
                    </a>
                  ) : (
                    <span key={i} className="ticker-item">
                      <span className="ticker-sep">⟡</span> {it.label}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
          <a className="hero-scroll" href="#about">
            ↓ 向下培育
          </a>
        </section>

        <Section id="about" no="02" title="根系 · Root System" sub="关于我 / 联络通道">
          <div className="about-grid">
            <div className="about-dossier">
              <div className="dossier-head mono">PROFILE.TXT — 身份档案</div>
              <dl className="dossier-fields mono">
                <div>
                  <dt>NAME</dt>
                  <dd>{BRAND.name} · {BRAND.handle}</dd>
                </div>
                <div>
                  <dt>ROLE</dt>
                  <dd>{BRAND.role}</dd>
                </div>
                <div>
                  <dt>BASE</dt>
                  <dd>{BRAND.location}</dd>
                </div>
                <div>
                  <dt>MAIL</dt>
                  <dd>
                    <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="about-bio">
              <p className="about-intro">
                信息安全 × AI 双域实践者，以代码为武器深耕大模型攻防与系统安全。
                CSDN <b>1,467</b> 篇原创文章、<b>161</b> 个已合并 Pull Request、<b>7</b> 个 PyPI 开源包、年度{" "}
                <b>1686</b> 次 GitHub 贡献 —— 持续用工程实践探索 AI 时代的安全边界。
              </p>
              <blockquote>
                「欢迎来到智能安全前线！这里是 AI 与信息安全交汇之地。以代码为武器，深入大模型攻防实战，破解系统漏洞。追踪前沿动态，用红蓝对抗思维，锻造智能时代的坚盾与利矛。」
              </blockquote>
              <div className="about-channels">
                {LINKS.map((l) => (
                  <a className="channel" key={l.label} href={l.href} target="_blank" rel="noreferrer">
                    <b>{l.label}</b>
                    <span className="mono">{l.tag}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section id="projects" no="03" title="花圃 · Cultivated Repos" sub="正在培育的开源项目">
          <div className="proj-list">
            {PROJECTS.map((p, i) => (
              <a className="proj-row" key={p.name} href={p.url} target="_blank" rel="noreferrer">
                <span className="proj-idx mono">{String(i + 1).padStart(2, "0")}</span>
                <div className="proj-main">
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                </div>
                <div className="tags">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <span className="proj-arrow">↗</span>
              </a>
            ))}
          </div>
        </Section>

        <Section id="columns" no="04" title="温室 · CSDN Columns" sub="12+ 系统化专栏 —— 数据实时取自仓库 README">
          {latestPosts.length > 0 && (
            <div className="latest">
              <div className="latest-head">
                <span>最新博文 · RSS 自动同步</span>
                <a href="https://blog.csdn.net/lxcxjxhx/" target="_blank" rel="noreferrer">
                  CSDN ↗
                </a>
              </div>
              <div className="latest-list">
                {latestPosts.slice(0, 5).map((p) => (
                  <a className="latest-item" key={p.url} href={p.url} target="_blank" rel="noreferrer">
                    <span className="latest-date mono">{p.publishedAt}</span>
                    <span className="latest-title">{p.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          {columnsMd ? <Markdown text={columnsMd} /> : <p className="empty">章节未找到（仓库 README 结构可能已调整）。</p>}
        </Section>

        <Section id="pr" no="05" title="授粉 · Open Source PRs" sub="开源社区的合并记录 —— 数据实时取自仓库 PR/README.md">
          <div className="pr-summary">
            <div className="pr-big">
              <b>{prTotal}</b>
              <span>已合并 PR</span>
            </div>
            <div className="pr-big">
              <b>{prProjects}</b>
              <span>涉及项目</span>
            </div>
            <a
              className="btn btn-ghost btn-sm"
              href="https://github.com/lxcxjxhx/HOS-Qian-jia-hong-resume/tree/main/PR"
              target="_blank"
              rel="noreferrer"
            >
              查看全部记录 ↗
            </a>
          </div>
          <div className="table-wrap">
            <table className="pr-table">
              <thead>
                <tr>
                  <th>仓库</th>
                  <th>PR</th>
                  <th>标题</th>
                  <th>合并日期</th>
                </tr>
              </thead>
              <tbody>
                {prRows.map((r, i) => (
                  <tr key={i}>
                    <td className="mono">{r.repo}</td>
                    <td className="mono">{r.pr}</td>
                    <td>{r.title}</td>
                    <td className="mono">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="areas" no="06" title="土壤 · Exploration Areas" sub="正在深耕的领域 —— 数据实时取自仓库 README">
          {areasMd ? <Markdown text={areasMd} /> : <p className="empty">章节未找到（仓库 README 结构可能已调整）。</p>}
        </Section>

        <Section id="achievements" no="07" title="果实 · Achievements" sub="里程碑与荣誉">
          <div className="ach-grid">
            {ACHIEVEMENTS.map((a) => (
              <div className="ach-card" key={a.title}>
                <div className="ach-medal">{a.icon}</div>
                <h3>{a.title}</h3>
                <p>{a.items}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="source" no="08" title="数据源 · Live Database" sub="本站内容实时读取自 HOS-Qian-jia-hong-resume 仓库">
          <div className="src-grid">
            <div className="src-card">
              <div className="src-status">
                <span className={`dot ${live.ok ? "ok" : "off"}`} />
                <div>
                  <b>{live.ok ? "仓库实时可达" : "离线 · 回退至构建快照"}</b>
                  <p className="mono">https://github.com/lxcxjxhx/HOS-Qian-jia-hong-resume @ main</p>
                </div>
              </div>
              <dl className="src-meta">
                <div>
                  <dt>构建快照</dt>
                  <dd className="mono">{resumeSource.fetchedAt.replace("T", " ").slice(0, 19)} UTC</dd>
                </div>
                <div>
                  <dt>README 体积</dt>
                  <dd className="mono">{resumeMd.length} chars</dd>
                </div>
                <div>
                  <dt>PR 记录体积</dt>
                  <dd className="mono">{prMd.length} chars</dd>
                </div>
                <div>
                  <dt>直连校验</dt>
                  <dd className="mono">{live.ok ? `ok · ${live.text.length} chars` : "unreachable"}</dd>
                </div>
                <div>
                  <dt>直连时间</dt>
                  <dd className="mono">{live.at ? live.at.replace("T", " ").slice(0, 19) : "—"}</dd>
                </div>
              </dl>
            </div>
            {ext && (
              <div className="src-card">
                <div className="src-status">
                  <span className="dot ok" />
                  <div>
                    <b>外部数据 · 自动采集</b>
                    <p className="mono">GitHub Actions 定时抓取 → 存储 → 随部署发布 · 本次同步 {fmtTime(ext.updatedAt)}</p>
                  </div>
                </div>
                {ext.sources.github && <GithubPanel s={ext.sources.github} />}
                <div className="ext-grid">
                  {extEntries.map(([key, s]) => (
                    <div className="ext-card" key={key}>
                      <div className="ext-head">
                        <b>{key}</b>
                        <span className="live-badge">live</span>
                      </div>
                      <p>{describeSource(key, s)}</p>
                      <span className="mono ext-time">{fmtTime(s.updatedAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <details className="src-preview">
              <summary>展开 · 阅读完整 README（仓库即数据库的原文预览）</summary>
              <Markdown text={live.ok && live.text ? live.text : resumeMd} />
            </details>
          </div>
        </Section>
      </main>

      <footer className="foot">
        <div className="foot-grid">
          <div className="foot-brand-col">
            <p className="foot-brand">⟢ 安全风信子</p>
            <p className="foot-en mono">SECURITY HYACINTH</p>
            <p className="foot-desc">以代码为武器，在 AI 与安全的交汇处持续耕耘。</p>
          </div>
          <div className="foot-col">
            <h4>通道</h4>
            <div className="foot-links">
              {LINKS.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <div className="foot-col">
            <h4>数据</h4>
            <ul className="foot-data mono">
              <li>seed_db: HOS-Qian-jia-hong-resume</li>
              <li>snapshot: {resumeSource.fetchedAt.slice(0, 10)}</li>
              <li>sources: {extEntries.length || "static"} live</li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom mono">
          <span>⟢ HYACINTH.SIG · v2.0</span>
          <span>⭐ 感谢所有队友、导师与朋友的支持</span>
          <span>built by GitHub Actions</span>
        </div>
      </footer>

      <div className="termbar mono">
        <span>⟢ seed_db: HOS-Qian-jia-hong-resume/main</span>
        <span>snapshot: {resumeSource.fetchedAt.slice(0, 10)}</span>
        <span className={live.ok ? "t-ok" : "t-off"}>● {live.ok ? "connected" : "snapshot"}</span>
        <span className={ext ? "t-ok" : ""}>
          data: {ext ? `${ext.updatedAt.slice(0, 10)} · ${extEntries.length} sources` : "static"}
        </span>
        <span>built by GitHub Actions</span>
      </div>
    </div>
  );
}
