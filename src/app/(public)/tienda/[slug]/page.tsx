import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AgregarAlCarrito } from "@/components/public/agregar-al-carrito";
import { GaleriaProducto } from "@/components/public/galeria-producto";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCOP } from "@/lib/format";
import { getProductoBySlug } from "@/lib/queries/productos";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);
  if (!producto) return {};

  return {
    title: producto.nombre,
    description: producto.descripcion_corta ?? undefined,
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);

  if (!producto) notFound();

  const imagenPrincipal = producto.imagenes[0]?.url ?? null;
  const precioDesde =
    producto.variantes.length > 0
      ? Math.min(...producto.variantes.map((v) => v.precio))
      : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/tienda" className="hover:text-zinc-900 dark:hover:text-zinc-100">
          Tienda
        </Link>
        {producto.categoria && (
          <>
            <span>/</span>
            <Link
              href={`/tienda?categoria=${producto.categoria.slug}`}
              className="hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {producto.categoria.nombre}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-100">{producto.nombre}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <GaleriaProducto imagenes={producto.imagenes} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            {producto.categoria && (
              <span className="text-sm uppercase tracking-wide text-zinc-500">
                {producto.categoria.nombre}
              </span>
            )}
            <h1 className="text-3xl font-semibold tracking-tight">
              {producto.nombre}
            </h1>
            {producto.descripcion_corta && (
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                {producto.descripcion_corta}
              </p>
            )}
            {precioDesde !== null && (
              <p className="text-2xl font-bold">
                Desde {formatCOP(precioDesde)}
              </p>
            )}
            {producto.destacado && (
              <Badge variant="secondary" className="w-fit">
                Destacado
              </Badge>
            )}
          </div>

          <Separator />

          <AgregarAlCarrito
            producto={producto}
            imagenPrincipal={imagenPrincipal}
          />

          {producto.descripcion && (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold">Descripción</h2>
                <p className="whitespace-pre-line text-zinc-600 dark:text-zinc-400">
                  {producto.descripcion}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
