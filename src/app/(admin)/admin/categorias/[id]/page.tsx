import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { CategoriaForm } from "@/components/admin/categoria-form";

export const metadata: Metadata = { title: "Editar categoría · Admin" };

export default async function EditarCategoria({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("categorias")
    .select("id, nombre, slug, icono, orden")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Editar categoría</h1>
      <CategoriaForm categoria={data} />
    </div>
  );
}
