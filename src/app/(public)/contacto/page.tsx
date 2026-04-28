import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto — Siete Hierbas",
  description:
    "Contactanos por WhatsApp para pedidos de productos naturistas o reservas del hostal en Santa Rosa de Cabal.",
};

const WA_TIENDA = "573XXXXXXXXX";
const WA_HOSTAL = "573XXXXXXXXX";

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const dividerStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid rgba(228,215,184,0.08)",
  margin: "0",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.62rem",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "var(--sh-gold)",
  fontFamily: "var(--sh-sans)",
  fontWeight: 500,
};

export default function ContactoPage() {
  return (
    <div
      style={{
        fontFamily: "var(--sh-sans)",
        color: "var(--sh-cream)",
        minHeight: "80vh",
      }}
    >
      {/* ── HEADER ──────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "4rem 2rem 3rem",
        }}
      >
        <p style={labelStyle}>Contacto</p>
        <h1
          style={{
            fontFamily: "var(--sh-serif)",
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            color: "var(--sh-cream)",
            margin: "0.75rem 0 1.25rem",
            letterSpacing: "-0.01em",
          }}
        >
          Estamos en Santa Rosa de Cabal
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--sh-cream-2)",
            fontWeight: 300,
            maxWidth: 520,
            lineHeight: 1.7,
          }}
        >
          Escribinos por WhatsApp para consultas sobre productos naturistas,
          pedidos o reservas del hostal. Respondemos rápido.
        </p>
      </section>

      {/* ── CONTACT CARDS ───────────────────────────────── */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 2rem 5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Herboristería */}
        <div
          style={{
            background: "var(--sh-dark-2)",
            border: "1px solid rgba(228,215,184,0.08)",
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <div>
            <p style={labelStyle}>Herboristería · Tienda</p>
            <h2
              style={{
                fontFamily: "var(--sh-serif)",
                fontSize: "1.9rem",
                fontWeight: 400,
                color: "var(--sh-cream)",
                margin: "0.5rem 0 0",
                lineHeight: 1.2,
              }}
            >
              Productos Naturistas
            </h2>
          </div>

          <hr style={dividerStyle} />

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", color: "var(--sh-cream-2)" }}>
              <span style={{ color: "var(--sh-mint)", marginTop: 2, flexShrink: 0 }}>
                <ClockIcon />
              </span>
              <div>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--sh-cream)", fontWeight: 500 }}>
                  Lunes a Sábado
                </p>
                <p style={{ margin: "0.1rem 0 0", fontSize: "0.8rem", fontWeight: 300 }}>
                  8:00 am – 6:00 pm
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", color: "var(--sh-cream-2)" }}>
              <span style={{ color: "var(--sh-mint)", marginTop: 2, flexShrink: 0 }}>
                <MapPinIcon />
              </span>
              <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 300, lineHeight: 1.6 }}>
                Santa Rosa de Cabal, Risaralda
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${WA_TIENDA}?text=Hola%2C%20me%20gustar%C3%ADa%20consultar%20sobre%20sus%20productos`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              background: "#25d366",
              color: "#fff",
              textDecoration: "none",
              padding: "0.85rem 1.5rem",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 500,
              transition: "opacity 0.2s",
            }}
          >
            <WhatsAppIcon />
            Escribir por WhatsApp
          </a>
        </div>

        {/* Hostal */}
        <div
          style={{
            background: "var(--sh-dark-2)",
            border: "1px solid rgba(228,215,184,0.08)",
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <div>
            <p style={labelStyle}>Hospedaje · Reservas</p>
            <h2
              style={{
                fontFamily: "var(--sh-serif)",
                fontSize: "1.9rem",
                fontWeight: 400,
                color: "var(--sh-cream)",
                margin: "0.5rem 0 0",
                lineHeight: 1.2,
              }}
            >
              Hostal Siete Hierbas
            </h2>
          </div>

          <hr style={dividerStyle} />

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", color: "var(--sh-cream-2)" }}>
              <span style={{ color: "var(--sh-gold)", marginTop: 2, flexShrink: 0 }}>
                <ClockIcon />
              </span>
              <div>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--sh-cream)", fontWeight: 500 }}>
                  Check-in · Check-out
                </p>
                <p style={{ margin: "0.1rem 0 0", fontSize: "0.8rem", fontWeight: 300 }}>
                  3:00 pm · 12:00 pm
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", color: "var(--sh-cream-2)" }}>
              <span style={{ color: "var(--sh-gold)", marginTop: 2, flexShrink: 0 }}>
                <MapPinIcon />
              </span>
              <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 300, lineHeight: 1.6 }}>
                Santa Rosa de Cabal, Risaralda<br />
                A minutos de los termales
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${WA_HOSTAL}?text=Hola%2C%20quisiera%20consultar%20disponibilidad%20del%20hostal`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              background: "#25d366",
              color: "#fff",
              textDecoration: "none",
              padding: "0.85rem 1.5rem",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 500,
              transition: "opacity 0.2s",
            }}
          >
            <WhatsAppIcon />
            Consultar disponibilidad
          </a>
        </div>
      </section>

      {/* ── REDES SOCIALES ──────────────────────────────── */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 2rem 6rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <hr style={dividerStyle} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
            paddingTop: "1.5rem",
          }}
        >
          <div>
            <p style={labelStyle}>Seguinos</p>
            <p
              style={{
                margin: "0.4rem 0 0",
                fontSize: "0.85rem",
                color: "var(--sh-cream-2)",
                fontWeight: 300,
              }}
            >
              Recetas, tips y novedades del hostal
            </p>
          </div>
          <a
            href="https://instagram.com/sietehierbas"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              border: "1px solid rgba(228,215,184,0.15)",
              color: "var(--sh-cream-2)",
              textDecoration: "none",
              padding: "0.65rem 1.25rem",
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              transition: "color 0.2s, border-color 0.2s",
            }}
          >
            <InstagramIcon />
            @sietehierbas
          </a>
        </div>
      </section>
    </div>
  );
}
