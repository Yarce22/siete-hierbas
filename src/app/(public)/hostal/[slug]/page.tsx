import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Users } from "lucide-react";

import { GaleriaProducto } from "@/components/public/galeria-producto";
import { ReservaForm } from "@/components/public/reserva-form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCOP } from "@/lib/format";
import { getHabitacionBySlug } from "@/lib/queries/habitaciones";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const habitacion = await getHabitacionBySlug(slug);
  if (!habitacion) return {};

  const imagenOg = habitacion.imagenes[0]?.url;

  return {
    title: habitacion.nombre,
    description: habitacion.descripcion ?? undefined,
    openGraph: {
      title: habitacion.nombre,
      description: habitacion.descripcion ?? undefined,
      images: imagenOg ? [{ url: imagenOg, alt: habitacion.nombre }] : [],
    },
  };
}

export default async function HabitacionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const habitacion = await getHabitacionBySlug(slug);

  if (!habitacion) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/hostal" className="hover:text-zinc-900 dark:hover:text-zinc-100">
          Hostal
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-100">{habitacion.nombre}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <GaleriaProducto imagenes={habitacion.imagenes} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {habitacion.tipo}
              </Badge>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              {habitacion.nombre}
            </h1>

            <div className="flex items-center gap-1.5 text-zinc-500">
              <Users className="size-4" />
              <span className="text-sm">
                Hasta {habitacion.capacidad}{" "}
                {habitacion.capacidad === 1 ? "persona" : "personas"}
              </span>
            </div>

            <p className="text-2xl font-bold">
              {formatCOP(habitacion.precio_noche)}{" "}
              <span className="text-base font-normal text-zinc-500">/ noche</span>
            </p>
          </div>

          {habitacion.amenidades.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-col gap-3">
                <h2 className="font-semibold">Amenidades</h2>
                <div className="flex flex-wrap gap-2">
                  {habitacion.amenidades.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border px-3 py-1 text-sm text-zinc-700 dark:text-zinc-300"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {habitacion.descripcion && (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold">Descripción</h2>
                <p className="whitespace-pre-line text-zinc-600 dark:text-zinc-400">
                  {habitacion.descripcion}
                </p>
              </div>
            </>
          )}

          <Separator />

          <ReservaForm
            habitacionNombre={habitacion.nombre}
            capacidad={habitacion.capacidad}
            precioPorNoche={habitacion.precio_noche}
          />
        </div>
      </div>
    </div>
  );
}
