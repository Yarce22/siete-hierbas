"use server";

import { createClient } from "@/lib/supabase/server";

export type ResultadoBusqueda = {
  id: string;
  titulo: string;
  subtitulo?: string;
  href: string;
  tipo: "producto" | "pedido" | "reserva" | "habitacion";
};

export async function buscarGlobal(query: string): Promise<ResultadoBusqueda[]> {
  if (!query || query.trim().length < 2) return [];

  const supabase = await createClient();
  const q = query.trim();
  const numerico = parseInt(q) || 0;

  const [
    { data: productos },
    { data: pedidos },
    { data: reservas },
    { data: habitaciones },
  ] = await Promise.all([
    supabase
      .from("productos")
      .select("id, nombre")
      .ilike("nombre", `%${q}%`)
      .is("deleted_at", null)
      .limit(4),
    supabase
      .from("pedidos")
      .select("id, numero_orden, cliente_nombre")
      .or(
        `cliente_nombre.ilike.%${q}%${numerico ? `,numero_orden.eq.${numerico}` : ""}`,
      )
      .is("deleted_at", null)
      .limit(4),
    supabase
      .from("reservas")
      .select("id, numero_reserva, huesped_nombre")
      .or(
        `huesped_nombre.ilike.%${q}%${numerico ? `,numero_reserva.eq.${numerico}` : ""}`,
      )
      .is("deleted_at", null)
      .limit(4),
    supabase
      .from("habitaciones")
      .select("id, nombre")
      .ilike("nombre", `%${q}%`)
      .is("deleted_at", null)
      .limit(4),
  ]);

  const resultados: ResultadoBusqueda[] = [];

  for (const p of productos ?? []) {
    resultados.push({
      id: p.id,
      titulo: p.nombre,
      tipo: "producto",
      href: `/admin/productos/${p.id}`,
    });
  }
  for (const p of pedidos ?? []) {
    resultados.push({
      id: p.id,
      titulo: `Pedido #${p.numero_orden}`,
      subtitulo: p.cliente_nombre,
      tipo: "pedido",
      href: `/admin/pedidos/${p.id}`,
    });
  }
  for (const r of reservas ?? []) {
    resultados.push({
      id: r.id,
      titulo: `Reserva #${r.numero_reserva}`,
      subtitulo: r.huesped_nombre,
      tipo: "reserva",
      href: `/admin/reservas/${r.id}`,
    });
  }
  for (const h of habitaciones ?? []) {
    resultados.push({
      id: h.id,
      titulo: h.nombre,
      tipo: "habitacion",
      href: `/admin/habitaciones/${h.id}`,
    });
  }

  return resultados;
}
