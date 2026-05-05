import Link from "next/link";
import Image from "next/image";
import { Users } from "lucide-react";

import type { HabitacionListItem } from "@/lib/queries/habitaciones";
import { formatCOP } from "@/lib/format";

export function HabitacionCard({ habitacion }: { habitacion: HabitacionListItem }) {
  return (
    <Link
      href={`/hostal/${habitacion.slug}`}
      className="sh-product-card"
      style={{ textDecoration: "none", display: "block" }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div
          className="sh-card-img"
          style={{
            height: 240,
            background: "var(--sh-dark-3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {habitacion.imagen_principal ? (
            <Image
              src={habitacion.imagen_principal}
              alt={habitacion.nombre}
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
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
          )}
          <div style={{
            position: "absolute",
            top: "0.8rem",
            left: "0.8rem",
            background: "rgba(13,16,8,0.75)",
            border: "1px solid rgba(228,215,184,0.2)",
            padding: "0.2rem 0.6rem",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            color: "var(--sh-cream-2)",
            backdropFilter: "blur(8px)",
          }}>
            {habitacion.tipo}
          </div>
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
            Ver habitación
          </span>
        </div>
        <div style={{ padding: "1.2rem 0.5rem 0" }}>
          <div style={{
            fontFamily: "var(--sh-serif)",
            fontSize: "1.1rem",
            color: "var(--sh-cream)",
            marginBottom: "0.5rem",
          }}>
            {habitacion.nombre}
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.78rem",
            color: "var(--sh-cream-3)",
            marginBottom: "0.5rem",
          }}>
            <Users size={12} />
            <span>Hasta {habitacion.capacidad} {habitacion.capacidad === 1 ? "persona" : "personas"}</span>
          </div>
          {habitacion.amenidades.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.3rem", marginBottom: "0.6rem" }}>
              {habitacion.amenidades.slice(0, 3).map((a) => (
                <span key={a} style={{
                  background: "rgba(228,215,184,0.07)",
                  border: "1px solid rgba(228,215,184,0.12)",
                  padding: "0.15rem 0.5rem",
                  fontSize: "0.6rem",
                  color: "var(--sh-cream-3)",
                }}>
                  {a}
                </span>
              ))}
              {habitacion.amenidades.length > 3 && (
                <span style={{
                  background: "rgba(228,215,184,0.07)",
                  border: "1px solid rgba(228,215,184,0.12)",
                  padding: "0.15rem 0.5rem",
                  fontSize: "0.6rem",
                  color: "var(--sh-cream-3)",
                }}>
                  +{habitacion.amenidades.length - 3}
                </span>
              )}
            </div>
          )}
          <div style={{ fontSize: "0.82rem", color: "var(--sh-gold)" }}>
            {formatCOP(habitacion.precio_noche)}
            <span style={{ color: "var(--sh-cream-3)", fontSize: "0.72rem", marginLeft: "0.3rem" }}>/ noche</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
