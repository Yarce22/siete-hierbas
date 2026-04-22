import { createClient } from "@/lib/supabase/server";

export type ProductoListItem = {
  id: string;
  nombre: string;
  slug: string;
  descripcion_corta: string | null;
  destacado: boolean;
  categoria: { nombre: string; slug: string } | null;
  imagen_principal: string | null;
  precio_desde: number | null;
};

type ProductoRowRaw = {
  id: string;
  nombre: string;
  slug: string;
  descripcion_corta: string | null;
  destacado: boolean;
  categorias: { nombre: string; slug: string } | null;
  producto_imagenes: { url: string }[] | null;
  producto_variantes: { precio: number }[] | null;
};

function mapProducto(row: ProductoRowRaw): ProductoListItem {
  const precios = (row.producto_variantes ?? [])
    .map((v) => v.precio)
    .filter((p): p is number => typeof p === "number");

  return {
    id: row.id,
    nombre: row.nombre,
    slug: row.slug,
    descripcion_corta: row.descripcion_corta,
    destacado: row.destacado,
    categoria: row.categorias,
    imagen_principal: row.producto_imagenes?.[0]?.url ?? null,
    precio_desde: precios.length ? Math.min(...precios) : null,
  };
}

export type GetProductosOptions = {
  categoriaSlug?: string;
  soloDestacados?: boolean;
  limit?: number;
};

export async function getProductos(
  options: GetProductosOptions = {},
): Promise<ProductoListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("productos")
    .select(
      `
        id,
        nombre,
        slug,
        descripcion_corta,
        destacado,
        categorias:categoria_id ( nombre, slug ),
        producto_imagenes ( url, orden ),
        producto_variantes ( precio, activo )
      `,
    )
    .eq("activo", true)
    .is("deleted_at", null)
    .order("destacado", { ascending: false })
    .order("nombre", { ascending: true });

  if (options.soloDestacados) query = query.eq("destacado", true);
  if (options.limit) query = query.limit(options.limit);

  if (options.categoriaSlug) {
    const { data: cat, error: catError } = await supabase
      .from("categorias")
      .select("id")
      .eq("slug", options.categoriaSlug)
      .maybeSingle();

    if (catError) throw catError;
    if (!cat) return [];
    query = query.eq("categoria_id", cat.id);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => mapProducto(row as unknown as ProductoRowRaw));
}
