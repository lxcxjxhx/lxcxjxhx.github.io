import { Link } from "react-router-dom";
import Container from "../layout/Container";
import { aboutInfo } from "../../data/about";

export default function HeroSection() {
  const { stats } = aboutInfo;

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center">
      <Container size="md" className="text-center relative z-10 py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--hyacinth-light)]/30 bg-[var(--hyacinth-light)]/5 text-[var(--hyacinth-lavender)] text-sm mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--hyacinth-green)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--hyacinth-green)]"></span>
          </span>
          CSDN {stats.csdnArticles.toLocaleString()} 篇文章 · {stats.mergedPRs}+ 合并 PR
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
      </Container>
    </section>
  );
}
