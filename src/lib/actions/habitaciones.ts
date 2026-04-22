"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  tipo: z.string().min(1, "El tipo es requerido"),
  capacidad: z.coerce.number().int().min(1),
  precio_noche: z.coerce.number().int().min(0),
  descripcion: z.string().optional(),
  amenidades: z.string().optional(),
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseAmenidades(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function crearHabitacion(formData: FormData) {
  const raw = {
    nombre: formData.get("nombre"),
    slug: formData.get("slug") || slugify(formData.get("nombre") as string),
    tipo: formData.get("tipo"),
    capacidad: formData.get("capacidad"),
    precio_noche: formData.get("precio_noche"),
    descripcion: formData.get("descripcion") || undefined,
    amenidades: formData.get("amenidades") || undefined,
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("habitaciones")
    .insert({
      nombre: parsed.data.nombre,
      slug: parsed.data.slug,
      tipo: parsed.data.tipo,
      capacidad: parsed.data.capacidad,
      precio_noche: parsed.data.precio_noche,
      descripcion: parsed.data.descripcion ?? null,
      amenidades: parseAmenidades(parsed.data.amenidades),
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { error: "Ya existe una habitación con ese slug." };
    return { error: "Error al guardar." };
  }

  revalidatePath("/admin/habitaciones");
  return { success: true, id: data.id };
}

export async function actualizarHabitacion(id: string, formData: FormData) {
  const raw = {
    nombre: formData.get("nombre"),
    slug: formData.get("slug"),
    tipo: formData.get("tipo"),
    capacidad: formData.get("capacidad"),
    precio_noche: formData.get("precio_noche"),
    descripcion: formData.get("descripcion") || undefined,
    amenidades: formData.get("amenidades") || undefined,
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("habitaciones")
    .update({
      nombre: parsed.data.nombre,
      slug: parsed.data.slug,
      tipo: parsed.data.tipo,
      capacidad: parsed.data.capacidad,
      precio_noche: parsed.data.precio_noche,
      descripcion: parsed.data.descripcion ?? null,
      amenidades: parseAmenidades(parsed.data.amenidades),
    })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    if (error.code === "23505") return { error: "Ya existe una habitación con ese slug." };
    return { error: "Error al guardar." };
  }

  revalidatePath("/admin/habitaciones");
  return { success: true };
}

export async function eliminarHabitacion(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("habitaciones")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: "No se pudo eliminar." };

  revalidatePath("/admin/habitaciones");
  return { success: true };
}
