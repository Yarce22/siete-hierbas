import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { formatCOP } from "@/lib/format";
import { HabitacionAdminRow } from "@/components/admin/habitacion-admin-row";

export const metadata: Metadata = { title: "Habitaciones · Admin" };

export default async function HabitacionesPage() {
  const supabase = await createClient();
  const { data: habitaciones } = await supabase
    .from("habitaciones")
    .select("id, nombre, slug, tipo, capacidad, precio_noche, destacada")
    .is("deleted_at", null)
    .order("nombre");

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Habitaciones</h1>
          <p className="text-sm text-zinc-500">Hostal Siete Hierbas</p>
        </div>
        <Button asChild>
          <Link href="/admin/habitaciones/nueva">
            <Plus className="mr-2 size-4" />
            Nueva habitación
          </Link>
        </Button>
      </div>

      {(!habitaciones || habitaciones.length === 0) ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-zinc-500">
          <p className="font-medium">No hay habitaciones todavía.</p>
          <p className="mt-1 text-sm">Creá la primera para que aparezca en el hostal.</p>
        </div>
      ) : (
        <ul className="divide-y rounded-lg border">
          {habitaciones.map((h) => (
            <HabitacionAdminRow
              key={h.id}
              habitacion={{ ...h, precio_noche: formatCOP(h.precio_noche), destacada: h.destacada ?? false }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
