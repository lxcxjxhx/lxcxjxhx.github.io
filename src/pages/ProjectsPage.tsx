import { useMemo } from "react";
import { getProjects } from "../data/projects";
import { githubRepos } from "../data/github-data";
import SectionTitle from "../components/ui/SectionTitle";
import Card from "../components/ui/Card";
import AnimatedNumber from "../components/ui/AnimatedNumber";
import Container from "../components/layout/Container";

export default function ProjectsPage() {
  const projects = getProjects();
  const totalStars = projects.reduce((sum, p) => sum + (p.stars || 0), 0);

  const languageStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const repo of githubRepos) {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
      }
    }
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const total = sorted.reduce((s, [, c]) => s + c, 0);
    return sorted.map(([lang, count]) => ({
      lang,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
  }, []);

  const languagesCount = Object.keys(
    githubRepos.reduce((acc, r) => {
      if (r.language) acc[r.language] = true;
      return acc;
    }, {} as Record<string, boolean>)
  ).length;

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <Container size="lg">
        <SectionTitle
          title="项目"
          subtitle="覆盖安全工具、AI 基础设施与系统底层工程"
          align="left"
        />

        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={projects.length} />
            </div>
            <div className="text-sm text-[var(--text-muted)] mt-1">活跃项目</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={totalStars} suffix="+" />
            </div>
            <div className="text-sm text-[var(--text-muted)] mt-1">GitHub Stars</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={languagesCount} />
            </div>
            <div className="text-sm text-[var(--text-muted)] mt-1">编程语言</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={7} />
            </div>
            <div className="text-sm text-[var(--text-muted)] mt-1">PyPI 包</div>
          </div>
        </div>

        {/* 语言分布 */}
        {languageStats.length > 0 && (
          <div className="card-solid p-6 mb-12">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              语言分布
            </h3>
            <div className="space-y-3">
              {languageStats.map(({ lang, count, pct }) => (
                <div key={lang} className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-muted)] w-16 shrink-0">
                    {lang}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-[var(--bg-deep)] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background:
                          "linear-gradient(90deg, var(--hyacinth-crimson), var(--hyacinth-light))",
                      }}
                    />
                  </div>
                  <span className="text-xs text-[var(--text-muted)] w-12 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 外部平台链接 */}
        <div className="flex flex-wrap gap-3 mb-10">
          <a
            href="https://pypi.org/user/lxcxjxhx/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-[var(--border-subtle)] text-sm text-[var(--text-muted)] hover:border-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-all no-underline"
          >
            PyPI 包
          </a>
          <a
            href="https://security-hyacinth.blog.csdn.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-[var(--border-subtle)] text-sm text-[var(--text-muted)] hover:border-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-all no-underline"
          >
            CSDN 博客
          </a>
          <a
            href="https://github.com/lxcxjxhx"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-[var(--border-subtle)] text-sm text-[var(--text-muted)] hover:border-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-all no-underline"
          >
            GitHub 主页
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              title={project.name}
              description={project.description}
              tag={project.tags[0]}
              status={project.status}
              href={project.repoUrl}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
