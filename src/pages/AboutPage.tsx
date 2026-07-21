import { aboutInfo } from "../data/about";
import SectionTitle from "../components/ui/SectionTitle";
import Container from "../components/layout/Container";
import AnimatedNumber from "../components/ui/AnimatedNumber";

export default function AboutPage() {
  return (
    <div className="pt-24 pb-12 min-h-screen">
      <Container size="md">
        <SectionTitle
          title="关于我"
          subtitle="背景、技能与开源贡献"
          align="left"
        />

        {/* 个人简介卡 */}
        <div className="card-solid p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {aboutInfo.avatarUrl && (
              <img
                src={aboutInfo.avatarUrl}
                alt={aboutInfo.name}
                className="w-20 h-20 rounded-full border-2 border-[var(--border-subtle)]"
              />
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                {aboutInfo.name}
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                {aboutInfo.location} · {aboutInfo.email} · {aboutInfo.phone}
              </p>
              <p className="text-base text-[var(--text-muted)] leading-relaxed mb-5">
                {aboutInfo.bio}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={aboutInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glow-btn text-sm no-underline"
                >
                  GitHub
                </a>
                <a
                  href={aboutInfo.csdn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium hover:border-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-all text-sm no-underline"
                >
                  CSDN
                </a>
                <a
                  href={aboutInfo.pypi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium hover:border-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-all text-sm no-underline"
                >
                  PyPI
                </a>
                <a
                  href={`mailto:${aboutInfo.email}`}
                  className="px-5 py-2.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium hover:border-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-all text-sm no-underline"
                >
                  发送邮件
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 数据仪表盘 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-solid p-5 text-center">
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={aboutInfo.stats.githubCommits} suffix="+" />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              GitHub Commits
            </div>
          </div>
          <div className="card-solid p-5 text-center">
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={aboutInfo.stats.csdnArticles} />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              CSDN 文章
            </div>
          </div>
          <div className="card-solid p-5 text-center">
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={aboutInfo.stats.pypiPackages} />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              PyPI 包
            </div>
          </div>
          <div className="card-solid p-5 text-center">
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={aboutInfo.stats.mergedPRs} suffix="+" />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              Merged PRs
            </div>
          </div>
        </div>

        {/* 技能矩阵 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {aboutInfo.skills.map((group) => (
            <div key={group.category} className="card-solid p-6">
              <h3 className="text-base font-semibold text-[var(--hyacinth-lavender)] mb-3">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-deep)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 成就与认证 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            成就与认证
          </h3>
          <div className="flex flex-wrap gap-2">
            {aboutInfo.achievements.map((ach) => (
              <span
                key={ach}
                className="text-sm px-3 py-1.5 rounded-full bg-[var(--bg-deep)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
              >
                {ach}
              </span>
            ))}
          </div>
        </div>

        {/* 经历 */}
        {aboutInfo.experiences.length > 0 && (
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              经历
            </h3>
            {aboutInfo.experiences.map((exp) => (
              <div key={exp.period + exp.role} className="card-solid p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-2">
                  <h4 className="text-base font-semibold text-[var(--text-primary)]">
                    {exp.role}
                  </h4>
                  <span className="text-xs text-[var(--hyacinth-light)] font-medium">
                    {exp.period}
                  </span>
                </div>
                <div className="text-sm text-[var(--hyacinth-lavender)] mb-2">
                  {exp.institution}
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 教育 */}
        {aboutInfo.education.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              教育
            </h3>
            {aboutInfo.education.map((edu) => (
              <div key={edu.period} className="card-solid p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                  <h4 className="text-base font-semibold text-[var(--text-primary)]">
                    {edu.degree}
                  </h4>
                  <span className="text-xs text-[var(--hyacinth-light)] font-medium">
                    {edu.period}
                  </span>
                </div>
                <div className="text-sm text-[var(--hyacinth-lavender)] mt-1">
                  {edu.institution}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
