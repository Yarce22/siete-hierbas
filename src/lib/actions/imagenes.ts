"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { subirImagen, eliminarImagen } from "@/lib/actions/storage";

export async function agregarImagenProducto(productoId: string, formData: FormData) {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const file = formData.get("imagen") as File | null;
  if (!file || file.size === 0) return { error: "No se seleccionó ninguna imagen." };

  const result = await subirImagen("productos", productoId, file);
  if ("error" in result) return result;

  const { data: lastImg } = await supabase
    .from("producto_imagenes")
    .select("orden")
    .eq("producto_id", productoId)
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();

  const orden = (lastImg?.orden ?? -1) + 1;

  const { error } = await supabase.from("producto_imagenes").insert({
    producto_id: productoId,
    url: result.url,
    alt_text: (formData.get("alt_text") as string) || null,
    orden,
  });

  if (error) return { error: "Imagen subida pero error al guardar en DB." };

  revalidatePath(`/admin/productos/${productoId}`);
  revalidatePath("/tienda");
  return { success: true };
}

export async function eliminarImagenProducto(
  imagenId: string,
  url: string,
  productoId: string,
) {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  await eliminarImagen("productos", url);

  const { error } = await supabase
    .from("producto_imagenes")
    .delete()
    .eq("id", imagenId);

  if (error) return { error: "Error al eliminar la imagen." };

  revalidatePath(`/admin/productos/${productoId}`);
  revalidatePath("/tienda");
  return { success: true };
}

export async function agregarImagenHabitacion(
  habitacionId: string,
  formData: FormData,
) {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const file = formData.get("imagen") as File | null;
  if (!file || file.size === 0) return { error: "No se seleccionó ninguna imagen." };

  const result = await subirImagen("habitaciones", habitacionId, file);
  if ("error" in result) return result;

  const { data: lastImg } = await supabase
    .from("habitacion_imagenes")
    .select("orden")
    .eq("habitacion_id", habitacionId)
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();

  const orden = (lastImg?.orden ?? -1) + 1;

  const { error } = await supabase.from("habitacion_imagenes").insert({
    habitacion_id: habitacionId,
    url: result.url,
    alt_text: (formData.get("alt_text") as string) || null,
    orden,
  });

  if (error) return { error: "Imagen subida pero error al guardar en DB." };

  revalidatePath(`/admin/habitaciones/${habitacionId}`);
  return { success: true };
}

export async function eliminarImagenHabitacion(
  imagenId: string,
  url: string,
  habitacionId: string,
) {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  await eliminarImagen("habitaciones", url);

  const { error } = await supabase
    .from("habitacion_imagenes")
    .delete()
    .eq("id", imagenId);

  if (error) return { error: "Error al eliminar la imagen." };

  revalidatePath(`/admin/habitaciones/${habitacionId}`);
  return { success: true };
}
