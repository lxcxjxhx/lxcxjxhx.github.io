import { Link } from "react-router-dom";
import { getProjects } from "../../data/projects";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";
import AnimatedNumber from "../ui/AnimatedNumber";
import Container from "../layout/Container";

export default function ProjectsSection() {
  const projects = getProjects();
  const totalStars = projects.reduce((sum, p) => sum + (p.stars || 0), 0);

  return (
    <section className="py-20 relative z-10 border-t border-[var(--border-subtle)]">
      <Container>
        <SectionTitle
          title="开源项目"
          subtitle="构建 AI 安全与系统底层的基础设施工具"
          align="center"
        />

        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={projects.length} />
            </div>
            <div className="text-sm text-[var(--text-muted)] mt-1">活跃项目</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--text-primary)]">
              <AnimatedNumber value={totalStars} suffix="+" />
            </div>
            <div className="text-sm text-[var(--text-muted)] mt-1">GitHub Stars</div>
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

        <div className="text-center mt-10">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-colors font-medium"
          >
            查看全部项目 <span>→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
