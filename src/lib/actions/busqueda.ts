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

  // Admin-only: unauthenticated requests get nothing
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const q = query.trim();
  const numerico = parseInt(q, 10);
  const esNumerico = !isNaN(numerico) && numerico > 0;

  // Use individual parameterized calls instead of .or() string interpolation
  // to avoid PostgREST filter injection via user-controlled input.
  const [
    { data: productos },
    { data: pedidosTexto },
    { data: pedidosNum },
    { data: reservasTexto },
    { data: reservasNum },
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
      .ilike("cliente_nombre", `%${q}%`)
      .is("deleted_at", null)
      .limit(4),
    esNumerico
      ? supabase
          .from("pedidos")
          .select("id, numero_orden, cliente_nombre")
          .eq("numero_orden", numerico)
          .is("deleted_at", null)
          .limit(1)
      : Promise.resolve({
          data: [] as Array<{ id: string; numero_orden: number; cliente_nombre: string }>,
        }),
    supabase
      .from("reservas")
      .select("id, numero_reserva, huesped_nombre")
      .ilike("huesped_nombre", `%${q}%`)
      .is("deleted_at", null)
      .limit(4),
    esNumerico
      ? supabase
          .from("reservas")
          .select("id, numero_reserva, huesped_nombre")
          .eq("numero_reserva", numerico)
          .is("deleted_at", null)
          .limit(1)
      : Promise.resolve({
          data: [] as Array<{ id: string; numero_reserva: number; huesped_nombre: string }>,
        }),
    supabase
      .from("habitaciones")
      .select("id, nombre")
      .ilike("nombre", `%${q}%`)
      .is("deleted_at", null)
      .limit(4),
  ]);

  const resultados: ResultadoBusqueda[] = [];
  const seen = new Set<string>();

  const add = (item: ResultadoBusqueda) => {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      resultados.push(item);
    }
  };

  for (const p of productos ?? []) {
    add({ id: p.id, titulo: p.nombre, tipo: "producto", href: `/admin/productos/${p.id}` });
  }

  for (const p of [...(pedidosTexto ?? []), ...(pedidosNum ?? [])]) {
    add({
      id: p.id,
      titulo: `Pedido #${p.numero_orden}`,
      subtitulo: p.cliente_nombre,
      tipo: "pedido",
      href: `/admin/pedidos/${p.id}`,
    });
  }

  for (const r of [...(reservasTexto ?? []), ...(reservasNum ?? [])]) {
    add({
      id: r.id,
      titulo: `Reserva #${r.numero_reserva}`,
      subtitulo: r.huesped_nombre,
      tipo: "reserva",
      href: `/admin/reservas/${r.id}`,
    });
  }

  for (const h of habitaciones ?? []) {
    add({ id: h.id, titulo: h.nombre, tipo: "habitacion", href: `/admin/habitaciones/${h.id}` });
  }

  return resultados;
}
