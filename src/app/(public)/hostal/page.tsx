import type { Metadata } from "next";
import Link from "next/link";

import { HabitacionCard } from "@/components/public/habitacion-card";
import { getHabitaciones } from "@/lib/queries/habitaciones";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hostal",
  description:
    "Habitaciones cómodas a pasos de los termales de Santa Rosa de Cabal. Reservá por WhatsApp.",
};

type SearchParams = { tipo?: string | string[] };

function capitalizar(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const pillBase =
  "rounded-full border px-3 py-1 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800";
const pillActivo =
  "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200";
const pillInactivo = "border-zinc-200 dark:border-zinc-800";

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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Hostal</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Hospedaje tranquilo y acogedor en el corazón de Santa Rosa de Cabal, a
          minutos de los termales.
        </p>
      </header>

      {tipos.length > 1 && (
        <nav className="flex flex-wrap gap-2" aria-label="Filtrar por tipo">
          <Link
            href="/hostal"
            className={cn(pillBase, !tipoActivo ? pillActivo : pillInactivo)}
          >
            Todas
          </Link>
          {tipos.map((t) => (
            <Link
              key={t}
              href={`/hostal?tipo=${t}`}
              className={cn(pillBase, tipoActivo === t ? pillActivo : pillInactivo)}
            >
              {capitalizar(t)}
            </Link>
          ))}
        </nav>
      )}

      {habitaciones.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-zinc-500">
          <p className="font-medium">No hay habitaciones disponibles por acá.</p>
          <p className="mt-1 text-sm">
            Probá con otro filtro o volvé pronto.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {habitaciones.map((h) => (
            <li key={h.id}>
              <HabitacionCard habitacion={h} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
