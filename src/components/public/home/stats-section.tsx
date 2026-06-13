import { AnimatedCounter } from "@/components/public/animated-counter";

const STATS = [
  { end: 4,  suffix: "",  label: "Décadas de tradición" },
  { end: 12, suffix: "+", label: "Años de experiencia" },
  { end: 1,  suffix: "",  label: "Lugar único en Colombia" },
];

export function StatsSection() {
  return (
    <section
      className="sh-stats-section"
      style={{
        background: "var(--sh-dark-2)",
        padding: "5rem 4rem",
        borderTop: "1px solid rgba(228,215,184,0.06)",
        borderBottom: "1px solid rgba(228,215,184,0.06)",
      }}
    >
      <div className="sh-layout-stats">
        {STATS.map((s, i) => (
          <div key={i} className="sh-reveal sh-stat-item" data-delay={String(i * 150)} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ fontFamily: "var(--sh-serif)", fontSize: "clamp(3.5rem, 7vw, 5.5rem)", fontWeight: 300, color: "var(--sh-cream)", lineHeight: 1 }}>
              <AnimatedCounter end={s.end} suffix={s.suffix} />
            </div>
            <div style={{ fontSize: "0.65rem", fontWeight: "bold", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sh-forest)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
