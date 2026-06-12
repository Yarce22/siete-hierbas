const labelStyle: React.CSSProperties = {
  fontSize: "0.62rem",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "var(--sh-dark-5)",
  fontFamily: "var(--sh-sans)",
  fontWeight: 600,
};

export function LegalPage({
  label,
  title,
  lastUpdated,
  children,
}: {
  label: string;
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ fontFamily: "var(--sh-sans)", color: "var(--sh-forest)", minHeight: "80vh" }}>
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "4rem 2rem 2.5rem" }}>
        <p style={labelStyle}>{label}</p>
        <h1
          style={{
            fontFamily: "var(--sh-serif)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 400,
            lineHeight: 1.15,
            color: "var(--sh-dark-5)",
            margin: "0.75rem 0 1rem",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: "0.78rem", color: "var(--sh-dark-4)", letterSpacing: "0.04em" }}>
          Última actualización: {lastUpdated}
        </p>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 2rem 6rem" }}>
        <div className="legal-content">{children}</div>
      </section>

      <style>{`
        .legal-content { display: flex; flex-direction: column; gap: 2.5rem; }
        .legal-section h2 {
          font-family: var(--sh-serif);
          font-size: 1.45rem;
          font-weight: 500;
          color: var(--sh-dark-5);
          margin: 0 0 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(42,56,24,0.2);
        }
        .legal-section p, .legal-section li {
          font-size: 0.975rem;
          color: var(--sh-forest);
          line-height: 1.85;
          margin: 0 0 0.6rem;
        }
        .legal-section ul {
          padding-left: 1.2rem;
          margin: 0.5rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .legal-section a {
          color: var(--sh-dark-5);
          text-underline-offset: 3px;
          text-decoration: underline;
        }
        .legal-section strong {
          color: var(--sh-dark-5);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="legal-section">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
