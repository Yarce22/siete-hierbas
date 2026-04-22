import type { Metadata } from "next";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatCOP } from "@/lib/format";

export const metadata: Metadata = { title: "Reservas · Admin" };

const estadoLabel: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pendiente:   { label: "Pendiente",  variant: "outline" },
  confirmada:  { label: "Confirmada", variant: "secondary" },
  en_curso:    { label: "En curso",   variant: "default" },
  completada:  { label: "Completada", variant: "secondary" },
  cancelada:   { label: "Cancelada",  variant: "destructive" },
};

export default async function ReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("reservas")
    .select(
      `id, numero_reserva, huesped_nombre, huesped_telefono, estado,
       fecha_check_in, fecha_check_out, total,
       habitaciones:habitacion_id ( nombre )`,
    )
    .is("deleted_at", null)
    .order("fecha_check_in", { ascending: false });

  type EstadoReserva = "pendiente" | "confirmada" | "en_curso" | "completada" | "cancelada";
  if (estado) query = query.eq("estado", estado as EstadoReserva);

  const { data: reservas } = await query;

  const estados = ["pendiente", "confirmada", "en_curso", "completada", "cancelada"];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Reservas</h1>
        <p className="text-sm text-zinc-500">{reservas?.length ?? 0} reserva{reservas?.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/reservas"
          className={`rounded-full border px-3 py-1 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${!estado ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 dark:border-zinc-800"}`}
        >
          Todas
        </Link>
        {estados.map((e) => (
          <Link
            key={e}
            href={`/admin/reservas?estado=${e}`}
            className={`rounded-full border px-3 py-1 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${estado === e ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 dark:border-zinc-800"}`}
          >
            {estadoLabel[e]?.label ?? e}
          </Link>
        ))}
      </div>

      {(!reservas || reservas.length === 0) ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-zinc-500">
          <p className="font-medium">No hay reservas{estado ? ` con ese estado` : ""}.</p>
        </div>
      ) : (
        <ul className="divide-y rounded-lg border">
          {reservas.map((r) => {
            const info = estadoLabel[r.estado];
            const hab = (r as typeof r & { habitaciones: { nombre: string } | null }).habitaciones;
            const noches = Math.round(
              (new Date(r.fecha_check_out).getTime() - new Date(r.fecha_check_in).getTime()) /
                (1000 * 60 * 60 * 24),
            );
            return (
              <li key={r.id}>
                <Link
                  href={`/admin/reservas/${r.id}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">#{r.numero_reserva}</span>
                      <Badge variant={info?.variant ?? "outline"} className="text-xs">
                        {info?.label ?? r.estado}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400 truncate">
                      {r.huesped_nombre} · {hab?.nombre ?? "—"} · {noches} noche{noches !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {new Date(r.fecha_check_in).toLocaleDateString("es-CO")} →{" "}
                      {new Date(r.fecha_check_out).toLocaleDateString("es-CO")}
                    </p>
                  </div>
                  <p className="font-semibold flex-shrink-0">{formatCOP(r.total)}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
