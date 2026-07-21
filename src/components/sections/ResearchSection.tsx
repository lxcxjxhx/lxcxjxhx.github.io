import { Link } from "react-router-dom";
import { researchPapers, researchDirections } from "../../data/research";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";

export default function ResearchSection() {
  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="学术研究"
          subtitle="在 AI 安全、系统底层与程序分析方向的探索"
          align="center"
        />

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {researchPapers.slice(0, 2).map((paper) => (
            <Card
              key={paper.id}
              title={paper.title}
              description={paper.abstract}
              tag={paper.venue}
              status={String(paper.year)}
              href={paper.link}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/research"
            className="inline-flex items-center gap-2 text-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-colors font-medium"
          >
            查看全部论文 <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
