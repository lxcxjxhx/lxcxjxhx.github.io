import { projects } from "../data/projects";
import SectionTitle from "../components/ui/SectionTitle";
import Card from "../components/ui/Card";
import AnimatedNumber from "../components/ui/AnimatedNumber";

export default function ProjectsPage() {
  const totalStars = projects.reduce((sum, p) => sum + (p.stars || 0), 0);

  return (
    <div className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="开源项目"
          subtitle="可复用的安全与 AI 基础设施工具"
          align="left"
        />

        <div className="flex flex-wrap gap-8 mb-12">
          <div className="card-solid px-6 py-4 text-center">
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={projects.length} />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">项目总数</div>
          </div>
          <div className="card-solid px-6 py-4 text-center">
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={totalStars} suffix="+" />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">GitHub Stars</div>
          </div>
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
      </div>
    </div>
  );
}
