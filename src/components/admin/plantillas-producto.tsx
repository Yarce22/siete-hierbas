"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type VariantePlantilla = {
  nombre: string;
  precio: number;
  stock: number;
  stock_minimo: number;
};

type Plantilla = {
  descripcion: string;
  variantes: VariantePlantilla[];
};

const PLANTILLAS: Record<string, Plantilla> = {
  "Aceite esencial": {
    descripcion:
      "Aceite esencial 100% puro y natural. Ideal para aromaterapia, masajes y uso tópico.",
    variantes: [
      { nombre: "10ml", precio: 0, stock: 10, stock_minimo: 3 },
      { nombre: "30ml", precio: 0, stock: 10, stock_minimo: 3 },
    ],
  },
  "Té en hojas": {
    descripcion:
      "Té en hojas naturales, sin aditivos ni conservantes. Preparación en infusión.",
    variantes: [
      { nombre: "50g", precio: 0, stock: 20, stock_minimo: 5 },
      { nombre: "100g", precio: 0, stock: 20, stock_minimo: 5 },
      { nombre: "250g", precio: 0, stock: 10, stock_minimo: 3 },
    ],
  },
  Crema: {
    descripcion:
      "Crema natural elaborada con ingredientes orgánicos seleccionados. Sin parabenos.",
    variantes: [
      { nombre: "60ml", precio: 0, stock: 15, stock_minimo: 3 },
      { nombre: "120ml", precio: 0, stock: 15, stock_minimo: 3 },
    ],
  },
  Tintura: {
    descripcion:
      "Tintura madre concentrada elaborada por maceración alcohólica de plantas frescas.",
    variantes: [
      { nombre: "30ml", precio: 0, stock: 20, stock_minimo: 5 },
      { nombre: "60ml", precio: 0, stock: 20, stock_minimo: 5 },
    ],
  },
};

export function PlantillasProducto({
  onAplicar,
}: {
  onAplicar: (data: {
    descripcion: string;
    variantes: VariantePlantilla[];
  }) => void;
}) {
  const [open, setOpen] = useState(false);

  function aplicar(plantilla: Plantilla) {
    onAplicar(plantilla);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Wand2 className="mr-2 size-4" />
          Usar plantilla
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Elegí una plantilla</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-zinc-500">
          Pre-completa la descripción y sugiere variantes con sus presentaciones
          típicas. Los precios quedan en $0 para que los completes.
        </p>
        <div className="grid gap-3 pt-2">
          {Object.entries(PLANTILLAS).map(([nombre, plantilla]) => (
            <button
              key={nombre}
              type="button"
              onClick={() => aplicar(plantilla)}
              className="flex flex-col items-start rounded-lg border p-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <span className="font-medium">{nombre}</span>
              <span className="mt-0.5 text-xs text-zinc-500">
                Variantes: {plantilla.variantes.map((v) => v.nombre).join(", ")}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
