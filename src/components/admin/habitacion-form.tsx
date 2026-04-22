"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { crearHabitacion, actualizarHabitacion } from "@/lib/actions/habitaciones";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Habitacion = {
  id: string;
  nombre: string;
  slug: string;
  tipo: string;
  capacidad: number;
  precio_noche: number;
  descripcion: string | null;
  amenidades: string[];
};

const TIPOS = ["Individual", "Doble", "Triple", "Cuádruple", "Suite", "Familiar"];

export function HabitacionForm({ habitacion }: { habitacion?: Habitacion }) {
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
    const result = habitacion
      ? await actualizarHabitacion(habitacion.id, fd)
      : await crearHabitacion(fd);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(habitacion ? "Habitación actualizada" : "Habitación creada");
      if (!habitacion && "id" in result) {
        router.push(`/admin/habitaciones/${result.id}`);
      } else {
        router.push("/admin/habitaciones");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          name="nombre"
          defaultValue={habitacion?.nombre}
          required
          placeholder="Habitación Lavanda"
          onChange={(e) => {
            if (!habitacion) {
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
          defaultValue={habitacion?.slug}
          required
          pattern="[a-z0-9-]+"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo</Label>
          <select
            id="tipo"
            name="tipo"
            defaultValue={habitacion?.tipo ?? ""}
            required
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
          >
            <option value="">Seleccionar...</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacidad">Capacidad</Label>
          <Input
            id="capacidad"
            name="capacidad"
            type="number"
            min="1"
            defaultValue={habitacion?.capacidad ?? 2}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="precio_noche">Precio/noche (COP)</Label>
          <Input
            id="precio_noche"
            name="precio_noche"
            type="number"
            min="0"
            defaultValue={habitacion?.precio_noche ?? ""}
            required
            placeholder="80000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <textarea
          id="descripcion"
          name="descripcion"
          defaultValue={habitacion?.descripcion ?? ""}
          rows={3}
          placeholder="Habitación luminosa con vista al jardín..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amenidades">
          Amenidades{" "}
          <span className="text-xs text-zinc-500">(una por línea)</span>
        </Label>
        <textarea
          id="amenidades"
          name="amenidades"
          defaultValue={habitacion?.amenidades.join("\n") ?? ""}
          rows={4}
          placeholder="WiFi&#10;Baño privado&#10;Agua caliente&#10;Televisor"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : habitacion ? "Guardar cambios" : "Crear habitación"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/habitaciones")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
