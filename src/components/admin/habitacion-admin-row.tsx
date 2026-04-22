"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { eliminarHabitacion } from "@/lib/actions/habitaciones";
import { Button } from "@/components/ui/button";

type Props = {
  habitacion: {
    id: string;
    nombre: string;
    slug: string;
    tipo: string;
    capacidad: number;
    precio_noche: string;
  };
};

export function HabitacionAdminRow({ habitacion: h }: Props) {
  async function handleEliminar() {
    if (!confirm(`¿Eliminar "${h.nombre}"?`)) return;
    const result = await eliminarHabitacion(h.id);
    if (result.error) toast.error(result.error);
    else toast.success("Habitación eliminada");
  }

  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="min-w-0">
        <p className="font-medium truncate">{h.nombre}</p>
        <p className="text-xs text-zinc-500">
          {h.tipo} · {h.capacidad} persona{h.capacidad !== 1 ? "s" : ""} · {h.precio_noche}/noche
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/admin/habitaciones/${h.id}`}>
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
