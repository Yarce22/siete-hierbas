"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type TablaEliminable = "productos" | "categorias" | "habitaciones" | "pedidos";

export async function restaurarElemento(tabla: TablaEliminable, id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from(tabla)
    .update({ deleted_at: null })
    .eq("id", id);

  if (error) return { error: "No se pudo restaurar el elemento." };

  revalidatePath("/admin/papelera");
  revalidatePath(`/admin/${tabla}`);
  return { success: true };
}

export async function eliminarDefinitivamente(
  tabla: TablaEliminable,
  id: string,
) {
  const supabase = await createClient();

  const { error } = await supabase.from(tabla).delete().eq("id", id);

  if (error) return { error: "No se pudo eliminar definitivamente." };

  revalidatePath("/admin/papelera");
  return { success: true };
}
