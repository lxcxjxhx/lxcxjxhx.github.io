import { type ReactNode } from "react";

type Tok =
  | { t: "text"; v: string }
  | { t: "code"; v: string }
  | { t: "b"; v: string }
  | { t: "i"; v: string }
  | { t: "a"; label: string; href: string }
  | { t: "img"; alt: string };

// 轻量 Markdown 渲染器（纯文本 → React 节点，无 dangerouslySetInnerHTML）
function tokenize(s: string): Tok[] {
  const toks: Tok[] = [];
  const re =
    /(`[^`]+`)|(\*\*[^*]+?\*\*)|(\*[^*\n]+?\*)|(\[(!\[[^\]]*\]\([^)]*\))\]\(([^)\s]+)\))|(!\[([^\]]*)\]\([^)\s]+\))|(\[([^\]]*)\]\(([^)\s]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) toks.push({ t: "text", v: s.slice(last, m.index) });
    if (m[1]) toks.push({ t: "code", v: m[1].slice(1, -1) });
    else if (m[2]) toks.push({ t: "b", v: m[2].slice(2, -2) });
    else if (m[3]) toks.push({ t: "i", v: m[3].slice(1, -1) });
    else if (m[4]) {
      const inner = m[5] ?? "";
      const alt = inner.startsWith("![") ? inner.slice(2, -2) : "";
      toks.push({ t: "a", label: alt, href: m[6] ?? "" });
    } else if (m[7]) toks.push({ t: "img", alt: m[8] ?? "" });
    else if (m[9]) toks.push({ t: "a", label: m[10] ?? "", href: m[11] ?? "" });
    last = re.lastIndex;
  }
  if (last < s.length) toks.push({ t: "text", v: s.slice(last) });
  return toks;
}

function inlineNodes(s: string, keyBase: string): ReactNode[] {
  return tokenize(s).map((tok, i) => {
    const key = `${keyBase}-${i}`;
    switch (tok.t) {
      case "code":
        return <code key={key}>{tok.v}</code>;
      case "b":
        return <strong key={key}>{tok.v}</strong>;
      case "i":
        return <em key={key}>{tok.v}</em>;
      case "img":
        return (
          <span key={key} className="md-chip">
            {tok.alt}
          </span>
        );
      case "a":
        return /^https?:\/\//.test(tok.href) ? (
          <a key={key} href={tok.href} target="_blank" rel="noreferrer">
            {tok.label}
          </a>
        ) : (
          <a key={key} href={tok.href}>
            {tok.label}
          </a>
        );
      default:
        return tok.v;
    }
  });
}

// 预处理：去注释 / HTML 表格转管道表 / 徽章图片转 chip / 去标签
export function preprocess(raw: string): string {
  let t = raw
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<table[\s\S]*?<\/table>/g, (tableHtml) => {
      const rows: string[] = [];
      const trRe = /<tr>([\s\S]*?)<\/tr>/g;
      let tr: RegExpExecArray | null;
      while ((tr = trRe.exec(tableHtml)) !== null) {
        const cells: string[] = [];
        const tdRe = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g;
        let td: RegExpExecArray | null;
        while ((td = tdRe.exec(tr[1])) !== null) {
          cells.push(td[1].replace(/<[^>]+>/g, "").trim().replace(/\|/g, "｜"));
        }
        rows.push("| " + cells.join(" | ") + " |");
      }
      return rows.join("\n");
    })
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<img\s[^>]*alt="([^"]*)"[^>]*>/gi, (_m, alt: string) => `![${alt}]()`)
    .replace(/<[^>]+>/g, "");
  // 清理多余空行
  t = t.replace(/\n{3,}/g, "\n\n");
  return t;
}

function buildBlocks(lines: string[]): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const k = key++;

    if (line.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      out.push(
        <pre key={k}>
          <code>{buf.join("\n")}</code>
        </pre>
      );
      continue;
    }

    if (line.startsWith("|")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        buf.push(lines[i]);
        i++;
      }
      const rows = buf.map((r) => r.split("|").slice(1, -1).map((c) => c.trim()));
      const body = rows.filter((r, idx) => !(idx === 1 && r.every((c) => /^-+$/.test(c))));
      const header = body[0] ?? [];
      const data = body.slice(1);
      out.push(
        <div className="table-wrap" key={k}>
          <table>
            <thead>
              <tr>
                {header.map((c, ci) => (
                  <th key={ci}>{inlineNodes(c, `th-${ci}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((r, ri) => (
                <tr key={ri}>
                  {r.map((c, ci) => (
                    <td key={ci}>{inlineNodes(c, `td-${ri}-${ci}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      const content = inlineNodes(h[2] ?? "", `h-${k}`);
      if (lvl === 1) out.push(<h2 key={k}>{content}</h2>);
      else if (lvl === 2) out.push(<h3 key={k}>{content}</h3>);
      else out.push(<h4 key={k}>{content}</h4>);
      i++;
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      out.push(<hr key={k} />);
      i++;
      continue;
    }

    if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      out.push(
        <blockquote key={k}>
          {buf.map((l, bi) => (
            <p key={bi}>{inlineNodes(l, `bq-${bi}`)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && (/^[-*]\s+/.test(lines[i]) || /^\d+\.\s+/.test(lines[i]))) {
        buf.push(lines[i].replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, ""));
        i++;
      }
      out.push(
        <ul key={k}>
          {buf.map((l, li) => (
            <li key={li}>{inlineNodes(l, `li-${li}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // 普通段落：收集连续普通行
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("|") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith(">") &&
      !/^(#{1,4})\s/.test(lines[i]) &&
      !/^(-{3,}|\*{3,})$/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    out.push(
      <p key={k}>
        {buf.map((l, li) => (
          <span key={li}>
            {inlineNodes(l, `p-${li}`)}
            {li < buf.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    );
  }
  return out;
}

export function Markdown({ text, className }: { text: string; className?: string }) {
  const lines = preprocess(text).split("\n");
  return <div className={className ? `md ${className}` : "md"}>{buildBlocks(lines)}</div>;
}
