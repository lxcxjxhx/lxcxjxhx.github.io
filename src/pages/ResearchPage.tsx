import {
  researchDirections,
  researchAchievements,
  certifications,
  columns,
} from "../data/research";
import SectionTitle from "../components/ui/SectionTitle";
import Container from "../components/layout/Container";

export default function ResearchPage() {
  return (
    <div className="pt-24 pb-12 min-h-screen">
      <Container size="lg">
        <SectionTitle
          title="学术与研究"
          subtitle="研究方向、技术专栏与竞赛认证"
          align="left"
        />

        {/* 研究方向 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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

        {/* 技术专栏 */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            技术专栏
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {columns.map((col) => (
              <a
                key={col.name}
                href={col.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-solid p-4 no-underline block"
              >
                <div className="text-sm font-medium text-[var(--text-primary)] mb-1">
                  {col.name}
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  CSDN 专栏
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 竞赛与认证 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              竞赛奖项
            </h3>
            <div className="space-y-3">
              {researchAchievements.map((ach) => (
                <div
                  key={ach.title}
                  className="card-solid p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--hyacinth-crimson)] to-[var(--hyacinth-red)] flex items-center justify-center text-white text-xs font-bold">
                      {ach.title.charAt(0)}
                    </span>
                    <span className="text-sm text-[var(--text-primary)]">
                      {ach.title}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-[var(--bg-deep)] text-[var(--hyacinth-lavender)] border border-[var(--border-subtle)]">
                    {ach.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              专业认证
            </h3>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <span
                  key={cert}
                  className="text-sm px-3 py-1.5 rounded-full bg-[var(--bg-deep)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 论文发表 */}
        <div className="card-solid p-8 text-center">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            论文发表
          </h3>
          <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
            目前尚未发表学术论文，正在围绕上述方向积累研究。关注 CSDN 博客获取最新研究进展与写作分享。
          </p>
        </div>
      </Container>
    </div>
  );
}
