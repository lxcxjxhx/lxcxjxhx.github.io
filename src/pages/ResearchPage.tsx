import { researchPapers, researchDirections } from "../data/research";
import SectionTitle from "../components/ui/SectionTitle";
import Card from "../components/ui/Card";

export default function ResearchPage() {
  return (
    <div className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="学术研究"
          subtitle="论文发表、研究方向与学术贡献"
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

        <div className="space-y-6">
          {researchPapers.map((paper) => (
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
      </div>
    </div>
  );
}
