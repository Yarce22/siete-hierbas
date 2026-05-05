"use server";

import { revalidatePath } from "next/cache";

import { categoriaSchema as schema } from "@/lib/validators/categorias";
import { requireAdmin } from "@/lib/supabase/require-admin";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function crearCategoria(formData: FormData) {
  const raw = {
    nombre: formData.get("nombre"),
    slug: formData.get("slug") || slugify(formData.get("nombre") as string),
    icono: formData.get("icono") || undefined,
    orden: formData.get("orden") || 0,
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase.from("categorias").insert(parsed.data);

  if (error) {
    if (error.code === "23505") return { error: "Ya existe una categoría con ese slug." };
    return { error: "Error al guardar. Intentá de nuevo." };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/tienda");
  return { success: true };
}

export async function actualizarCategoria(id: string, formData: FormData) {
  const raw = {
    nombre: formData.get("nombre"),
    slug: formData.get("slug"),
    icono: formData.get("icono") || undefined,
    orden: formData.get("orden") || 0,
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase
    .from("categorias")
    .update(parsed.data)
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    if (error.code === "23505") return { error: "Ya existe una categoría con ese slug." };
    return { error: "Error al guardar. Intentá de nuevo." };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/tienda");
  return { success: true };
}

export async function eliminarCategoria(id: string) {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase
    .from("categorias")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: "No se pudo eliminar." };

  revalidatePath("/admin/categorias");
  revalidatePath("/tienda");
  return { success: true };
}
