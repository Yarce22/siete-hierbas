import { createClient } from "@/lib/supabase/server";

export type Periodo = "semana" | "mes" | "anio";

function periodoAInicio(periodo: Periodo): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (periodo === "semana") d.setDate(d.getDate() - 7);
  else if (periodo === "mes") d.setDate(d.getDate() - 30);
  else d.setDate(d.getDate() - 365);
  return d;
}

function bucketKey(isoDate: string, periodo: Periodo): string {
  const d = new Date(isoDate);
  if (periodo === "anio") {
    return d.toLocaleDateString("es-CO", { month: "short", year: "2-digit" });
  }
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

function generarBuckets(
  periodo: Periodo,
): Map<string, { ingresos_tienda: number; ingresos_hostal: number }> {
  const map = new Map<string, { ingresos_tienda: number; ingresos_hostal: number }>();
  const now = new Date();

  if (periodo === "anio") {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString("es-CO", { month: "short", year: "2-digit" });
      map.set(key, { ingresos_tienda: 0, ingresos_hostal: 0 });
    }
  } else {
    const days = periodo === "semana" ? 7 : 30;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
      map.set(key, { ingresos_tienda: 0, ingresos_hostal: 0 });
    }
  }

  return map;
}

export type PuntoIngresos = {
  fecha: string;
  ingresos_tienda: number;
  ingresos_hostal: number;
};

export async function getIngresosPorPeriodo(
  periodo: Periodo,
): Promise<PuntoIngresos[]> {
  const supabase = await createClient();
  const desde = periodoAInicio(periodo).toISOString();

  const [{ data: pedidos }, { data: reservas }] = await Promise.all([
    supabase
      .from("pedidos")
      .select("created_at, total")
      .gte("created_at", desde)
      .neq("estado", "cancelado")
      .is("deleted_at", null),
    supabase
      .from("reservas")
      .select("created_at, total")
      .gte("created_at", desde)
      .neq("estado", "cancelada")
      .is("deleted_at", null),
  ]);

  const buckets = generarBuckets(periodo);

  for (const p of pedidos ?? []) {
    const key = bucketKey(p.created_at, periodo);
    const b = buckets.get(key);
    if (b) b.ingresos_tienda += p.total;
  }

  for (const r of reservas ?? []) {
    const key = bucketKey(r.created_at, periodo);
    const b = buckets.get(key);
    if (b) b.ingresos_hostal += r.total;
  }

  return Array.from(buckets.entries()).map(([fecha, v]) => ({ fecha, ...v }));
}

export type TopProducto = {
  nombre: string;
  unidades: number;
  ingresos: number;
};

export async function getTopProductos(periodo: Periodo): Promise<TopProducto[]> {
  const supabase = await createClient();
  const desde = periodoAInicio(periodo).toISOString();

  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("id")
    .gte("created_at", desde)
    .neq("estado", "cancelado")
    .is("deleted_at", null);

  if (!pedidos || pedidos.length === 0) return [];

  const ids = pedidos.map((p) => p.id);

  const { data: items } = await supabase
    .from("pedido_items")
    .select("cantidad, subtotal, productos:producto_id ( nombre )")
    .in("pedido_id", ids);

  if (!items) return [];

  const acc = new Map<string, { unidades: number; ingresos: number }>();
  for (const item of items) {
    const nombre =
      (item.productos as { nombre: string } | null)?.nombre ?? "Desconocido";
    const prev = acc.get(nombre) ?? { unidades: 0, ingresos: 0 };
    acc.set(nombre, {
      unidades: prev.unidades + item.cantidad,
      ingresos: prev.ingresos + item.subtotal,
    });
  }

  return Array.from(acc.entries())
    .map(([nombre, v]) => ({ nombre, ...v }))
    .sort((a, b) => b.unidades - a.unidades)
    .slice(0, 8);
}

export type PedidoResumen = {
  id: string;
  numero_orden: number;
  cliente_nombre: string;
  estado: string;
  total: number;
  created_at: string;
};

export async function getHistorialPedidos(): Promise<PedidoResumen[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("pedidos")
    .select("id, numero_orden, cliente_nombre, estado, total, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(200);

  return (data ?? []) as PedidoResumen[];
}

export type MetricasHostal = {
  total_reservas: number;
  ingresos: number;
  proximas: {
    id: string;
    numero_reserva: number;
    huesped_nombre: string;
    habitacion_nombre: string;
    fecha_check_in: string;
    fecha_check_out: string;
  }[];
};

export async function getMetricasHostal(
  periodo: Periodo,
): Promise<MetricasHostal> {
  const supabase = await createClient();
  const desde = periodoAInicio(periodo).toISOString();
  const hoy = new Date().toISOString().split("T")[0];

  const [{ data: reservas }, { data: proximas }] = await Promise.all([
    supabase
      .from("reservas")
      .select("total")
      .gte("created_at", desde)
      .neq("estado", "cancelada")
      .is("deleted_at", null),
    supabase
      .from("reservas")
      .select(
        `id, numero_reserva, huesped_nombre, fecha_check_in, fecha_check_out,
         habitaciones:habitacion_id ( nombre )`,
      )
      .gte("fecha_check_in", hoy)
      .in("estado", ["confirmada", "en_curso"])
      .is("deleted_at", null)
      .order("fecha_check_in")
      .limit(5),
  ]);

  return {
    total_reservas: reservas?.length ?? 0,
    ingresos: (reservas ?? []).reduce((s, r) => s + r.total, 0),
    proximas: (proximas ?? []).map((r) => ({
      id: r.id,
      numero_reserva: r.numero_reserva,
      huesped_nombre: r.huesped_nombre,
      habitacion_nombre:
        (r.habitaciones as { nombre: string } | null)?.nombre ?? "—",
      fecha_check_in: r.fecha_check_in,
      fecha_check_out: r.fecha_check_out,
    })),
  };
}

export type AlertaStock = {
  producto_id: string;
  producto_nombre: string;
  variante_nombre: string;
  stock: number;
  stock_minimo: number;
};

export async function getAlertasStockBajo(): Promise<AlertaStock[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("producto_variantes")
    .select("stock, stock_minimo, nombre, producto_id, productos:producto_id ( nombre )")
    .is("deleted_at", null);

  return (data ?? [])
    .filter((v) => v.stock <= v.stock_minimo)
    .map((v) => ({
      producto_id: v.producto_id,
      producto_nombre: (v.productos as { nombre: string } | null)?.nombre ?? "—",
      variante_nombre: v.nombre,
      stock: v.stock,
      stock_minimo: v.stock_minimo,
    }));
}
