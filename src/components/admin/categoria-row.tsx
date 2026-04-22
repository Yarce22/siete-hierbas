"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { eliminarCategoria } from "@/lib/actions/categorias";
import { Button } from "@/components/ui/button";

type Props = {
  categoria: {
    id: string;
    nombre: string;
    slug: string;
    icono: string | null;
    orden: number;
  };
};

export function CategoriaRow({ categoria }: Props) {
  async function handleEliminar() {
    if (!confirm(`¿Seguro que querés eliminar "${categoria.nombre}"? Esta acción se puede deshacer desde la base de datos.`)) return;
    const result = await eliminarCategoria(categoria.id);
    if (result.error) toast.error(result.error);
    else toast.success("Categoría eliminada");
  }

  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        {categoria.icono && (
          <span className="text-lg">{categoria.icono}</span>
        )}
        <div className="min-w-0">
          <p className="font-medium truncate">{categoria.nombre}</p>
          <p className="text-xs text-zinc-500">{categoria.slug} · orden {categoria.orden}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/admin/categorias/${categoria.id}`}>
            <Pencil className="size-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEliminar}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </li>
  );
}
