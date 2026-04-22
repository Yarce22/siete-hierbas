import Link from "next/link";
import { Users } from "lucide-react";

import type { HabitacionListItem } from "@/lib/queries/habitaciones";
import { formatCOP } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function HabitacionCard({ habitacion }: { habitacion: HabitacionListItem }) {
  return (
    <Link href={`/hostal/${habitacion.slug}`} className="group">
      <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-md">
        <div className="aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          {habitacion.imagen_principal ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={habitacion.imagen_principal}
              alt={habitacion.nombre}
              className="size-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-zinc-400">
              Sin imagen
            </div>
          )}
        </div>

        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium leading-tight group-hover:underline">
              {habitacion.nombre}
            </h3>
            <Badge variant="secondary" className="shrink-0 capitalize">
              {habitacion.tipo}
            </Badge>
          </div>

          <div className="flex items-center gap-1 text-sm text-zinc-500">
            <Users className="size-3.5" />
            <span>Hasta {habitacion.capacidad} {habitacion.capacidad === 1 ? "persona" : "personas"}</span>
          </div>

          {habitacion.amenidades.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {habitacion.amenidades.slice(0, 3).map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {a}
                </span>
              ))}
              {habitacion.amenidades.length > 3 && (
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
                  +{habitacion.amenidades.length - 3} más
                </span>
              )}
            </div>
          )}

          <p className="mt-1 font-semibold">
            {formatCOP(habitacion.precio_noche)}{" "}
            <span className="text-sm font-normal text-zinc-500">/ noche</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
