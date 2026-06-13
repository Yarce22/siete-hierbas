import Image from "next/image";
import Link from "next/link";

import { FlowerIcon, DropIcon, MoonIcon, HerbIcon, ArrowRight } from "@/components/public/botanical-icons";
import { formatCOP } from "@/lib/format";

import { Eyebrow, btnOutlineStyle } from "./shared";

type Producto = {
  id: string;
  slug: string;
  nombre: string;
  imagen_principal: string | null;
  precio_desde: number | null;
  categoria: { nombre: string } | null;
};

const FALLBACK_PRODUCTS = [
  { name: "Té de 7 Hierbas",      category: "Tés",      price: 18000, icon: <FlowerIcon size={48} color="var(--sh-moss-l)" /> },
  { name: "Tintura de Valeriana", category: "Tinturas", price: 35000, icon: <DropIcon   size={48} color="var(--sh-moss-l)" /> },
  { name: "Aceite de Caléndula",  category: "Aceites",  price: 42000, icon: <MoonIcon   size={48} color="var(--sh-moss-l)" /> },
  { name: "Menta Piperita Seca",  category: "Plantas",  price: 12000, icon: <HerbIcon   size={48} color="var(--sh-moss-l)" /> },
];

function ProductCard({ name, category, price, imageUrl, icon }: {
  name: string;
  category: string;
  price: number;
  imageUrl: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div className="sh-card-img" style={{ height: 280, background: "var(--sh-dark-3)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)", position: "relative", overflow: "hidden" }}>
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <>
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(228,215,184,0.012) 20px, rgba(228,215,184,0.012) 21px)" }} />
            {icon ?? <FlowerIcon size={48} color="var(--sh-moss-l)" />}
          </>
        )}
      </div>
      <div className="sh-card-overlay" style={{ position: "absolute", inset: 0, background: "rgba(13,16,8,0.65)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.4s ease" }}>
        <span style={{ fontFamily: "var(--sh-sans)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sh-cream)", border: "1px solid rgba(228,215,184,0.5)", padding: "0.6rem 1.4rem" }}>
          Ver producto
        </span>
      </div>
      <div style={{ padding: "1.2rem 0.5rem 0" }}>
        <div style={{ fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sh-forest)", marginBottom: "0.4rem" }}>
          {category}
        </div>
        <div style={{ fontFamily: "var(--sh-serif)", fontWeight: "bold", fontSize: "1.1rem", color: "var(--sh-cream)" }}>
          {name}
        </div>
        <div style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--sh-gold)", marginTop: "0.3rem" }}>
          {formatCOP(price)}
        </div>
      </div>
    </div>
  );
}

export function ProductosSection({ destacados }: { destacados: Producto[] }) {
  return (
    <section style={{ padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)", background: "var(--sh-dark-2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3.5rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <Eyebrow>Tienda</Eyebrow>
            <h2 className="sh-reveal" data-delay="100" style={{ fontFamily: "var(--sh-serif)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "var(--sh-cream)" }}>
              Productos destacados
            </h2>
          </div>
          <Link href="/tienda" style={btnOutlineStyle} className="sh-reveal">
            Ver todo <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: "2rem" }}>
          {destacados.length > 0
            ? destacados.map((p, i) => (
                <Link key={p.id} href={`/tienda/${p.slug}`} className="sh-reveal sh-product-card" data-delay={String(i * 100)} style={{ textDecoration: "none", display: "block" }}>
                  <ProductCard name={p.nombre} category={p.categoria?.nombre ?? ""} price={p.precio_desde ?? 0} imageUrl={p.imagen_principal} />
                </Link>
              ))
            : FALLBACK_PRODUCTS.map((p, i) => (
                <Link key={i} href="/tienda" className="sh-reveal sh-product-card" data-delay={String(i * 100)} style={{ textDecoration: "none", display: "block" }}>
                  <ProductCard name={p.name} category={p.category} price={p.price} imageUrl={null} icon={p.icon} />
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
