import { Link } from "react-router-dom";
import { aboutInfo } from "../../data/about";
import SectionTitle from "../ui/SectionTitle";
import Container from "../layout/Container";
import AnimatedNumber from "../ui/AnimatedNumber";

export default function AboutSection() {
  return (
    <section className="py-20 relative z-10 border-t border-[var(--border-subtle)]">
      <Container>
        <SectionTitle
          title="关于我"
          subtitle="背景、技能与开源贡献"
          align="center"
        />

        <div className="card-solid p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {aboutInfo.avatarUrl && (
              <img
                src={aboutInfo.avatarUrl}
                alt={aboutInfo.name}
                className="w-16 h-16 rounded-full border-2 border-[var(--border-subtle)]"
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                {aboutInfo.name}
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-3">
                {aboutInfo.location} · {aboutInfo.email}
              </p>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {aboutInfo.bio}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-solid p-4 text-center">
            <div className="text-xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={aboutInfo.stats.githubCommits} suffix="+" />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Commits</div>
          </div>
          <div className="card-solid p-4 text-center">
            <div className="text-xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={aboutInfo.stats.csdnArticles} />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">CSDN 文章</div>
          </div>
          <div className="card-solid p-4 text-center">
            <div className="text-xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={aboutInfo.stats.pypiPackages} />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">PyPI 包</div>
          </div>
          <div className="card-solid p-4 text-center">
            <div className="text-xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={aboutInfo.stats.mergedPRs} suffix="+" />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Merged PRs</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {aboutInfo.skills.slice(0, 2).map((group) => (
            <div key={group.category} className="card-solid p-5">
              <h4 className="text-sm font-semibold text-[var(--hyacinth-lavender)] mb-2">
                {group.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2 py-1 rounded-full bg-[var(--bg-deep)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-colors font-medium"
          >
            了解更多 <span>→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
