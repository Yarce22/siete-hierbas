"use client";

import Link from "next/link";
import { Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

import { eliminarProducto } from "@/lib/actions/productos";
import { formatCOP } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  producto: {
    id: string;
    nombre: string;
    slug: string;
    destacado: boolean;
    categorias: { nombre: string } | null;
    producto_variantes: { precio: number; stock: number }[] | null;
  };
};

export function ProductoAdminRow({ producto }: Props) {
  const variantes = producto.producto_variantes ?? [];
  const precios = variantes.map((v) => v.precio);
  const stockTotal = variantes.reduce((s, v) => s + v.stock, 0);
  const precioMin = precios.length ? Math.min(...precios) : null;

  async function handleEliminar() {
    if (!confirm(`¿Seguro que querés eliminar "${producto.nombre}"?`)) return;
    const result = await eliminarProducto(producto.id);
    if (result.error) toast.error(result.error);
    else toast.success("Producto eliminado");
  }

  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{producto.nombre}</p>
          {producto.destacado && (
            <Star className="size-3.5 flex-shrink-0 fill-amber-400 text-amber-400" />
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
          {producto.categorias && <span>{producto.categorias.nombre}</span>}
          {precioMin !== null && (
            <span>desde {formatCOP(precioMin)}</span>
          )}
          <span>{stockTotal} en stock</span>
          {variantes.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {variantes.length} variante{variantes.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/admin/productos/${producto.id}`}>
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
