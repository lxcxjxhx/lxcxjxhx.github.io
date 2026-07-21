import { Link } from "react-router-dom";
import {
  researchDirections,
  researchAchievements,
  certifications,
} from "../../data/research";
import SectionTitle from "../ui/SectionTitle";
import Container from "../layout/Container";

export default function ResearchSection() {
  const previewAchievements = researchAchievements.slice(0, 2);
  const previewCerts = certifications.slice(0, 3);

  return (
    <section className="py-20 relative z-10 border-t border-[var(--border-subtle)]">
      <Container>
        <SectionTitle
          title="学术与研究"
          subtitle="研究方向、竞赛与认证"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {researchDirections.map((dir) => (
            <div key={dir.title} className="card-solid p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                {dir.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {dir.description}
              </p>
            </div>
          ))}
        </div>

        {/* 成就预览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="card-solid p-5">
            <h4 className="text-sm font-semibold text-[var(--hyacinth-lavender)] mb-3">
              竞赛奖项
            </h4>
            <div className="space-y-2">
              {previewAchievements.map((ach) => (
                <div
                  key={ach.title}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-[var(--text-primary)]">
                    {ach.title}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-deep)] text-[var(--hyacinth-lavender)] border border-[var(--border-subtle)]">
                    {ach.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-solid p-5">
            <h4 className="text-sm font-semibold text-[var(--hyacinth-lavender)] mb-3">
              专业认证
            </h4>
            <div className="flex flex-wrap gap-2">
              {previewCerts.map((cert) => (
                <span
                  key={cert}
                  className="text-xs px-2 py-1 rounded-full bg-[var(--bg-deep)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 论文提示 */}
        <div className="card-solid p-5 text-center mb-10">
          <p className="text-sm text-[var(--text-muted)]">
            目前尚未发表学术论文，正在围绕上述方向积累研究。
          </p>
        </div>

        <div className="text-center">
          <Link
            to="/research"
            className="inline-flex items-center gap-2 text-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-colors font-medium"
          >
            了解更多 <span>→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
