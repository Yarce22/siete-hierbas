import { createClient } from "@/lib/supabase/server";

export type HabitacionListItem = {
  id: string;
  nombre: string;
  slug: string;
  tipo: string;
  capacidad: number;
  precio_noche: number;
  descripcion: string | null;
  amenidades: string[];
  imagen_principal: string | null;
  destacada: boolean;
};

export type HabitacionDetalle = {
  id: string;
  nombre: string;
  slug: string;
  tipo: string;
  capacidad: number;
  precio_noche: number;
  descripcion: string | null;
  amenidades: string[];
  imagenes: { url: string; alt_text: string | null; orden: number }[];
};

type RawListItem = {
  id: string;
  nombre: string;
  slug: string;
  tipo: string;
  capacidad: number;
  precio_noche: number;
  descripcion: string | null;
  amenidades: string[];
  destacada: boolean;
  habitacion_imagenes: { url: string; orden: number }[] | null;
};

function mapListItem(row: RawListItem): HabitacionListItem {
  const sorted = (row.habitacion_imagenes ?? []).sort((a, b) => a.orden - b.orden);
  return {
    id: row.id,
    nombre: row.nombre,
    slug: row.slug,
    tipo: row.tipo,
    capacidad: row.capacidad,
    precio_noche: row.precio_noche,
    descripcion: row.descripcion,
    amenidades: row.amenidades,
    imagen_principal: sorted[0]?.url ?? null,
    destacada: row.destacada,
  };
}

export async function getHabitaciones(): Promise<HabitacionListItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("habitaciones")
    .select(
      `id, nombre, slug, tipo, capacidad, precio_noche, descripcion, amenidades, destacada,
       habitacion_imagenes ( url, orden )`,
    )
    .is("deleted_at", null)
    .order("nombre");

  if (error) throw error;

  return (data ?? []).map((row) => mapListItem(row as unknown as RawListItem));
}

export async function getHabitacionDestacada(): Promise<HabitacionListItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("habitaciones")
    .select(`id, nombre, slug, tipo, capacidad, precio_noche, descripcion, amenidades, destacada,
             habitacion_imagenes ( url, orden )`)
    .eq("destacada", true)
    .is("deleted_at", null)
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return mapListItem(data as unknown as RawListItem);
}

export async function getHabitacionBySlug(
  slug: string,
): Promise<HabitacionDetalle | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("habitaciones")
    .select(
      `id, nombre, slug, tipo, capacidad, precio_noche, descripcion, amenidades,
       habitacion_imagenes ( url, alt_text, orden )`,
    )
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const d = data as unknown as {
    id: string;
    nombre: string;
    slug: string;
    tipo: string;
    capacidad: number;
    precio_noche: number;
    descripcion: string | null;
    amenidades: string[];
    habitacion_imagenes: { url: string; alt_text: string | null; orden: number }[];
  };

  return {
    id: d.id,
    nombre: d.nombre,
    slug: d.slug,
    tipo: d.tipo,
    capacidad: d.capacidad,
    precio_noche: d.precio_noche,
    descripcion: d.descripcion,
    amenidades: d.amenidades,
    imagenes: (d.habitacion_imagenes ?? []).sort((a, b) => a.orden - b.orden),
  };
}
