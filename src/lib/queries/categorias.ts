import { createClient } from "@/lib/supabase/server";

export type CategoriaListItem = {
  id: string;
  nombre: string;
  slug: string;
  icono: string | null;
  orden: number;
};

export async function getCategorias(): Promise<CategoriaListItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre, slug, icono, orden")
    .is("deleted_at", null)
    .order("orden", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
