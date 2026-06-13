export function BotanicalDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "1.5rem 0", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, var(--sh-wood))" }} />
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
        <path d="M20 10 C20 10 14 4 8 6 C6 10 8 14 12 13 C15 12 16 9 20 10" stroke="var(--sh-wood)" strokeWidth="1" fill="none" />
        <path d="M20 10 C20 10 26 4 32 6 C34 10 32 14 28 13 C25 12 24 9 20 10" stroke="var(--sh-wood)" strokeWidth="1" fill="none" />
        <circle cx="20" cy="10" r="1.5" fill="var(--sh-wood)" />
      </svg>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, var(--sh-wood))" }} />
    </div>
  );
}

export function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className="sh-eyebrow sh-reveal" style={center ? { justifyContent: "center" } : undefined}>
      {children}
    </div>
  );
}

export function ImgPlaceholder({ label, height = 400, icon }: { label: string; height?: number; icon?: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height,
        background: "var(--sh-dark-3)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        color: "var(--sh-cream-3)",
        fontSize: "0.65rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        border: "1px solid rgba(228,215,184,0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(228,215,184,0.015) 20px, rgba(228,215,184,0.015) 21px)",
        }}
      />
      {icon ?? (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--sh-cream-3)" strokeWidth="1.2">
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21,15 16,10 5,21" />
        </svg>
      )}
      <span style={{ position: "relative" }}>{label}</span>
    </div>
  );
}

export const btnPrimaryStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6rem",
  background: "var(--sh-gold)",
  color: "var(--sh-cream)",
  fontFamily: "var(--sh-sans)",
  fontSize: "0.72rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  fontWeight: 500,
  padding: "0.9rem 2rem",
  border: "none",
  textDecoration: "none",
};

export const btnOutlineStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6rem",
  background: "var(--sh-forest)",
  color: "var(--sh-cream)",
  fontFamily: "var(--sh-sans)",
  fontSize: "0.72rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  fontWeight: 400,
  padding: "0.9rem 2rem",
  border: "1px solid rgba(228,215,184,0.35)",
  textDecoration: "none",
};
