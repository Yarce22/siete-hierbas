import Link from "next/link";
import type { CategoriaListItem } from "@/lib/queries/categorias";
import { cn } from "@/lib/utils";

type Props = {
  categorias: CategoriaListItem[];
  activaSlug?: string;
};

export function CategoriaFiltro({ categorias, activaSlug }: Props) {
  const base = "px-3 py-1 text-sm transition-colors";
  const activa = "border border-[var(--sh-gold)] text-[var(--sh-gold)]";
  const inactiva = "border border-[rgba(228,215,184,0.2)] text-[var(--sh-cream-2)] hover:border-[rgba(228,215,184,0.5)] hover:text-[var(--sh-cream)]";

  return (
    <nav className="flex flex-wrap gap-2" aria-label="Filtrar por categoría">
      <Link href="/tienda" className={cn(base, !activaSlug ? activa : inactiva)}>
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
