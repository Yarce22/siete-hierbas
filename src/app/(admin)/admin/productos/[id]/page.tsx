import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ProductoForm } from "@/components/admin/producto-form";
import { VariantesAdmin } from "@/components/admin/variantes-admin";
import { ImagenesAdminProducto } from "@/components/admin/imagenes-admin-producto";

export const metadata: Metadata = { title: "Editar producto · Admin" };

export default async function EditarProducto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: producto }, { data: categorias }] = await Promise.all([
    supabase
      .from("productos")
      .select(
        `id, nombre, slug, descripcion, destacado, categoria_id,
         producto_variantes ( id, nombre, precio, stock, stock_minimo, sku ),
         producto_imagenes ( id, url, alt_text, orden )`,
      )
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle(),
    supabase
      .from("categorias")
      .select("id, nombre")
      .is("deleted_at", null)
      .order("nombre"),
  ]);

  if (!producto) notFound();

  type ProdConRelaciones = typeof producto & {
    producto_variantes: {
      id: string;
      nombre: string;
      precio: number;
      stock: number;
      stock_minimo: number;
      sku: string | null;
    }[];
    producto_imagenes: {
      id: string;
      url: string;
      alt_text: string | null;
      orden: number;
    }[];
  };

  const p = producto as ProdConRelaciones;
  const variantes = p.producto_variantes ?? [];
  const imagenes = (p.producto_imagenes ?? []).sort((a, b) => a.orden - b.orden);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 space-y-10">
      <div>
        <h1 className="mb-6 text-2xl font-semibold">Editar producto</h1>
        <ProductoForm
          categorias={categorias ?? []}
          producto={{
            id: p.id,
            nombre: p.nombre,
            slug: p.slug,
            descripcion: p.descripcion,
            destacado: p.destacado,
            categoria_id: p.categoria_id,
          }}
        />
      </div>

      <ImagenesAdminProducto productoId={id} imagenes={imagenes} />

      <VariantesAdmin productoId={id} variantes={variantes} />
    </div>
  );
}
