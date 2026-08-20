// collect-external.mjs — 外部数据采集器（GitHub / HuggingFace / PyPI / CSDN）
// 用法: node scripts/collect-external.mjs [outFile]   默认 public/data/external.json
// 设计: 每个源独立容错 —— 成功则更新并记录 updatedAt，失败保留旧值，
//       保证站点数据不因单源风控/抖动而丢失。
// 由 GitHub Actions 定时运行（.github/workflows/data-collect.yml），也支持手动执行。

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.resolve(process.argv[2] || path.join(ROOT, "public", "data", "external.json"));

const UA = { "User-Agent": "Mozilla/5.0 (hos-blog-data-collector)" };

async function fetchText(url, tries = 3) {
  let lastErr;
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1200 * i));
    }
  }
  throw lastErr;
}

async function collectGithub() {
  const [user, repos] = await Promise.all([
    fetchText("https://api.github.com/users/lxcxjxhx"),
    fetchText("https://api.github.com/users/lxcxjxhx/repos?per_page=100&type=owner"),
  ]);
  const u = JSON.parse(user);
  const own = JSON.parse(repos).filter((r) => !r.fork);
  const totalStars = own.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  const totalForks = own.reduce((s, r) => s + (r.forks_count || 0), 0);
  const langCount = {};
  for (const r of own) {
    const l = r.language;
    if (l) langCount[l] = (langCount[l] || 0) + 1;
  }
  const topLanguages = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([l]) => l);
  const top = [...own].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))[0];
  const accountYears = Math.max(1, Math.round((Date.now() - Date.parse(u.created_at)) / (365.25 * 24 * 3600 * 1000)));
  return {
    followers: u.followers,
    following: u.following,
    publicRepos: u.public_repos,
    publicGists: u.public_gists,
    totalStars,
    totalForks,
    topLanguages,
    topRepo: top ? { name: top.name, stars: top.stargazers_count || 0 } : null,
    accountYears,
    createdAt: u.created_at,
  };
}

async function collectHf() {
  const arr = JSON.parse(await fetchText("https://huggingface.co/api/models?author=lxcxjxhx&limit=1000"));
  return { models: arr.length };
}

async function collectPypi() {
  const html = await fetchText("https://pypi.org/user/security_hyacinth/");
  const projects = [...new Set([...html.matchAll(/href="\/project\/([^"/]+)\/"/g)].map((m) => m[1]))];
  if (projects.length === 0) throw new Error("页面未返回项目列表（可能被风控拦截）");
  return { packages: projects.length, names: projects.slice(0, 20) };
}

// CSDN 统计类数字以 README/静态数据为权威源（页面被风控时正则易误抓），
// 这里只采集稳定可用的 RSS 最新博文。
async function collectCsdnLatest() {
  const xml = await fetchText("https://blog.csdn.net/lxcxjxhx/rss/list");
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .slice(0, 8)
    .map((m) => {
      const it = m[1];
      const title = (it.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || it.match(/<title>([\s\S]*?)<\/title>/))?.[1] ?? "";
      const link = it.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "";
      const pub = (it.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || it.match(/<dc:date>([\s\S]*?)<\/dc:date>/))?.[1] ?? "";
      const date = pub ? new Date(pub).toISOString().slice(0, 10) : "";
      return { title: title.trim(), url: link.trim(), publishedAt: date };
    })
    .filter((x) => x.title && x.url);
  return { latest: items };
}

// ── 数据域映射（文件管理约定）──────────────────────────────────
// 每个数据源归属一个"数据域"（domain），同域共用一个 SQLite 库文件：
//   <HOS_DB_DIR>/<domain>.db
// 新增数据源时在此登记 domain —— 新域自动建库并登记到 manifest.json 台账。
const SOURCE_DB = {
  github: "external",
  hf: "external",
  pypi: "external",
  csdn: "external",
};

// SQLite 存储（私有数据中枢用）：latest 当前值 + history 追加历史（数据湖）
// 通过环境变量 HOS_DB_DIR 启用（目录，如 data/db）；站点构建不设置则仅写 JSON。
async function writeSqlite(sources, now) {
  const dir = process.env.HOS_DB_DIR;
  if (!dir) return;
  let DatabaseSync;
  try {
    ({ DatabaseSync } = await import("node:sqlite"));
  } catch {
    console.warn("node:sqlite 不可用（需要 Node >= 23.4），跳过 SQLite 存储");
    return;
  }
  const dbDir = path.resolve(dir);
  fs.mkdirSync(dbDir, { recursive: true });

  // 按数据域分组
  const byDb = {};
  for (const [key, src] of Object.entries(sources)) {
    const domain = SOURCE_DB[key] || "external";
    (byDb[domain] ||= []).push([key, src]);
  }

  // manifest.json = 数据库台账（名称/文件/来源/schema 版本/更新时间）
  const manifestPath = path.join(path.dirname(dbDir), "manifest.json");
  const manifest = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, "utf-8"))
    : { updatedAt: now, dbs: [] };

  for (const [domain, entries] of Object.entries(byDb)) {
    const dbFile = path.join(dbDir, `${domain}.db`);
    const db = new DatabaseSync(dbFile);
    db.exec(`CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );`);
    db.exec(`CREATE TABLE IF NOT EXISTS latest (
      source TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`);
    db.exec(`CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      data TEXT NOT NULL,
      collected_at TEXT NOT NULL
    );`);
    const setMeta = db.prepare(`INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)`);
    setMeta.run("schema_version", "1");
    setMeta.run("created_at", now);
    setMeta.run("description", `data domain: ${domain}`);
    const readOld = db.prepare(`SELECT data FROM latest WHERE source = ?`);
    const upsert = db.prepare(`INSERT INTO latest (source, data, updated_at) VALUES (?, ?, ?)
      ON CONFLICT(source) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`);
    const insHist = db.prepare(`INSERT INTO history (source, data, collected_at) VALUES (?, ?, ?)`);
    db.exec("BEGIN");
    try {
      for (const [key, src] of entries) {
        const { updatedAt, ...rest } = src;
        const payload = JSON.stringify(rest);
        const old = readOld.get(key);
        upsert.run(key, payload, now);
        if (!old || old.data !== payload) insHist.run(key, payload, now);
      }
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
    db.close();

    // 更新台账
    let entry = manifest.dbs.find((d) => d.id === domain);
    if (!entry) {
      entry = { id: domain, file: `db/${domain}.db`, sources: [], schemaVersion: 1, createdAt: now };
      manifest.dbs.push(entry);
    }
    entry.updatedAt = now;
    entry.schemaVersion = 1;
    entry.sources = [...new Set([...entry.sources, ...entries.map(([k]) => k)])];
    console.log(`ok:   sqlite -> ${dbFile} (domain: ${domain})`);
  }

  manifest.updatedAt = now;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
  console.log(`ok:   manifest -> ${manifestPath}`);
}

async function main() {
  const old = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf-8")) : {};
  const sources = old.sources || {};
  const now = new Date().toISOString();

  const save = (key, v) => {
    const prev = sources[key] || {};
    const merged = { ...prev, ...v, updatedAt: now };
    // 丢弃 undefined，避免写坏结构
    for (const k of Object.keys(merged)) if (merged[k] === undefined) delete merged[k];
    sources[key] = merged;
  };
  const tryCollect = async (key, fn, prev) => {
    try {
      save(key, await fn(prev));
      console.log(`ok:   ${key}`);
    } catch (e) {
      console.warn(`fail: ${key} (${e.message}) — 保留旧值`);
    }
  };

  await Promise.all([
    tryCollect("github", collectGithub),
    tryCollect("hf", collectHf),
    tryCollect("pypi", collectPypi),
    tryCollect("csdn", collectCsdnLatest),
  ]);

  const data = { updatedAt: now, sources };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n", "utf-8");
  console.log(`written -> ${OUT}`);

  await writeSqlite(sources, now);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
