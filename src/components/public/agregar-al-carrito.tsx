"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import type { ProductoDetalle } from "@/lib/queries/productos";
import { useCart } from "@/components/public/cart-provider";
import { VarianteSelector } from "@/components/public/variante-selector";
import { Button } from "@/components/ui/button";

type Props = {
  producto: Pick<ProductoDetalle, "id" | "nombre" | "slug" | "variantes">;
  imagenPrincipal: string | null;
};

export function AgregarAlCarrito({ producto, imagenPrincipal }: Props) {
  const { add } = useCart();
  const [varianteId, setVarianteId] = useState<string | null>(
    producto.variantes[0]?.id ?? null,
  );

  const varianteActual = producto.variantes.find((v) => v.id === varianteId);
  const sinStock = varianteActual ? varianteActual.stock === 0 : true;

  function handleAgregar() {
    if (!varianteActual) return;

    add({
      varianteId: varianteActual.id,
      productoId: producto.id,
      productoNombre: producto.nombre,
      productoSlug: producto.slug,
      varianteNombre: varianteActual.nombre,
      precio: varianteActual.precio,
      imagen: imagenPrincipal,
    });

    toast.success(`${producto.nombre} agregado al carrito`, {
      description: varianteActual.nombre,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <VarianteSelector
        variantes={producto.variantes}
        seleccionada={varianteId}
        onChange={setVarianteId}
      />

      <Button
        size="lg"
        onClick={handleAgregar}
        disabled={sinStock || !varianteActual}
        className="w-full sm:w-auto"
      >
        <ShoppingBag className="mr-2 size-4" />
        {sinStock ? "Sin stock" : "Agregar al carrito"}
      </Button>
    </div>
  );
}
