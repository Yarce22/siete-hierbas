import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartLine } from "@/components/public/cart-provider";
import { formatCOP } from "@/lib/format";

type Props = {
  line: CartLine;
  onRemove: (varianteId: string) => void;
  onSetCantidad: (varianteId: string, cantidad: number) => void;
};

export function CartLineItem({ line, onRemove, onSetCantidad }: Props) {
  return (
    <li className="flex items-start gap-4 rounded-xl border p-4">
      <div className="relative size-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
        {line.imagen ? (
          <Image src={line.imagen} alt={line.productoNombre} fill className="object-cover" sizes="64px" />
        ) : (
          <div className="size-full" />
        )}
      </div>

      <div className="flex flex-1 min-w-0 flex-col gap-1">
        <Link href={`/tienda/${line.productoSlug}`} className="truncate font-medium leading-tight hover:underline">
          {line.productoNombre}
        </Link>
        <span className="text-sm text-zinc-500">{line.varianteNombre}</span>
        <span className="font-semibold">{formatCOP(line.precio * line.cantidad)}</span>
      </div>

      <div className="flex flex-shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label="Disminuir cantidad"
          onClick={() => onSetCantidad(line.varianteId, line.cantidad - 1)}
          className="flex size-7 items-center justify-center rounded-md border hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Minus className="size-3" />
        </button>
        <span className="w-6 text-center text-sm">{line.cantidad}</span>
        <button
          type="button"
          aria-label="Aumentar cantidad"
          onClick={() => onSetCantidad(line.varianteId, line.cantidad + 1)}
          className="flex size-7 items-center justify-center rounded-md border hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Plus className="size-3" />
        </button>
        <button
          type="button"
          aria-label="Eliminar"
          onClick={() => onRemove(line.varianteId)}
          className="ml-1 flex size-7 items-center justify-center rounded-md text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </li>
  );
}
