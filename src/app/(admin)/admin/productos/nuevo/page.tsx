import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { ProductoForm } from "@/components/admin/producto-form";

export const metadata: Metadata = { title: "Nuevo producto · Admin" };

export default async function NuevoProducto() {
  const supabase = await createClient();
  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nombre")
    .is("deleted_at", null)
    .order("nombre");

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Nuevo producto</h1>
      <ProductoForm categorias={categorias ?? []} />
    </div>
  );
}
