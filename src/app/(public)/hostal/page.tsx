import type { Metadata } from "next";
import Link from "next/link";

import { HabitacionCard } from "@/components/public/habitacion-card";
import { getHabitaciones } from "@/lib/queries/habitaciones";

export const metadata: Metadata = {
  title: "Hostal",
  description:
    "Habitaciones cómodas a pasos de los termales de Santa Rosa de Cabal. Reservá por WhatsApp.",
};

type SearchParams = { tipo?: string | string[] };

function capitalizar(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default async function HostalPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tipo } = await searchParams;
  const tipoActivo = Array.isArray(tipo) ? tipo[0] : tipo;

  const todasLasHabitaciones = await getHabitaciones();

  const tipos = [...new Set(todasLasHabitaciones.map((h) => h.tipo))].sort();

  const habitaciones = tipoActivo
    ? todasLasHabitaciones.filter((h) => h.tipo === tipoActivo)
    : todasLasHabitaciones;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(4rem,8vw,6rem) clamp(1.5rem,5vw,4rem)" }}>
      <header style={{ marginBottom: "3rem" }}>
        <div style={{
          fontSize: "0.62rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--sh-gold)",
          marginBottom: "0.8rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}>
          <span style={{ display: "block", width: "2rem", height: 1, background: "var(--sh-gold)" }} />
          El Hostal
        </div>
        <h1 style={{
          fontFamily: "var(--sh-serif)",
          fontSize: "clamp(2rem,4vw,3rem)",
          fontWeight: 300,
          color: "var(--sh-cream)",
          marginBottom: "0.5rem",
        }}>
          Habitaciones
        </h1>
        <p style={{ color: "var(--sh-cream-3)", fontSize: "0.9rem" }}>
          Hospedaje tranquilo y acogedor en el corazón de Santa Rosa de Cabal, a minutos de los termales.
        </p>
      </header>

      {tipos.length > 1 && (
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "3rem" }} aria-label="Filtrar por tipo">
          <Link
            href="/hostal"
            style={{
              padding: "0.25rem 0.75rem",
              fontSize: "0.85rem",
              border: !tipoActivo ? "1px solid var(--sh-gold)" : "1px solid rgba(228,215,184,0.2)",
              color: !tipoActivo ? "var(--sh-gold)" : "var(--sh-cream-2)",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            Todas
          </Link>
          {tipos.map((t) => (
            <Link
              key={t}
              href={`/hostal?tipo=${t}`}
              style={{
                padding: "0.25rem 0.75rem",
                fontSize: "0.85rem",
                border: tipoActivo === t ? "1px solid var(--sh-gold)" : "1px solid rgba(228,215,184,0.2)",
                color: tipoActivo === t ? "var(--sh-gold)" : "var(--sh-cream-2)",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              {capitalizar(t)}
            </Link>
          ))}
        </nav>
      )}

      {habitaciones.length === 0 ? (
        <div style={{
          border: "1px dashed rgba(228,215,184,0.15)",
          padding: "4rem 2rem",
          textAlign: "center",
          color: "var(--sh-cream-3)",
        }}>
          <p style={{ fontFamily: "var(--sh-serif)", fontSize: "1.1rem", color: "var(--sh-cream-2)" }}>
            No hay habitaciones disponibles por acá.
          </p>
          <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
            Probá con otro filtro o volvé pronto.
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "2rem",
        }}>
          {habitaciones.map((h) => (
            <HabitacionCard key={h.id} habitacion={h} />
          ))}
        </div>
      )}
    </div>
  );
}
