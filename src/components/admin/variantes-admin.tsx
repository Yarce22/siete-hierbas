"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { crearVariante, eliminarVariante } from "@/lib/actions/productos";
import { formatCOP } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Variante = {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  stock_minimo: number;
  sku: string | null;
};

export function VariantesAdmin({
  productoId,
  variantes,
}: {
  productoId: string;
  variantes: Variante[];
}) {
  const [agregando, setAgregando] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleEliminar(v: Variante) {
    if (!confirm(`¿Eliminar variante "${v.nombre}"?`)) return;
    const result = await eliminarVariante(v.id, productoId);
    if (result.error) toast.error(result.error);
    else toast.success("Variante eliminada");
  }

  async function handleCrear(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const result = await crearVariante(productoId, new FormData(e.currentTarget));
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Variante agregada");
      setAgregando(false);
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Variantes</h2>
          <p className="text-sm text-zinc-500">
            Cada variante tiene su precio y stock. Ej: 250ml, 500ml.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAgregando(!agregando)}
        >
          <Plus className="mr-1 size-4" />
          Agregar
        </Button>
      </div>

      {variantes.length === 0 && !agregando && (
        <p className="text-sm text-zinc-500">
          Sin variantes todavía. Agregá al menos una para que el producto pueda
          comprarse.
        </p>
      )}

      {variantes.length > 0 && (
        <ul className="divide-y rounded-lg border mb-4">
          {variantes.map((v) => (
            <li
              key={v.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div>
                <p className="font-medium">{v.nombre}</p>
                <p className="text-sm text-zinc-500">
                  {formatCOP(v.precio)} · stock: {v.stock} (mín. {v.stock_minimo})
                  {v.sku && ` · SKU: ${v.sku}`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEliminar(v)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {agregando && (
        <form
          onSubmit={handleCrear}
          className="rounded-lg border p-4 space-y-4"
        >
          <p className="text-sm font-medium">Nueva variante</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="v-nombre">Nombre</Label>
              <Input id="v-nombre" name="nombre" required placeholder="250ml" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="v-precio">Precio (COP)</Label>
              <Input
                id="v-precio"
                name="precio"
                type="number"
                min="0"
                required
                placeholder="25000"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="v-stock">Stock inicial</Label>
              <Input
                id="v-stock"
                name="stock"
                type="number"
                min="0"
                defaultValue="0"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="v-stock-min">
                Stock mínimo{" "}
                <span className="text-xs text-zinc-500">(alerta)</span>
              </Label>
              <Input
                id="v-stock-min"
                name="stock_minimo"
                type="number"
                min="0"
                defaultValue="5"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="v-sku">
                SKU <span className="text-xs text-zinc-500">(opcional)</span>
              </Label>
              <Input id="v-sku" name="sku" placeholder="LAV-250" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? "Guardando..." : "Guardar variante"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setAgregando(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
