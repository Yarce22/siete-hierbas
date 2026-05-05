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
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(4rem,8vw,6rem) clamp(1.5rem,5vw,4rem)" }}>
      <header style={{ marginBottom: "3rem" }}>
        <div style={{
          fontSize: "0.62rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--sh-gold)",
          marginBottom: "0.8rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}>
          <span style={{ display: "block", width: "2rem", height: 1, background: "var(--sh-gold)" }} />
          Tienda
        </div>
        <h1 style={{
          fontFamily: "var(--sh-serif)",
          fontSize: "clamp(2rem,4vw,3rem)",
          fontWeight: 300,
          color: "var(--sh-cream)",
          marginBottom: "0.5rem",
        }}>
          {categoriaActiva ? categoriaActiva.nombre : "Todos los productos"}
        </h1>
        <p style={{ color: "var(--sh-cream-3)", fontSize: "0.9rem" }}>
          Productos naturales elaborados con hierbas de la región.
        </p>
      </header>

      <CategoriaFiltro categorias={categorias} activaSlug={categoriaSlug} />

      <div style={{ marginTop: "3rem" }}>
        {productos.length === 0 ? (
          <div style={{
            border: "1px dashed rgba(228,215,184,0.15)",
            padding: "4rem 2rem",
            textAlign: "center",
            color: "var(--sh-cream-3)",
          }}>
            <p style={{ fontFamily: "var(--sh-serif)", fontSize: "1.1rem", color: "var(--sh-cream-2)" }}>
              Todavía no hay productos por acá.
            </p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
              Pronto vas a encontrar algo bueno. ¡Volvé en unos días!
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "2rem",
          }}>
            {productos.map((p) => (
              <ProductoCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
