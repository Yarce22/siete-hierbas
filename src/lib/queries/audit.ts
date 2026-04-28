import { createClient } from "@/lib/supabase/server";

export type EntradaAudit = {
  id: string;
  usuario_nombre: string;
  accion: string;
  cambios: Record<string, unknown> | null;
  created_at: string;
};

export type TablaAudit =
  | "productos"
  | "categorias"
  | "habitaciones"
  | "pedidos"
  | "reservas"
  | "producto_variantes";

export async function getAuditLog(
  entidad: TablaAudit,
  entidadId: string,
): Promise<EntradaAudit[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("audit_log")
    .select("id, accion, cambios, created_at, profiles:usuario_id ( nombre )")
    .eq("entidad", entidad)
    .eq("entidad_id", entidadId)
    .order("created_at", { ascending: false })
    .limit(50);

  return (data ?? []).map((row) => ({
    id: row.id,
    usuario_nombre:
      (row.profiles as unknown as { nombre: string } | null)?.nombre ?? "Sistema",
    accion: row.accion,
    cambios: row.cambios as Record<string, unknown> | null,
    created_at: row.created_at,
  }));
}
