import Link from "next/link";

import type { CategoriaListItem } from "@/lib/queries/categorias";
import { cn } from "@/lib/utils";

type Props = {
  categorias: CategoriaListItem[];
  activaSlug?: string;
};

export function CategoriaFiltro({ categorias, activaSlug }: Props) {
  const base =
    "rounded-full border px-3 py-1 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800";
  const activa =
    "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200";
  const inactiva = "border-zinc-200 dark:border-zinc-800";

  return (
    <nav className="flex flex-wrap gap-2" aria-label="Filtrar por categoría">
      <Link
        href="/tienda"
        className={cn(base, !activaSlug ? activa : inactiva)}
      >
        Todos
      </Link>
      {categorias.map((c) => (
        <Link
          key={c.id}
          href={`/tienda?categoria=${c.slug}`}
          className={cn(base, activaSlug === c.slug ? activa : inactiva)}
        >
          {c.nombre}
        </Link>
      ))}
    </nav>
  );
}
