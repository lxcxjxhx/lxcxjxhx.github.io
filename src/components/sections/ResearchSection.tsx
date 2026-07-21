import { Link } from "react-router-dom";
import { researchPapers, researchDirections } from "../../data/research";
import SectionTitle from "../ui/SectionTitle";
import Container from "../layout/Container";

export default function ResearchSection() {
  return (
    <section className="py-20 relative z-10">
      <Container>
        <SectionTitle
          title="学术研究"
          subtitle="在 AI 安全、系统底层与程序分析方向的探索"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {researchPapers.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {researchPapers.slice(0, 2).map((paper) => (
                <div
                  key={paper.id}
                  className="card-solid p-6 cursor-pointer"
                >
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">
                    {paper.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {paper.abstract}
                  </p>
                </div>
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
          </>
        )}
      </Container>
    </section>
  );
}
