import Link from "next/link";

import { ArrowRight } from "@/components/public/botanical-icons";
import { Eyebrow, btnPrimaryStyle, btnOutlineStyle } from "./shared";

const MAPS_URL = "https://www.google.com/maps/place/Siete+Hierbas+Hostal/@4.862067,-75.612707,17z/data=!3m1!4b1!4m9!3m8!1s0x8e38822cd1ec0ecf:0xd15d2f301e20f53b!5m2!4m1!1i2!8m2!3d4.862067!4d-75.612707!16s%2Fg%2F11cn0rc2lz?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D";

export function CTASection() {
  return (
    <section
      style={{
        padding: "clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,4rem)",
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(58,90,60,0.35) 0%, transparent 70%), var(--sh-dark-2)`,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.04 }} width="600" height="600" viewBox="0 0 600 600" fill="none">
        <circle cx="300" cy="300" r="280" stroke="#6aaa88" strokeWidth="1" />
        <circle cx="300" cy="300" r="220" stroke="#6aaa88" strokeWidth="0.5" />
        <circle cx="300" cy="300" r="160" stroke="#c9923a" strokeWidth="0.5" />
      </svg>
      <div style={{ position: "relative", zIndex: 1 }}>
        <Eyebrow center>Visítanos</Eyebrow>
        <h2 className="sh-reveal" data-delay="100" style={{ fontFamily: "var(--sh-serif)", fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 300, color: "var(--sh-cream)", marginBottom: "1.2rem" }}>
          Te esperamos en nuestro
          <br />
          <em style={{ color: "var(--sh-forest)", fontWeight: "bold" }}>Paisaje Cultural Cafetero</em>
        </h2>
        <p className="sh-reveal" data-delay="200" style={{ color: "var(--sh-cream-2)", fontSize: "0.9rem", maxWidth: "45ch", margin: "0 auto 3rem", lineHeight: 1.8 }}>
          A 45 minutos de Pereira, en el pueblo de las aguas termales y el café. Un destino que cura.
        </p>
        <div className="sh-reveal" data-delay="300" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/tienda" style={btnPrimaryStyle}>
            Visitar tienda <ArrowRight size={14} />
          </Link>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" style={btnOutlineStyle}>
            Cómo llegar
          </a>
        </div>
      </div>
    </section>
  );
}
