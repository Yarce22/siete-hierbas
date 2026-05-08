"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/public/cart-provider";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/hostal", label: "Hospedaje" },
  { href: "/contacto", label: "Contacto" },
];

function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scrolled ? "1rem 4rem" : "1.5rem 4rem",
    background: scrolled ? "rgba(13,16,8,0.88)" : "transparent",
    backdropFilter: scrolled ? "blur(14px)" : "none",
    borderBottom: scrolled ? "1px solid rgba(228,215,184,0.07)" : "none",
    transition:
      "background 0.5s ease, padding 0.3s ease, backdrop-filter 0.5s ease",
  };

  return (
    <>
      <header style={navStyle}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--sh-serif)",
            fontSize: "1.4rem",
            fontWeight: 500,
            letterSpacing: "0.04em",
            color: "var(--sh-cream)",
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            lineHeight: 1.1,
          }}
        >
          Siete Hierbas
          <span
            className="hidden sm:block"
            style={{
              fontSize: "0.55rem",
              fontFamily: "var(--sh-sans)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--sh-gold)",
              fontWeight: 400,
            }}
          >
            Herbolaria · Hospedaje · Santa Rosa de Cabal
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Navegación principal"
          style={{ gap: "2.5rem", listStyle: "none" }}
          className="hidden md:flex"
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: pathname === l.href ? "var(--sh-cream)" : "var(--sh-cream-2)",
                textDecoration: "none",
                position: "relative",
                paddingBottom: 3,
              }}
              className="sh-nav-link"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          <Link
            href="/checkout"
            aria-label={`Carrito (${totalItems} ítems)`}
            style={{
              background: "none",
              border: "none",
              color: "var(--sh-cream)",
              cursor: "pointer",
              position: "relative",
              padding: "0.4rem",
              display: "flex",
            }}
          >
            <CartIcon />
            {totalItems > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "var(--sh-gold)",
                  color: "var(--sh-dark)",
                  borderRadius: "50%",
                  width: 16,
                  height: 16,
                  fontSize: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            href="/hostal"
            className="hidden md:inline-flex"
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              border: "1px solid rgba(201,146,58,0.5)",
              color: "var(--sh-gold)",
              padding: "0.55rem 1.4rem",
              textDecoration: "none",
              transition: "background 0.3s, color 0.3s, border-color 0.3s",
            }}
          >
            Reservar
          </Link>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--sh-cream)",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <span style={{ display: "block", width: 24, height: 1, background: "currentColor" }} />
            <span style={{ display: "block", width: 24, height: 1, background: "currentColor" }} />
            <span style={{ display: "block", width: 24, height: 1, background: "currentColor" }} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(13,16,8,0.97)",
            zIndex: 950,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2.5rem",
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--sh-cream)",
            }}
          >
            <XIcon />
          </button>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--sh-serif)",
                fontSize: "2.5rem",
                color: "var(--sh-cream)",
                textDecoration: "none",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          header { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
        }
        .sh-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: var(--sh-gold);
          transition: width 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .sh-nav-link:hover::after,
        .sh-nav-link[aria-current="page"]::after { width: 100%; }
        .sh-nav-link:hover { color: var(--sh-cream) !important; }
      `}</style>
    </>
  );
}
