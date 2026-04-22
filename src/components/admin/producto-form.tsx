"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { crearProducto, actualizarProducto } from "@/lib/actions/productos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Categoria = { id: string; nombre: string };

type Producto = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  destacado: boolean;
  categoria_id: string | null;
};

export function ProductoForm({
  categorias,
  producto,
}: {
  categorias: Categoria[];
  producto?: Producto;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function autoSlug(nombre: string) {
    return nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const result = producto
      ? await actualizarProducto(producto.id, fd)
      : await crearProducto(fd);

    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(producto ? "Producto actualizado" : "Producto creado");
      if (!producto && "id" in result) {
        router.push(`/admin/productos/${result.id}`);
      } else {
        router.push("/admin/productos");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del producto</Label>
        <Input
          id="nombre"
          name="nombre"
          defaultValue={producto?.nombre}
          required
          placeholder="Aceite de lavanda 30ml"
          onChange={(e) => {
            if (!producto) {
              const slugInput = document.getElementById("slug") as HTMLInputElement;
              if (slugInput) slugInput.value = autoSlug(e.target.value);
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          defaultValue={producto?.slug}
          required
          placeholder="aceite-de-lavanda"
          pattern="[a-z0-9-]+"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoria_id">Categoría</Label>
        <select
          id="categoria_id"
          name="categoria_id"
          defaultValue={producto?.categoria_id ?? ""}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
        >
          <option value="">Sin categoría</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <textarea
          id="descripcion"
          name="descripcion"
          defaultValue={producto?.descripcion ?? ""}
          rows={4}
          placeholder="Describe el producto, sus beneficios y modo de uso..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="destacado"
          name="destacado"
          type="checkbox"
          defaultChecked={producto?.destacado}
          className="size-4 rounded border-gray-300"
        />
        <Label htmlFor="destacado">
          Destacado{" "}
          <span className="text-xs text-zinc-500">
            (aparece en el inicio del sitio)
          </span>
        </Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Guardando..."
            : producto
              ? "Guardar cambios"
              : "Crear producto"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/productos")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
