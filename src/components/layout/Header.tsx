import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "./Container";

const navItems = [
  { path: "/", label: "首页" },
  { path: "/research", label: "学术" },
  { path: "/projects", label: "项目" },
  { path: "/blog", label: "博客" },
  { path: "/about", label: "关于" },
];

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
      <Container className="h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline group">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--hyacinth-crimson)] to-[var(--hyacinth-green)] flex items-center justify-center text-white font-bold text-sm">
            H
          </span>
          <span className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--hyacinth-lavender)] transition-colors">
            HOS
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors relative"
                style={{
                  color: active
                    ? "var(--hyacinth-lavender)"
                    : "var(--text-muted)",
                }}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[var(--hyacinth-light)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          className="md:hidden p-2 text-[var(--text-muted)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M4 4l12 12M16 4L4 16" />
            ) : (
              <path d="M2 5h16M2 10h16M2 15h16" />
            )}
          </svg>
        </button>
      </Container>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
          <Container>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block py-3 text-sm font-medium border-b border-[var(--border-subtle)] last:border-0 -mx-4 px-4"
                style={{
                  color:
                    location.pathname === item.path
                      ? "var(--hyacinth-lavender)"
                      : "var(--text-muted)",
                }}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </Container>
        </div>
      )}
    </header>
  );
}
