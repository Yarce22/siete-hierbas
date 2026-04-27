"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/supabase/require-admin";

type TablaEliminable = "productos" | "categorias" | "habitaciones" | "pedidos";

const TABLAS_PERMITIDAS = new Set<string>([
  "productos",
  "categorias",
  "habitaciones",
  "pedidos",
]);

// Exported for unit testing — sync, not a server action
export function isTablaPermitida(tabla: string): tabla is TablaEliminable {
  return TABLAS_PERMITIDAS.has(tabla);
}

export async function restaurarElemento(tabla: TablaEliminable, id: string) {
  if (!isTablaPermitida(tabla)) return { error: "Operación no permitida." };

  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase.from(tabla).update({ deleted_at: null }).eq("id", id);

  if (error) return { error: "No se pudo restaurar el elemento." };

  revalidatePath("/admin/papelera");
  revalidatePath(`/admin/${tabla}`);
  return { success: true };
}

export async function eliminarDefinitivamente(tabla: TablaEliminable, id: string) {
  if (!isTablaPermitida(tabla)) return { error: "Operación no permitida." };

  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase.from(tabla).delete().eq("id", id);

  if (error) return { error: "No se pudo eliminar definitivamente." };

  revalidatePath("/admin/papelera");
  return { success: true };
}
