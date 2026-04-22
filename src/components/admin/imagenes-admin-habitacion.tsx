"use client";

import {
  agregarImagenHabitacion,
  eliminarImagenHabitacion,
} from "@/lib/actions/imagenes";
import { ImagenesAdmin } from "@/components/admin/imagenes-admin";

type Imagen = { id: string; url: string; alt_text: string | null; orden: number };

export function ImagenesAdminHabitacion({
  habitacionId,
  imagenes,
}: {
  habitacionId: string;
  imagenes: Imagen[];
}) {
  return (
    <ImagenesAdmin
      imagenes={imagenes}
      onAgregar={(fd) => agregarImagenHabitacion(habitacionId, fd)}
      onEliminar={(id, url) => eliminarImagenHabitacion(id, url, habitacionId)}
    />
  );
}
