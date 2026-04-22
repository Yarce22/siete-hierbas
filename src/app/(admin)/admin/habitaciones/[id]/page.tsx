import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { HabitacionForm } from "@/components/admin/habitacion-form";
import { ImagenesAdminHabitacion } from "@/components/admin/imagenes-admin-habitacion";

export const metadata: Metadata = { title: "Editar habitación · Admin" };

export default async function EditarHabitacion({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("habitaciones")
    .select(
      `id, nombre, slug, tipo, capacidad, precio_noche, descripcion, amenidades,
       habitacion_imagenes ( id, url, alt_text, orden )`,
    )
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!data) notFound();

  type HabConImagenes = typeof data & {
    habitacion_imagenes: { id: string; url: string; alt_text: string | null; orden: number }[];
  };

  const h = data as HabConImagenes;
  const imagenes = (h.habitacion_imagenes ?? []).sort((a, b) => a.orden - b.orden);

  return (
    <div className="mx-auto max-w-xl px-6 py-10 space-y-10">
      <div>
        <h1 className="mb-6 text-2xl font-semibold">Editar habitación</h1>
        <HabitacionForm habitacion={h} />
      </div>
      <ImagenesAdminHabitacion habitacionId={id} imagenes={imagenes} />
    </div>
  );
}
