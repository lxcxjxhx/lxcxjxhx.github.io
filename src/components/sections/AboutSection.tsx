import { Link } from "react-router-dom";
import { aboutInfo } from "../../data/about";
import SectionTitle from "../ui/SectionTitle";

export default function AboutSection() {
  return (
    <section className="py-20 px-4 relative z-10 border-t border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="关于我"
          subtitle="研究者的背景、技能与经历"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-6">
              {aboutInfo.bio}
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href={aboutInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-btn text-sm no-underline"
              >
                GitHub
              </a>
              <Link
                to="/about"
                className="px-5 py-2.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium hover:border-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-all text-sm no-underline"
              >
                完整履历
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {aboutInfo.skills.slice(0, 2).map((group) => (
                <div key={group.category}>
                  <h4 className="text-sm font-semibold text-[var(--hyacinth-lavender)] mb-2">
                    {group.category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs px-2 py-1 rounded bg-[var(--bg-deep)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {aboutInfo.experiences.map((exp) => (
              <div
                key={exp.period}
                className="card-solid p-5"
              >
                <div className="text-xs text-[var(--hyacinth-light)] font-medium mb-1">
                  {exp.period}
                </div>
                <h4 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                  {exp.role}
                </h4>
                <div className="text-sm text-[var(--hyacinth-lavender)] mb-2">
                  {exp.institution}
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
