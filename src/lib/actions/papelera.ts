"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { isTablaPermitida, type TablaEliminable } from "@/lib/utils/papelera";

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
