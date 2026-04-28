"use client";

const TESTIMONIALS = [
  {
    text: "Un lugar mágico. Las hierbas son de una calidad excepcional.",
    author: "María C., Bogotá",
  },
  {
    text: "El hostal tiene una energía única. Volveré siempre.",
    author: "Juan P., Medellín",
  },
  {
    text: "La tintura de valeriana cambió mis noches completamente.",
    author: "Andrea M., Cali",
  },
  {
    text: "La atención es cálida, como estar en casa. Muy recomendado.",
    author: "Carlos R., Pereira",
  },
  {
    text: "Productos 100% naturales, éticos y de altísima calidad.",
    author: "Sofía L., Manizales",
  },
  {
    text: "Santa Rosa de Cabal + Siete Hierbas = experiencia perfecta.",
    author: "Diana V., Armenia",
  },
];

const items = [...TESTIMONIALS, ...TESTIMONIALS];

export function TestimonialMarquee() {
  return (
    <div style={{ overflow: "hidden", position: "relative", padding: "2rem 0" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 120,
          background: "linear-gradient(to right, var(--sh-dark-2), transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 120,
          background:
            "linear-gradient(to left, var(--sh-dark-2), transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          gap: "3rem",
          animation: "sh-marquee 40s linear infinite",
          width: "max-content",
        }}
      >
        {items.map((t, i) => (
          <div
            key={i}
            className="sh-testimonial-card"
            style={{
              minWidth: 320,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(228,215,184,0.08)",
              padding: "2rem 2.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", gap: 3 }}>
              {[...Array(5)].map((_, j) => (
                <svg
                  key={j}
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="#c9923a"
                  stroke="#c9923a"
                  strokeWidth="1.5"
                >
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              ))}
            </div>
            <p
              style={{
                fontFamily: "var(--sh-serif)",
                fontSize: "1.05rem",
                fontStyle: "italic",
                color: "var(--sh-cream)",
                lineHeight: 1.6,
              }}
            >
              &ldquo;{t.text}&rdquo;
            </p>
            <span
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--sh-gold)",
              }}
            >
              — {t.author}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
