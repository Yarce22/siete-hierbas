import Link from "next/link";
import Image from "next/image";

import type { ProductoListItem } from "@/lib/queries/productos";
import { formatCOP } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";

export function ProductoCard({ producto }: { producto: ProductoListItem }) {
  return (
    <Link href={`/tienda/${producto.slug}`} className="group">
      <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-md">
        <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          {producto.imagen_principal ? (
            <Image
              src={producto.imagen_principal}
              alt={producto.nombre}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-zinc-400">
              Sin imagen
            </div>
          )}
        </div>
        <CardContent className="flex flex-col gap-1 p-4">
          {producto.categoria && (
            <span className="text-xs uppercase tracking-wide text-zinc-500">
              {producto.categoria.nombre}
            </span>
          )}
          <h3 className="font-medium leading-tight group-hover:underline">
            {producto.nombre}
          </h3>
          {producto.descripcion && (
            <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {producto.descripcion}
            </p>
          )}
          {producto.precio_desde !== null && (
            <p className="mt-1 font-semibold">
              Desde {formatCOP(producto.precio_desde)}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
