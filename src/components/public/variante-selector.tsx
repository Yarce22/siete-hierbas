"use client";

import type { ProductoDetalle } from "@/lib/queries/productos";
import { formatCOP } from "@/lib/format";
import { cn } from "@/lib/utils";

type Variante = ProductoDetalle["variantes"][number];

type Props = {
  variantes: Variante[];
  seleccionada: string | null;
  onChange: (id: string) => void;
};

export function VarianteSelector({ variantes, seleccionada, onChange }: Props) {
  if (variantes.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Presentación</span>
      <div className="flex flex-wrap gap-2">
        {variantes.map((v) => {
          const sinStock = v.stock === 0;
          return (
            <button
              key={v.id}
              type="button"
              disabled={sinStock}
              onClick={() => onChange(v.id)}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm transition-colors",
                seleccionada === v.id
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600",
                sinStock && "cursor-not-allowed opacity-40 line-through",
              )}
            >
              <span>{v.nombre}</span>
              <span className="ml-2 font-semibold">{formatCOP(v.precio)}</span>
              {sinStock && (
                <span className="ml-1 text-xs text-zinc-400">sin stock</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
