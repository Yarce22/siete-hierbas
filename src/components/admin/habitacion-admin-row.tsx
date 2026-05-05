"use client";

import Link from "next/link";
import { Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

import { eliminarHabitacion, marcarHabitacionDestacada } from "@/lib/actions/habitaciones";
import { Button } from "@/components/ui/button";

type Props = {
  habitacion: {
    id: string;
    nombre: string;
    slug: string;
    tipo: string;
    capacidad: number;
    precio_noche: string;
    destacada: boolean;
  };
};

export function HabitacionAdminRow({ habitacion: h }: Props) {
  async function handleEliminar() {
    if (!confirm(`¿Eliminar "${h.nombre}"?`)) return;
    const result = await eliminarHabitacion(h.id);
    if (result.error) toast.error(result.error);
    else toast.success("Habitación eliminada");
  }

  async function handleDestacar() {
    const result = await marcarHabitacionDestacada(h.id);
    if (result.error) toast.error(result.error);
    else toast.success("Habitación destacada en el home");
  }

  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="min-w-0 flex items-center gap-2">
        {h.destacada && (
          <Star className="size-3.5 fill-amber-400 text-amber-400 shrink-0" />
        )}
        <div className="min-w-0">
          <p className="font-medium truncate">{h.nombre}</p>
          <p className="text-xs text-zinc-500">
            {h.tipo} · {h.capacidad} persona{h.capacidad !== 1 ? "s" : ""} · {h.precio_noche}/noche
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {!h.destacada && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDestacar}
            title="Destacar en home"
            className="text-amber-500 hover:text-amber-600 hover:bg-amber-50"
          >
            <Star className="size-4" />
          </Button>
        )}
        <Button asChild variant="ghost" size="sm">
          <Link href={`/admin/habitaciones/${h.id}`}>
            <Pencil className="size-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEliminar}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </li>
  );
}
