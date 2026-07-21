import { useState } from "react";
import type { ReactNode } from "react";
import Badge from "./Badge";

export default function Card({
  icon,
  title,
  description,
  tag,
  status,
  href,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  tag?: string;
  status?: string;
  href?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const isExternal = href?.startsWith("http");

  const statusVariant =
    status === "active"
      ? "green"
      : status === "beta"
        ? "lavender"
        : status === "planned"
          ? "muted"
          : "outline";

  const Wrapper = href ? "a" : "div";
  const wrapperProps = href
    ? {
        href,
        target: isExternal ? "_blank" : undefined,
        rel: isExternal ? "noopener noreferrer" : undefined,
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="card-solid block p-6 cursor-pointer no-underline"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between mb-3">
        {icon && (
          <span className="text-2xl text-[var(--hyacinth-light)]">{icon}</span>
        )}
        <div className="flex gap-2 flex-wrap justify-end">
          {tag && <Badge variant="purple">{tag}</Badge>}
          {status && <Badge variant={statusVariant}>{status}</Badge>}
        </div>
      </div>
      <h3
        className="text-lg font-semibold mb-2 transition-colors duration-300"
        style={{
          color: hovered ? "var(--hyacinth-lavender)" : "var(--text-primary)",
        }}
      >
        {title}
      </h3>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
        {description}
      </p>
      {href && (
        <span
          className="inline-flex items-center gap-1 text-sm font-medium transition-all duration-300"
          style={{
            color: "var(--hyacinth-light)",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(-4px)",
          }}
        >
          了解更多 <span>→</span>
        </span>
      )}
    </Wrapper>
  );
}
