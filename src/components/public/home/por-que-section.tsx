import type { SiteConfig } from "@/lib/queries/site-config";
import { getIconByName } from "@/components/public/botanical-icons";

import { Eyebrow } from "./shared";

function ExperienceCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  return (
    <div
      className="sh-reveal sh-exp-card"
      data-delay={String(delay)}
      style={{ display: "flex", flexDirection: "column", gap: "1.2rem", padding: "2.5rem 2rem", border: "1px solid rgba(228,215,184,0.07)", background: "var(--sh-forest)", transition: "border-color 0.4s, background 0.4s, transform 0.4s", cursor: "default" }}
    >
      <div style={{ color: "var(--sh-gold)", opacity: 0.8 }}>{icon}</div>
      <h3 style={{ fontFamily: "var(--sh-serif)", fontSize: "1.3rem", color: "var(--sh-cream)", fontWeight: 400 }}>
        {title}
      </h3>
      <p style={{ fontSize: "0.83rem", color: "var(--sh-cream-2)", lineHeight: 1.75 }}>
        {desc}
      </p>
    </div>
  );
}

export function PorQueSection({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <section style={{ padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)", background: "var(--sh-dark)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <Eyebrow center>{siteConfig.por_que_subtitulo}</Eyebrow>
          <h2 className="sh-reveal" data-delay="100" style={{ fontFamily: "var(--sh-serif)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "var(--sh-cream)" }}>
            {siteConfig.por_que_titulo}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "1.5rem" }}>
          {siteConfig.por_que_cards.map((card, i) => (
            <ExperienceCard key={i} icon={getIconByName(card.icono)} title={card.titulo} desc={card.descripcion} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
