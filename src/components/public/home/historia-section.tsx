import Image from "next/image";
import Link from "next/link";

import type { SiteConfig } from "@/lib/queries/site-config";
import { LeafIcon, ArrowRight } from "@/components/public/botanical-icons";

import { Eyebrow, ImgPlaceholder, btnOutlineStyle } from "./shared";

export function HistoriaSection({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <section style={{ padding: "clamp(4rem,10vw,8rem) clamp(1.5rem,5vw,4rem)", maxWidth: 1200, margin: "0 auto" }}>
      <div className="sh-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
        <div className="sh-reveal-left">
          <Eyebrow>{siteConfig.historia_subtitulo}</Eyebrow>
          <h2
            className="sh-reveal"
            data-delay="100"
            style={{ fontFamily: "var(--sh-serif)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 500, lineHeight: 1.2, marginBottom: "2rem", color: "var(--sh-dark-olive)" }}
          >
            {siteConfig.historia_titulo}
          </h2>
          <p style={{ color: "var(--sh-forest)", lineHeight: 1.9, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            {siteConfig.historia_parrafo1}
          </p>
          <p style={{ color: "var(--sh-forest)", lineHeight: 1.9, marginBottom: "2.5rem", fontSize: "0.9rem" }}>
            {siteConfig.historia_parrafo2}
          </p>
          <Link href="/contacto" style={btnOutlineStyle}>
            Escríbenos <ArrowRight size={14} />
          </Link>
        </div>

        <div className="sh-reveal-right" style={{ position: "relative" }}>
          {siteConfig.historia_imagen_url ? (
            <div style={{ height: 500, position: "relative", background: "var(--sh-dark-3)" }}>
              <Image src={siteConfig.historia_imagen_url} alt={siteConfig.historia_titulo} fill className="object-cover" />
            </div>
          ) : (
            <ImgPlaceholder label="Jardín de hierbas / fotografía editorial" height={500} icon={<LeafIcon size={32} color="var(--sh-cream-3)" />} />
          )}
          <div
            className="sh-history-badge"
            style={{ background: "var(--sh-dark-3)", border: "1px solid rgba(228,215,184,0.07)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "1.5rem", textAlign: "center" }}
          >
            <LeafIcon size={24} color="var(--sh-gold)" />
            <span style={{ fontFamily: "var(--sh-serif)", fontSize: "0.95rem", fontStyle: "italic", color: "var(--sh-cream)" }}>
              Cultivo propio, cosecha ética
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
