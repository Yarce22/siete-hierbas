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

export type ProductoDetalle = {
  id: string;
  nombre: string;
  slug: string;
  descripcion_corta: string | null;
  descripcion: string | null;
  destacado: boolean;
  categoria: { id: string; nombre: string; slug: string } | null;
  imagenes: { url: string; alt: string | null; orden: number }[];
  variantes: {
    id: string;
    nombre: string;
    precio: number;
    stock: number;
    activo: boolean;
    orden: number;
  }[];
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

function mapProductoListItem(row: ProductoRowRaw): ProductoListItem {
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
      `id, nombre, slug, descripcion_corta, destacado,
       categorias:categoria_id ( nombre, slug ),
       producto_imagenes ( url, orden ),
       producto_variantes ( precio, activo )`,
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

  return (data ?? []).map((row) =>
    mapProductoListItem(row as unknown as ProductoRowRaw),
  );
}

export async function getProductoBySlug(
  slug: string,
): Promise<ProductoDetalle | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("productos")
    .select(
      `id, nombre, slug, descripcion_corta, descripcion, destacado,
       categorias:categoria_id ( id, nombre, slug ),
       producto_imagenes ( url, alt, orden ),
       producto_variantes ( id, nombre, precio, stock, activo, orden )`,
    )
    .eq("slug", slug)
    .eq("activo", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const d = data as unknown as {
    id: string;
    nombre: string;
    slug: string;
    descripcion_corta: string | null;
    descripcion: string | null;
    destacado: boolean;
    categorias: { id: string; nombre: string; slug: string } | null;
    producto_imagenes: { url: string; alt: string | null; orden: number }[];
    producto_variantes: {
      id: string;
      nombre: string;
      precio: number;
      stock: number;
      activo: boolean;
      orden: number;
    }[];
  };

  return {
    id: d.id,
    nombre: d.nombre,
    slug: d.slug,
    descripcion_corta: d.descripcion_corta,
    descripcion: d.descripcion,
    destacado: d.destacado,
    categoria: d.categorias,
    imagenes: (d.producto_imagenes ?? []).sort((a, b) => a.orden - b.orden),
    variantes: (d.producto_variantes ?? [])
      .filter((v) => v.activo)
      .sort((a, b) => a.orden - b.orden),
  };
}
