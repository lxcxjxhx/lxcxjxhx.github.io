import type { ReactNode } from "react";

const variantMap: Record<string, { bg: string; border: string; text: string }> = {
  default: {
    bg: "rgba(140, 110, 159, 0.1)",
    border: "rgba(140, 110, 159, 0.3)",
    text: "#B49BC4",
  },
  crimson: {
    bg: "rgba(134, 44, 59, 0.1)",
    border: "rgba(134, 44, 59, 0.3)",
    text: "#B33F4E",
  },
  green: {
    bg: "rgba(108, 203, 76, 0.1)",
    border: "rgba(108, 203, 76, 0.3)",
    text: "#6CCB4C",
  },
  lavender: {
    bg: "rgba(180, 155, 196, 0.1)",
    border: "rgba(180, 155, 196, 0.3)",
    text: "#B49BC4",
  },
  purple: {
    bg: "rgba(140, 110, 159, 0.15)",
    border: "rgba(140, 110, 159, 0.35)",
    text: "#8C6E9F",
  },
  red: {
    bg: "rgba(179, 63, 78, 0.1)",
    border: "rgba(179, 63, 78, 0.3)",
    text: "#B33F4E",
  },
  muted: {
    bg: "rgba(59, 61, 56, 0.5)",
    border: "rgba(59, 61, 56, 0.8)",
    text: "#b0b0a8",
  },
  outline: {
    bg: "transparent",
    border: "rgba(140, 110, 159, 0.4)",
    text: "#8C6E9F",
  },
};

export default function Badge({
  variant = "default",
  text,
  children,
}: {
  variant?: string;
  text?: string;
  children?: ReactNode;
}) {
  const style = variantMap[variant] || variantMap.default;
  const content = text || children;

  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.text,
      }}
    >
      {content}
    </span>
  );
}
