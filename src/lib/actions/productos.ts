"use server";

import { revalidatePath } from "next/cache";

import { productoSchema, varianteSchema } from "@/lib/validators/productos";
import { requireAdmin } from "@/lib/supabase/require-admin";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function crearProducto(formData: FormData) {
  const rawProducto = {
    nombre: formData.get("nombre"),
    slug: formData.get("slug") || slugify(formData.get("nombre") as string),
    descripcion: formData.get("descripcion") || undefined,
    categoria_id: formData.get("categoria_id") || "",
    destacado: formData.get("destacado") === "on",
  };

  const parsedProducto = productoSchema.safeParse(rawProducto);
  if (!parsedProducto.success)
    return { error: parsedProducto.error.issues[0].message };

  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const dataProducto = {
    ...parsedProducto.data,
    categoria_id: parsedProducto.data.categoria_id || null,
  };

  const { data: producto, error: errorProducto } = await supabase
    .from("productos")
    .insert(dataProducto)
    .select("id")
    .single();

  if (errorProducto) {
    if (errorProducto.code === "23505")
      return { error: "Ya existe un producto con ese slug." };
    return { error: "Error al guardar. Intentá de nuevo." };
  }

  const variantesRaw = parseVariantesFromForm(formData);
  if (variantesRaw.length > 0) {
    const variantesData = variantesRaw.map((v) => ({
      ...v,
      producto_id: producto.id,
      sku: v.sku || null,
    }));

    const { error: errorVariantes } = await supabase
      .from("producto_variantes")
      .insert(variantesData);

    if (errorVariantes) return { error: "Producto creado pero error en variantes." };
  }

  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
  return { success: true, id: producto.id };
}

export async function actualizarProducto(id: string, formData: FormData) {
  const rawProducto = {
    nombre: formData.get("nombre"),
    slug: formData.get("slug"),
    descripcion: formData.get("descripcion") || undefined,
    categoria_id: formData.get("categoria_id") || "",
    destacado: formData.get("destacado") === "on",
  };

  const parsedProducto = productoSchema.safeParse(rawProducto);
  if (!parsedProducto.success)
    return { error: parsedProducto.error.issues[0].message };

  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const dataProducto = {
    ...parsedProducto.data,
    categoria_id: parsedProducto.data.categoria_id || null,
  };

  const { error } = await supabase
    .from("productos")
    .update(dataProducto)
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    if (error.code === "23505")
      return { error: "Ya existe un producto con ese slug." };
    return { error: "Error al guardar. Intentá de nuevo." };
  }

  revalidatePath("/admin/productos");
  revalidatePath(`/tienda/${parsedProducto.data.slug}`);
  revalidatePath("/tienda");
  return { success: true };
}

export async function eliminarProducto(id: string) {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase
    .from("productos")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: "No se pudo eliminar." };

  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
  return { success: true };
}

export async function crearVariante(productoId: string, formData: FormData) {
  const raw = {
    nombre: formData.get("nombre"),
    precio: formData.get("precio"),
    stock: formData.get("stock") ?? 0,
    stock_minimo: formData.get("stock_minimo") ?? 5,
    sku: formData.get("sku") || undefined,
  };

  const parsed = varianteSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase.from("producto_variantes").insert({
    ...parsed.data,
    producto_id: productoId,
    sku: parsed.data.sku || null,
  });

  if (error) return { error: "Error al guardar la variante." };

  revalidatePath(`/admin/productos/${productoId}`);
  return { success: true };
}

export async function eliminarVariante(varianteId: string, productoId: string) {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase
    .from("producto_variantes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", varianteId);

  if (error) return { error: "No se pudo eliminar la variante." };

  revalidatePath(`/admin/productos/${productoId}`);
  return { success: true };
}

function parseVariantesFromForm(formData: FormData) {
  const variantes: ReturnType<typeof varianteSchema.parse>[] = [];
  let i = 0;

  while (formData.has(`variantes[${i}][nombre]`)) {
    const raw = {
      nombre: formData.get(`variantes[${i}][nombre]`),
      precio: formData.get(`variantes[${i}][precio]`),
      stock: formData.get(`variantes[${i}][stock]`) ?? 0,
      stock_minimo: formData.get(`variantes[${i}][stock_minimo]`) ?? 5,
      sku: formData.get(`variantes[${i}][sku]`) || undefined,
    };

    const parsed = varianteSchema.safeParse(raw);
    if (parsed.success) variantes.push(parsed.data);
    i++;
  }

  return variantes;
}
