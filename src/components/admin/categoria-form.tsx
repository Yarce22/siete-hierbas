"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { crearCategoria, actualizarCategoria } from "@/lib/actions/categorias";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Categoria = {
  id: string;
  nombre: string;
  slug: string;
  icono: string | null;
  orden: number;
};

export function CategoriaForm({ categoria }: { categoria?: Categoria }) {
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
    const result = categoria
      ? await actualizarCategoria(categoria.id, fd)
      : await crearCategoria(fd);

    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(categoria ? "Categoría actualizada" : "Categoría creada");
      router.push("/admin/categorias");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          name="nombre"
          defaultValue={categoria?.nombre}
          required
          placeholder="Aceites esenciales"
          onChange={(e) => {
            if (!categoria) {
              const slugInput = document.getElementById("slug") as HTMLInputElement;
              if (slugInput) slugInput.value = autoSlug(e.target.value);
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">
          Slug{" "}
          <span className="text-xs text-zinc-500">(se usa en la URL)</span>
        </Label>
        <Input
          id="slug"
          name="slug"
          defaultValue={categoria?.slug}
          required
          placeholder="aceites-esenciales"
          pattern="[-a-z0-9]+"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icono">
          Ícono{" "}
          <span className="text-xs text-zinc-500">
            (nombre de lucide-react, ej: leaf, droplet)
          </span>
        </Label>
        <Input
          id="icono"
          name="icono"
          defaultValue={categoria?.icono ?? ""}
          placeholder="leaf"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="orden">
          Orden{" "}
          <span className="text-xs text-zinc-500">
            (menor número aparece primero)
          </span>
        </Label>
        <Input
          id="orden"
          name="orden"
          type="number"
          defaultValue={categoria?.orden ?? 0}
          placeholder="0"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : categoria ? "Guardar cambios" : "Crear categoría"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categorias")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
