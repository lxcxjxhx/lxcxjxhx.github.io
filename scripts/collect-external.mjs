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
  const j = JSON.parse(await fetchText("https://api.github.com/users/lxcxjxhx"));
  return { followers: j.followers, publicRepos: j.public_repos, createdAt: j.created_at };
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
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
