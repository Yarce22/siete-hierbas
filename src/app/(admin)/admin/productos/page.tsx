import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ProductoAdminRow } from "@/components/admin/producto-admin-row";

export const metadata: Metadata = { title: "Productos · Admin" };

export default async function ProductosPage() {
  const supabase = await createClient();

  const { data: productos } = await supabase
    .from("productos")
    .select(
      `id, nombre, slug, destacado,
       categorias:categoria_id ( nombre ),
       producto_variantes ( precio, stock )`,
    )
    .is("deleted_at", null)
    .order("nombre", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Productos</h1>
          <p className="text-sm text-zinc-500">
            {productos?.length ?? 0} producto{productos?.length !== 1 ? "s" : ""} activos
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="mr-2 size-4" />
            Nuevo producto
          </Link>
        </Button>
      </div>

      {(!productos || productos.length === 0) ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-zinc-500">
          <p className="font-medium">Todavía no hay productos.</p>
          <p className="mt-1 text-sm">Creá el primero para que aparezca en la tienda.</p>
        </div>
      ) : (
        <ul className="divide-y rounded-lg border">
          {productos.map((p) => (
            <ProductoAdminRow
              key={p.id}
              producto={p as Parameters<typeof ProductoAdminRow>[0]["producto"]}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
