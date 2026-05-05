import Link from "next/link";
import Image from "next/image";

import type { ProductoListItem } from "@/lib/queries/productos";
import { formatCOP } from "@/lib/format";

export function ProductoCard({ producto }: { producto: ProductoListItem }) {
  return (
    <Link
      href={`/tienda/${producto.slug}`}
      className="sh-product-card"
      style={{ textDecoration: "none", display: "block" }}
    >
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
          {producto.imagen_principal ? (
            <Image
              src={producto.imagen_principal}
              alt={producto.nombre}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div style={{
              position: "absolute",
              inset: 0,
              background: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(228,215,184,0.012) 20px, rgba(228,215,184,0.012) 21px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--sh-moss-l)" strokeWidth="1.2">
                <circle cx="12" cy="12" r="2.5" />
                <path d="M12 2c0 0-2 3-2 5s2 3 2 3 2-1 2-3-2-5-2-5z" />
                <path d="M12 22c0 0-2-3-2-5s2-3 2-3 2 1 2 3-2 5-2 5z" />
                <path d="M2 12c0 0 3-2 5-2s3 2 3 2-1 2-3 2-5-2-5-2z" />
                <path d="M22 12c0 0-3-2-5-2s-3 2-3 2 1 2 3 2 5-2 5-2z" />
              </svg>
            </div>
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
          <span style={{
            fontFamily: "var(--sh-sans)",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            color: "var(--sh-cream)",
            border: "1px solid rgba(228,215,184,0.5)",
            padding: "0.6rem 1.4rem",
          }}>
            Ver producto
          </span>
        </div>
        <div style={{ padding: "1.2rem 0.5rem 0" }}>
          {producto.categoria && (
            <div style={{
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "var(--sh-mint)",
              marginBottom: "0.4rem",
            }}>
              {producto.categoria.nombre}
            </div>
          )}
          <div style={{
            fontFamily: "var(--sh-serif)",
            fontSize: "1.1rem",
            color: "var(--sh-cream)",
          }}>
            {producto.nombre}
          </div>
          {producto.precio_desde !== null && (
            <div style={{
              fontSize: "0.82rem",
              color: "var(--sh-gold)",
              marginTop: "0.3rem",
            }}>
              Desde {formatCOP(producto.precio_desde)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
