import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { CategoriaRow } from "@/components/admin/categoria-row";

export const metadata: Metadata = { title: "Categorías · Admin" };

export default async function CategoriasPage() {
  const supabase = await createClient();
  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nombre, slug, icono, orden")
    .is("deleted_at", null)
    .order("orden", { ascending: true });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categorías</h1>
          <p className="text-sm text-zinc-500">
            Agrupan los productos del catálogo.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categorias/nueva">
            <Plus className="mr-2 size-4" />
            Nueva categoría
          </Link>
        </Button>
      </div>

      {(!categorias || categorias.length === 0) ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-zinc-500">
          <p className="font-medium">No hay categorías todavía.</p>
          <p className="mt-1 text-sm">Creá la primera para organizar tus productos.</p>
        </div>
      ) : (
        <ul className="divide-y rounded-lg border">
          {categorias.map((c) => (
            <CategoriaRow key={c.id} categoria={c} />
          ))}
        </ul>
      )}
    </div>
  );
}
