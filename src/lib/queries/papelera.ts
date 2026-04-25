import { createClient } from "@/lib/supabase/server";

export type TipoPapelera = "producto" | "categoria" | "habitacion" | "pedido";

export type ElementoEliminado = {
  id: string;
  nombre: string;
  tipo: TipoPapelera;
  deleted_at: string;
  extra?: string;
};

export async function getElementosEliminados(): Promise<ElementoEliminado[]> {
  const supabase = await createClient();

  const [
    { data: productos },
    { data: categorias },
    { data: habitaciones },
    { data: pedidos },
  ] = await Promise.all([
    supabase
      .from("productos")
      .select("id, nombre, deleted_at")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false }),
    supabase
      .from("categorias")
      .select("id, nombre, deleted_at")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false }),
    supabase
      .from("habitaciones")
      .select("id, nombre, deleted_at")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false }),
    supabase
      .from("pedidos")
      .select("id, numero_orden, cliente_nombre, deleted_at")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false }),
  ]);

  const items: ElementoEliminado[] = [];

  for (const p of productos ?? []) {
    items.push({
      id: p.id,
      nombre: p.nombre,
      tipo: "producto",
      deleted_at: p.deleted_at!,
    });
  }
  for (const c of categorias ?? []) {
    items.push({
      id: c.id,
      nombre: c.nombre,
      tipo: "categoria",
      deleted_at: c.deleted_at!,
    });
  }
  for (const h of habitaciones ?? []) {
    items.push({
      id: h.id,
      nombre: h.nombre,
      tipo: "habitacion",
      deleted_at: h.deleted_at!,
    });
  }
  for (const p of pedidos ?? []) {
    items.push({
      id: p.id,
      nombre: `Pedido #${p.numero_orden}`,
      tipo: "pedido",
      deleted_at: p.deleted_at!,
      extra: p.cliente_nombre,
    });
  }

  return items.sort(
    (a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime(),
  );
}
