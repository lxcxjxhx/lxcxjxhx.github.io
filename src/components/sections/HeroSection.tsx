import { Link } from "react-router-dom";
import Container from "../layout/Container";
import { aboutInfo } from "../../data/about";

export default function HeroSection() {
  const { name, bio } = aboutInfo;
  const displayName = name === "Hyacinth-of-Security" ? "钱佳宏" : name;

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              <span className="gradient-text-hero">{displayName}</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-muted)] mb-3 max-w-lg">
              AI · 安全 · 系统底层
            </p>
            <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-lg leading-relaxed">
              {bio.split("。")[0]}。
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                to="/blog"
                className="glow-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium"
              >
                技术博客
              </Link>
              <a
                href="https://github.com/lxcxjxhx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium border border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-all no-underline"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Right: Decorative illustration (hidden on mobile) */}
          <div className="hidden md:block relative">
            <img
              src="/illustrations/hero-decoration.jpg"
              alt=""
              className="w-full rounded-2xl opacity-80"
              loading="eager"
            />
            {/* Glow overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-40" />
          </div>
        </div>
      </Container>
    </section>
  );
}
