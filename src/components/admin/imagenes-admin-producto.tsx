"use client";

import {
  agregarImagenProducto,
  eliminarImagenProducto,
} from "@/lib/actions/imagenes";
import { ImagenesAdmin } from "@/components/admin/imagenes-admin";

type Imagen = { id: string; url: string; alt_text: string | null; orden: number };

export function ImagenesAdminProducto({
  productoId,
  imagenes,
}: {
  productoId: string;
  imagenes: Imagen[];
}) {
  return (
    <ImagenesAdmin
      imagenes={imagenes}
      onAgregar={(fd) => agregarImagenProducto(productoId, fd)}
      onEliminar={(id, url) => eliminarImagenProducto(id, url, productoId)}
    />
  );
}
