export default function SectionTitle({
  title,
  subtitle,
  align = "left",
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-10 ${align === "center" ? "text-center" : "text-left"}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[var(--text-muted)] text-base md:text-lg mb-4 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="section-divider w-full max-w-md" />
    </div>
  );
}
