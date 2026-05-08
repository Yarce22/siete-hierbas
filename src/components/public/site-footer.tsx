import Link from "next/link";

import { getCategorias } from "@/lib/queries/categorias";

export async function SiteFooter() {
  const [categorias] = await Promise.all([getCategorias()]);
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--sh-dark-2)",
        borderTop: "1px solid rgba(228,215,184,0.07)",
        padding: "5rem 4rem 2.5rem",
        position: "relative",
        fontFamily: "var(--sh-sans)",
      }}
    >
      {/* Subtle pattern overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(135deg, transparent, transparent 30px, rgba(228,215,184,0.012) 30px, rgba(228,215,184,0.012) 31px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Grid */}
        <div
          className="sh-footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "4rem",
            marginBottom: "4rem",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "var(--sh-serif)",
                fontSize: "1.8rem",
                fontWeight: 400,
                color: "var(--sh-cream)",
                marginBottom: "0.8rem",
              }}
            >
              Siete Hierbas
            </div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--sh-cream-3)",
                lineHeight: 1.7,
                maxWidth: "24ch",
              }}
            >
              Herbolaria boutique y hospedaje de descanso en el corazón cafetero
              de Colombia.
            </p>
            <p
              style={{
                marginTop: "1.2rem",
                fontFamily: "var(--sh-serif)",
                fontStyle: "italic",
                fontSize: "1.1rem",
                color: "var(--sh-gold)",
              }}
            >
              &ldquo;Donde la naturaleza cura.&rdquo;
            </p>
          </div>

          {/* Navegación */}
          <FooterCol title="Navegación">
            <FooterLink href="/">Inicio</FooterLink>
            <FooterLink href="/tienda">Tienda</FooterLink>
            <FooterLink href="/hostal">Hospedaje</FooterLink>
            <FooterLink href="/contacto">Contacto</FooterLink>
          </FooterCol>

          {/* Productos */}
          <FooterCol title="Productos">
            {categorias.map((cat) => (
              <FooterLink key={cat.id} href={`/tienda?categoria=${cat.slug}`}>
                {cat.nombre}
              </FooterLink>
            ))}
            {categorias.length === 0 && (
              <FooterLink href="/tienda">Ver todos</FooterLink>
            )}
          </FooterCol>

          {/* Contacto */}
          <FooterCol title="Visítanos">
            <span
              style={{
                color: "var(--sh-cream-3)",
                fontSize: "0.82rem",
                lineHeight: 1.5,
              }}
            >
              Calle 7 #8-42, Santa Rosa de Cabal, Risaralda
            </span>
            <FooterLink href="tel:+573001234567">+57 300 123 4567</FooterLink>
            <FooterLink href="mailto:hola@sietehierbas.co">
              hola@sietehierbas.co
            </FooterLink>
            <span style={{ color: "var(--sh-cream-3)", fontSize: "0.82rem" }}>
              Lun–Dom · 8am–7pm
            </span>
          </FooterCol>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(228,215,184,0.06)",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "0.68rem", color: "var(--sh-cream-3)", letterSpacing: "0.05em" }}>
            © {year} Siete Hierbas · Santa Rosa de Cabal, Colombia
          </p>
          <div style={{ display: "flex", gap: "1.2rem" }}>
            {["Instagram", "Facebook", "WhatsApp", "TikTok"].map((s) => (
              <a
                key={s}
                href="#"
                style={{
                  color: "var(--sh-cream-3)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sh-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2.5rem !important; padding: 0 !important; }
        }
        @media (max-width: 600px) {
          .sh-footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4
        style={{
          fontFamily: "var(--sh-sans)",
          fontSize: "0.62rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--sh-gold)",
          marginBottom: "1.5rem",
          fontWeight: 400,
        }}
      >
        {title}
      </h4>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          padding: 0,
          margin: 0,
        }}
      >
        {children}
      </ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        style={{
          color: "var(--sh-cream-3)",
          textDecoration: "none",
          fontSize: "0.82rem",
          transition: "color 0.3s",
        }}
      >
        {children}
      </Link>
    </li>
  );
}
