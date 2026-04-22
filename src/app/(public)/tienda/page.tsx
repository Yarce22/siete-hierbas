import type { Metadata } from "next";

import { CategoriaFiltro } from "@/components/public/categoria-filtro";
import { ProductoCard } from "@/components/public/producto-card";
import { getCategorias } from "@/lib/queries/categorias";
import { getProductos } from "@/lib/queries/productos";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Catálogo de productos naturistas: aceites, tés, cremas, tinturas y más.",
};

type SearchParams = { categoria?: string | string[] };

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { categoria } = await searchParams;
  const categoriaSlug = Array.isArray(categoria) ? categoria[0] : categoria;

  const [categorias, productos] = await Promise.all([
    getCategorias(),
    getProductos({ categoriaSlug }),
  ]);

  const categoriaActiva = categorias.find((c) => c.slug === categoriaSlug);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {categoriaActiva ? categoriaActiva.nombre : "Tienda"}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Productos naturales elaborados con hierbas de la región.
        </p>
      </header>

      <CategoriaFiltro categorias={categorias} activaSlug={categoriaSlug} />

      {productos.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-zinc-500">
          <p className="font-medium">Todavía no hay productos por acá.</p>
          <p className="mt-1 text-sm">
            Pronto vas a encontrar algo bueno. ¡Volvé en unos días!
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((p) => (
            <li key={p.id}>
              <ProductoCard producto={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
