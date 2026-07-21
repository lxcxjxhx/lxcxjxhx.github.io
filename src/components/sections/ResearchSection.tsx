import { Link } from "react-router-dom";
import { researchDirections, columns } from "../../data/research";
import SectionTitle from "../ui/SectionTitle";
import Container from "../layout/Container";

export default function ResearchSection() {
  return (
    <section className="py-20 relative z-10 border-t border-[var(--border-subtle)]">
      <Container>
        <SectionTitle
          title="研究方向"
          subtitle="AI 安全 · 系统底层 · 开源基础设施"
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

        {/* 技术专栏预览 */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {columns.slice(0, 4).map((col) => (
            <a
              key={col.name}
              href={col.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-full bg-[var(--bg-deep)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-all no-underline"
            >
              {col.name}
            </a>
          ))}
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
