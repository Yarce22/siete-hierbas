import Link from "next/link";
import Image from "next/image";

import { ScrollRevealInit } from "@/components/public/scroll-reveal-init";
import { AnimatedCounter } from "@/components/public/animated-counter";
import { TestimonialMarquee } from "@/components/public/testimonial-marquee";
import { getProductos } from "@/lib/queries/productos";

// ── BOTANICAL ICONS ──────────────────────────────────────────────────

function LeafIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c0 0-8-4-8-11a8 8 0 0 1 16 0c0 7-8 11-8 11z" />
      <path d="M12 22V10" />
    </svg>
  );
}

function HerbIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
      <path d="M12 22V12" />
      <path d="M12 12C12 12 7 10 6 6c3 0 6 2 6 6z" />
      <path d="M12 12C12 12 17 10 18 6c-3 0-6 2-6 6z" />
      <path d="M12 17C12 17 8 15 7 11c3 0 5 3 5 6z" />
      <path d="M12 17C12 17 16 15 17 11c-3 0-5 3-5 6z" />
    </svg>
  );
}

function FlowerIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2c0 0-2 3-2 5s2 3 2 3 2-1 2-3-2-5-2-5z" />
      <path d="M12 22c0 0-2-3-2-5s2-3 2-3 2 1 2 3-2 5-2 5z" />
      <path d="M2 12c0 0 3-2 5-2s3 2 3 2-1 2-3 2-5-2-5-2z" />
      <path d="M22 12c0 0-3-2-5-2s-3 2-3 2 1 2 3 2 5-2 5-2z" />
      <path d="M5.6 5.6c0 0 1 3.4 2.8 4.6s3.6.4 3.6.4-.4-2-2.2-3.2-4.2-1.8-4.2-1.8z" />
      <path d="M18.4 18.4c0 0-1-3.4-2.8-4.6s-3.6-.4-3.6-.4.4 2 2.2 3.2 4.2 1.8 4.2 1.8z" />
      <path d="M18.4 5.6c0 0-3.4 1-4.6 2.8s-.4 3.6-.4 3.6 2-.4 3.2-2.2 1.8-4.2 1.8-4.2z" />
      <path d="M5.6 18.4c0 0 3.4-1 4.6-2.8s.4-3.6.4-3.6-2 .4-3.2 2.2-1.8 4.2-1.8 4.2z" />
    </svg>
  );
}

function DropIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
      <path d="M12 2l7 10a7 7 0 1 1-14 0z" />
    </svg>
  );
}

function MoonIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ArrowRight({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12,5 19,12 12,19" />
    </svg>
  );
}

// ── SHARED COMPONENTS ────────────────────────────────────────────────

function BotanicalDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "1.5rem 0", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(201,146,58,0.3))" }} />
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
        <path d="M20 10 C20 10 14 4 8 6 C6 10 8 14 12 13 C15 12 16 9 20 10" stroke="#c9923a" strokeWidth="0.8" fill="none" opacity="0.6" />
        <path d="M20 10 C20 10 26 4 32 6 C34 10 32 14 28 13 C25 12 24 9 20 10" stroke="#c9923a" strokeWidth="0.8" fill="none" opacity="0.6" />
        <circle cx="20" cy="10" r="1.5" fill="#c9923a" opacity="0.5" />
      </svg>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(201,146,58,0.3))" }} />
    </div>
  );
}

function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div
      className="sh-eyebrow sh-reveal"
      style={center ? { justifyContent: "center" } : undefined}
    >
      {children}
    </div>
  );
}

function ImgPlaceholder({ label, height = 400, icon }: { label: string; height?: number; icon?: React.ReactNode }) {
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

// ── HOME PAGE ────────────────────────────────────────────────────────

export default async function Home() {
  const destacados = await getProductos({ soloDestacados: true, limit: 4 });

  return (
    <div
      style={{
        fontFamily: "var(--sh-sans)",
        color: "var(--sh-cream)",
        fontWeight: 300,
      }}
    >
      <ScrollRevealInit />

      <style>{`
        @keyframes sh-word-reveal {
          from { transform: translateY(110%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes sh-fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sh-mesh-pulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 0.8; }
        }
        @keyframes sh-float-leaf {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50%       { transform: translateY(-18px) rotate(5deg); }
        }
        @keyframes sh-line-grow {
          from { height: 0; }
          to   { height: 40px; }
        }
        .sh-hero-word-inner {
          display: inline-block;
          animation: sh-word-reveal 1.1s cubic-bezier(0.16,1,0.3,1) both;
        }
        .sh-product-card:hover .sh-card-img { transform: scale(1.07); }
        .sh-product-card:hover .sh-card-overlay { opacity: 1; }
        .sh-exp-card:hover {
          border-color: rgba(201,146,58,0.3) !important;
          background: rgba(201,146,58,0.04) !important;
          transform: translateY(-6px);
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        style={{
          height: "calc(100vh - 5rem)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Mesh gradient */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(ellipse 80% 60% at 30% 60%, rgba(58,90,60,0.45) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 75% 25%, rgba(184,118,44,0.2) 0%, transparent 50%),
              radial-gradient(ellipse 50% 70% at 60% 80%, rgba(22,27,14,0.9) 0%, transparent 60%),
              #0d1008
            `,
            animation: "sh-mesh-pulse 8s ease-in-out infinite",
          }}
        />

        {/* Floating botanical SVGs */}
        <svg
          aria-hidden="true"
          className="sh-hero-deco-svg"
          style={{
            position: "absolute",
            top: "8%",
            right: "6%",
            opacity: 0.12,
            animation: "sh-float-leaf 7s ease-in-out infinite",
          }}
          width="180"
          height="240"
          viewBox="0 0 180 240"
          fill="none"
        >
          <path d="M90 220 C90 220 30 160 30 100 C30 60 55 20 90 10 C125 20 150 60 150 100 C150 160 90 220 90 220Z" stroke="#6aaa88" strokeWidth="1" fill="rgba(106,170,136,0.06)" />
          <path d="M90 220 L90 30" stroke="#6aaa88" strokeWidth="0.8" opacity="0.5" />
          <path d="M90 80 C90 80 60 70 50 50" stroke="#6aaa88" strokeWidth="0.6" opacity="0.4" />
          <path d="M90 80 C90 80 120 70 130 50" stroke="#6aaa88" strokeWidth="0.6" opacity="0.4" />
          <path d="M90 120 C90 120 58 108 45 85" stroke="#6aaa88" strokeWidth="0.6" opacity="0.4" />
          <path d="M90 120 C90 120 122 108 135 85" stroke="#6aaa88" strokeWidth="0.6" opacity="0.4" />
          <path d="M90 160 C90 160 65 148 55 125" stroke="#6aaa88" strokeWidth="0.6" opacity="0.3" />
          <path d="M90 160 C90 160 115 148 125 125" stroke="#6aaa88" strokeWidth="0.6" opacity="0.3" />
        </svg>

        <svg
          aria-hidden="true"
          className="sh-hero-deco-svg"
          style={{
            position: "absolute",
            bottom: "10%",
            left: "4%",
            opacity: 0.1,
            animation: "sh-float-leaf 9s ease-in-out infinite 2s",
          }}
          width="120"
          height="160"
          viewBox="0 0 120 160"
          fill="none"
        >
          <path d="M60 150 C60 150 10 100 15 50 C20 20 40 5 60 5 C80 5 100 20 105 50 C110 100 60 150 60 150Z" stroke="#c9923a" strokeWidth="1" fill="rgba(201,146,58,0.05)" />
          <path d="M60 150 L60 20" stroke="#c9923a" strokeWidth="0.7" opacity="0.4" />
        </svg>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 900, padding: "0 2rem" }}>
          <div
            style={{
              fontFamily: "var(--sh-sans)",
              fontSize: "0.62rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "var(--sh-gold)",
              marginBottom: "2rem",
              animation: "sh-fade-up 1s ease both",
              animationDelay: "0.1s",
            }}
          >
            Santa Rosa de Cabal · Colombia · Desde 2012
          </div>

          <h1
            style={{
              fontFamily: "var(--sh-serif)",
              fontSize: "clamp(3.2rem, 8vw, 7rem)",
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: "var(--sh-cream)",
              marginBottom: "1.5rem",
            }}
          >
            <HeroText text="Donde la tierra" delay={0.3} />
            <br />
            <span style={{ fontStyle: "italic", color: "var(--sh-gold)" }}>
              <HeroText text="habla y sana." delay={0.9} />
            </span>
          </h1>

          <p
            style={{
              fontFamily: "var(--sh-sans)",
              fontSize: "1rem",
              color: "var(--sh-cream-2)",
              fontWeight: 300,
              maxWidth: "50ch",
              margin: "0 auto 3rem",
              lineHeight: 1.8,
              animation: "sh-fade-up 1s ease both",
              animationDelay: "0.9s",
            }}
          >
            Herboristería boutique y hostal de bienestar en el corazón del Eje
            Cafetero. Plantas, remedios y descanso auténtico.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              animation: "sh-fade-up 1s ease both",
              animationDelay: "1.1s",
            }}
          >
            <Link href="/tienda" style={btnPrimaryStyle}>
              Explorar tienda <ArrowRight size={14} />
            </Link>
            <Link href="/hostal" style={btnOutlineStyle}>
              Reservar estadía
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          aria-hidden="true"
          className="sh-hero-scroll-hint"
          style={{
            position: "absolute",
            bottom: "3rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.6rem",
            animation: "sh-fade-up 1s ease both",
            animationDelay: "1.4s",
          }}
        >
          <span style={{ fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--sh-cream-3)" }}>
            Scroll
          </span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, var(--sh-gold), transparent)", animation: "sh-line-grow 2s ease-in-out infinite" }} />
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
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
          {[
            { end: 7, suffix: "", label: "Hierbas fundacionales" },
            { end: 12, suffix: "+", label: "Años de historia" },
            { end: 1, suffix: "", label: "Lugar único en Colombia" },
          ].map((s, i) => (
            <div
              key={i}
              className="sh-reveal sh-stat-item"
              data-delay={String(i * 150)}
              style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
            >
              <div
                style={{
                  fontFamily: "var(--sh-serif)",
                  fontSize: "clamp(3.5rem, 7vw, 5.5rem)",
                  fontWeight: 300,
                  color: "var(--sh-cream)",
                  lineHeight: 1,
                }}
              >
                <AnimatedCounter end={s.end} suffix={s.suffix} />
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--sh-gold)",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NUESTRA HISTORIA ──────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(4rem,10vw,8rem) clamp(1.5rem,5vw,4rem)",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          className="sh-two-col"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }}
        >
          <div className="sh-reveal-left">
            <Eyebrow>Nuestra historia</Eyebrow>
            <h2
              className="sh-reveal"
              data-delay="100"
              style={{
                fontFamily: "var(--sh-serif)",
                fontSize: "clamp(2rem,4vw,3.2rem)",
                fontWeight: 300,
                lineHeight: 1.2,
                marginBottom: "2rem",
                color: "var(--sh-cream)",
              }}
            >
              Doce años cultivando
              <br />
              <em style={{ color: "var(--sh-gold)" }}>sabiduría vegetal</em>
            </h2>
            <p style={{ color: "var(--sh-cream-2)", lineHeight: 1.9, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              Siete Hierbas nació de una pregunta simple: ¿qué sabe el bosque
              que nosotros hemos olvidado? En 2012, en las faldas de los Andes
              colombianos, empezamos a cultivar, recolectar y transformar
              plantas medicinales con el respeto que merecen.
            </p>
            <p style={{ color: "var(--sh-cream-2)", lineHeight: 1.9, marginBottom: "2.5rem", fontSize: "0.9rem" }}>
              Hoy somos herboristería, hostal y escuela de bienestar. Un espacio
              donde el conocimiento ancestral se encuentra con la sensibilidad
              contemporánea.
            </p>
            <Link href="/contacto" style={btnOutlineStyle}>
              Escríbenos <ArrowRight size={14} />
            </Link>
          </div>

          <div className="sh-reveal-right" style={{ position: "relative" }}>
            <ImgPlaceholder
              label="Jardín de hierbas / fotografía editorial"
              height={500}
              icon={<LeafIcon size={32} color="var(--sh-cream-3)" />}
            />
            <div
              className="sh-history-badge"
              style={{
                background: "var(--sh-dark-3)",
                border: "1px solid rgba(228,215,184,0.07)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                padding: "1.5rem",
                textAlign: "center",
              }}
            >
              <LeafIcon size={24} color="var(--sh-gold)" />
              <span
                style={{
                  fontFamily: "var(--sh-serif)",
                  fontSize: "0.95rem",
                  fontStyle: "italic",
                  color: "var(--sh-cream)",
                }}
              >
                Cultivo propio, cosecha ética
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTANICAL DIVIDER ─────────────────────────────────── */}
      <div style={{ padding: "0 clamp(1.5rem,5vw,4rem)" }}>
        <BotanicalDivider />
      </div>

      {/* ── PRODUCTOS DESTACADOS ──────────────────────────────── */}
      <section
        style={{
          padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)",
          background: "var(--sh-dark-2)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "3.5rem",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div>
              <Eyebrow>Tienda</Eyebrow>
              <h2
                className="sh-reveal"
                data-delay="100"
                style={{
                  fontFamily: "var(--sh-serif)",
                  fontSize: "clamp(2rem,4vw,3rem)",
                  fontWeight: 300,
                  color: "var(--sh-cream)",
                }}
              >
                Productos destacados
              </h2>
            </div>
            <Link href="/tienda" style={btnOutlineStyle} className="sh-reveal">
              Ver todo <ArrowRight size={14} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
              gap: "2rem",
            }}
          >
            {destacados.length > 0
              ? destacados.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/tienda/${p.slug}`}
                    className="sh-reveal sh-product-card"
                    data-delay={String(i * 100)}
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <ProductCard
                      name={p.nombre}
                      category={p.categoria?.nombre ?? ""}
                      price={p.precio_desde ?? 0}
                      imageUrl={p.imagen_principal}
                    />
                  </Link>
                ))
              : FALLBACK_PRODUCTS.map((p, i) => (
                  <Link
                    key={i}
                    href="/tienda"
                    className="sh-reveal sh-product-card"
                    data-delay={String(i * 100)}
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <ProductCard
                      name={p.name}
                      category={p.category}
                      price={p.price}
                      imageUrl={null}
                      icon={p.icon}
                    />
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ── EL HOSTAL ─────────────────────────────────────────── */}
      <section
        style={{ padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)" }}
      >
        <div
          className="sh-two-col"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }}
        >
          <div className="sh-reveal-left sh-hostal-img-wrapper">
            <ImgPlaceholder
              label="Habitación hostal / jardín de bienestar"
              height={550}
              icon={<MoonIcon size={32} color="var(--sh-cream-3)" />}
            />
            <div
              className="sh-hostal-price-badge"
              style={{
                position: "absolute",
                top: "2rem",
                right: "-2rem",
                background: "rgba(13,16,8,0.9)",
                border: "1px solid rgba(201,146,58,0.3)",
                padding: "1.2rem 1.5rem",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ fontFamily: "var(--sh-serif)", fontSize: "1.5rem", color: "var(--sh-cream)" }}>
                Desde
              </div>
              <div style={{ fontFamily: "var(--sh-serif)", fontSize: "2.2rem", fontStyle: "italic", color: "var(--sh-gold)" }}>
                $150.000
              </div>
              <div style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--sh-cream-3)" }}>
                por noche / persona
              </div>
            </div>
          </div>

          <div className="sh-reveal-right">
            <Eyebrow>El Hostal</Eyebrow>
            <h2
              style={{
                fontFamily: "var(--sh-serif)",
                fontSize: "clamp(2rem,4vw,3.2rem)",
                fontWeight: 300,
                lineHeight: 1.2,
                marginBottom: "2rem",
                color: "var(--sh-cream)",
              }}
            >
              Descanso entre
              <br />
              <em style={{ color: "var(--sh-mint)" }}>hierba y montaña</em>
            </h2>
            <p
              style={{
                color: "var(--sh-cream-2)",
                lineHeight: 1.9,
                marginBottom: "2.5rem",
                fontSize: "0.9rem",
              }}
            >
              Nuestro hostal boutique es una extensión del jardín. Habitaciones
              diseñadas para el silencio, con vista a la naturaleza andina,
              aromaterapia y acceso a termas. Un retiro genuino a minutos del
              centro de Santa Rosa de Cabal.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.9rem",
                marginBottom: "2.5rem",
              }}
            >
              {[
                "Desayuno herbal incluido",
                "Acceso a termas cercanas",
                "Aromaterapia y bienestar",
                "Wifi y zonas de descanso",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    fontSize: "0.85rem",
                    color: "var(--sh-cream-2)",
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      background: "var(--sh-mint)",
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}
                  />
                  {item}
                </div>
              ))}
            </div>
            <Link href="/hostal" style={btnPrimaryStyle}>
              Reservar ahora <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BOTANICAL DIVIDER ─────────────────────────────────── */}
      <div style={{ padding: "0 clamp(1.5rem,5vw,4rem)" }}>
        <BotanicalDivider />
      </div>

      {/* ── ¿POR QUÉ ELEGIRNOS? ───────────────────────────────── */}
      <section
        style={{
          padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)",
          background: "var(--sh-dark-2)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <Eyebrow center>¿Por qué elegirnos?</Eyebrow>
            <h2
              className="sh-reveal"
              data-delay="100"
              style={{
                fontFamily: "var(--sh-serif)",
                fontSize: "clamp(2rem,4vw,3rem)",
                fontWeight: 300,
                color: "var(--sh-cream)",
              }}
            >
              Una experiencia que{" "}
              <em style={{ color: "var(--sh-gold)" }}>trasciende</em>
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
              gap: "1.5rem",
            }}
          >
            {EXPERIENCE_CARDS.map((card, i) => (
              <ExperienceCard key={i} {...card} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ───────────────────────────────────────── */}
      <section style={{ padding: "clamp(4rem,8vw,7rem) 0" }}>
        <div
          style={{ textAlign: "center", marginBottom: "3rem", padding: "0 2rem" }}
        >
          <Eyebrow center>Testimonios</Eyebrow>
          <h2
            className="sh-reveal"
            data-delay="100"
            style={{
              fontFamily: "var(--sh-serif)",
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 300,
              color: "var(--sh-cream)",
            }}
          >
            Lo que dicen nuestros{" "}
            <em style={{ color: "var(--sh-gold)" }}>huéspedes</em>
          </h2>
        </div>
        <TestimonialMarquee />
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,4rem)",
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(58,90,60,0.35) 0%, transparent 70%), var(--sh-dark-2)`,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            opacity: 0.04,
          }}
          width="600"
          height="600"
          viewBox="0 0 600 600"
          fill="none"
        >
          <circle cx="300" cy="300" r="280" stroke="#6aaa88" strokeWidth="1" />
          <circle cx="300" cy="300" r="220" stroke="#6aaa88" strokeWidth="0.5" />
          <circle cx="300" cy="300" r="160" stroke="#c9923a" strokeWidth="0.5" />
        </svg>
        <div style={{ position: "relative", zIndex: 1 }}>
          <Eyebrow center>Visítanos</Eyebrow>
          <h2
            className="sh-reveal"
            data-delay="100"
            style={{
              fontFamily: "var(--sh-serif)",
              fontSize: "clamp(2.2rem,5vw,4rem)",
              fontWeight: 300,
              color: "var(--sh-cream)",
              marginBottom: "1.2rem",
            }}
          >
            Te esperamos en
            <br />
            <em style={{ color: "var(--sh-gold)" }}>Santa Rosa de Cabal</em>
          </h2>
          <p
            className="sh-reveal"
            data-delay="200"
            style={{
              color: "var(--sh-cream-2)",
              fontSize: "0.9rem",
              maxWidth: "45ch",
              margin: "0 auto 3rem",
              lineHeight: 1.8,
            }}
          >
            A 45 minutos de Pereira, en el pueblo de las aguas termales y el
            café. Un destino que cura.
          </p>
          <div
            className="sh-reveal"
            data-delay="300"
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/hostal" style={btnPrimaryStyle}>
              Reservar estadía <ArrowRight size={14} />
            </Link>
            <Link href="/contacto" style={btnOutlineStyle}>
              Cómo llegar
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

// ── SUBCOMPONENTS ────────────────────────────────────────────────────

function HeroText({ text, delay }: { text: string; delay: number }) {
  const words = text.split(" ");
  return (
    <span>
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            marginRight: "0.28em",
          }}
        >
          <span
            className="sh-hero-word-inner"
            style={{
              animationDelay: `${delay + i * 0.12}s`,
            }}
          >
            {w}
          </span>
        </span>
      ))}
    </span>
  );
}

function ProductCard({
  name,
  category,
  price,
  imageUrl,
  icon,
}: {
  name: string;
  category: string;
  price: number;
  imageUrl: string | null;
  icon?: React.ReactNode;
}) {
  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div
        className="sh-card-img"
        style={{
          height: 280,
          background: "var(--sh-dark-3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <>
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(228,215,184,0.012) 20px, rgba(228,215,184,0.012) 21px)",
              }}
            />
            {icon ?? <FlowerIcon size={48} color="var(--sh-moss-l)" />}
          </>
        )}
      </div>
      <div
        className="sh-card-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(13,16,8,0.65)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <span
          style={{
            fontFamily: "var(--sh-sans)",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--sh-cream)",
            border: "1px solid rgba(228,215,184,0.5)",
            padding: "0.6rem 1.4rem",
          }}
        >
          Ver producto
        </span>
      </div>
      <div style={{ padding: "1.2rem 0.5rem 0" }}>
        <div
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--sh-mint)",
            marginBottom: "0.4rem",
          }}
        >
          {category}
        </div>
        <div
          style={{
            fontFamily: "var(--sh-serif)",
            fontSize: "1.1rem",
            color: "var(--sh-cream)",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: "0.82rem",
            color: "var(--sh-gold)",
            marginTop: "0.3rem",
          }}
        >
          {formatted}
        </div>
      </div>
    </div>
  );
}

function ExperienceCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <div
      className="sh-reveal sh-exp-card"
      data-delay={String(delay)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
        padding: "2.5rem 2rem",
        border: "1px solid rgba(228,215,184,0.07)",
        background: "rgba(255,255,255,0.02)",
        transition:
          "border-color 0.4s, background 0.4s, transform 0.4s",
        cursor: "default",
      }}
    >
      <div style={{ color: "var(--sh-gold)", opacity: 0.8 }}>{icon}</div>
      <h3
        style={{
          fontFamily: "var(--sh-serif)",
          fontSize: "1.3rem",
          color: "var(--sh-cream)",
          fontWeight: 400,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "0.83rem",
          color: "var(--sh-cream-2)",
          lineHeight: 1.75,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

// ── STATIC DATA ──────────────────────────────────────────────────────

const FALLBACK_PRODUCTS = [
  { name: "Té de 7 Hierbas", category: "Tés", price: 18000, icon: <FlowerIcon size={48} color="var(--sh-moss-l)" /> },
  { name: "Tintura de Valeriana", category: "Tinturas", price: 35000, icon: <DropIcon size={48} color="var(--sh-moss-l)" /> },
  { name: "Aceite de Caléndula", category: "Aceites", price: 42000, icon: <MoonIcon size={48} color="var(--sh-moss-l)" /> },
  { name: "Menta Piperita Seca", category: "Plantas", price: 12000, icon: <HerbIcon size={48} color="var(--sh-moss-l)" /> },
];

const EXPERIENCE_CARDS = [
  {
    icon: <LeafIcon size={28} />,
    title: "Cultivo propio y ético",
    desc: "Nuestras plantas se cultivan o recolectan con prácticas agroecológicas, sin pesticidas ni aditivos.",
  },
  {
    icon: <FlowerIcon size={28} />,
    title: "Conocimiento ancestral",
    desc: "Trabajamos con sabedores locales y tradiciones medicinales del Eje Cafetero colombiano.",
  },
  {
    icon: <DropIcon size={28} />,
    title: "Elaboración artesanal",
    desc: "Cada tintura, aceite y preparado se elabora en pequeños lotes para garantizar frescura y potencia.",
  },
  {
    icon: <MoonIcon size={28} />,
    title: "Bienestar integral",
    desc: "El hostal ofrece programas de retiro y descanso, no solo una cama: una experiencia completa.",
  },
];

// ── STYLE CONSTANTS ──────────────────────────────────────────────────

const btnPrimaryStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6rem",
  background: "var(--sh-gold)",
  color: "var(--sh-dark)",
  fontFamily: "var(--sh-sans)",
  fontSize: "0.72rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  fontWeight: 500,
  padding: "0.9rem 2rem",
  border: "none",
  textDecoration: "none",
};

const btnOutlineStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6rem",
  background: "transparent",
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
