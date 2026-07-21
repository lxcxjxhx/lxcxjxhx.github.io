import { researchPapers, researchDirections } from "../data/research";
import SectionTitle from "../components/ui/SectionTitle";
import Container from "../components/layout/Container";

export default function ResearchPage() {
  return (
    <div className="pt-24 pb-12 min-h-screen">
      <Container>
        <SectionTitle
          title="学术研究"
          subtitle="研究方向与技术探索"
          align="left"
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

        {researchPapers.length > 0 && (
          <div className="space-y-6">
            {researchPapers.map((paper) => (
              <div
                key={paper.id}
                className="card-solid p-6 cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  {paper.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {paper.abstract}
                </p>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
