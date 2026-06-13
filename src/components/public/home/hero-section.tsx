import Link from "next/link";

import { HeroSlider } from "@/components/public/hero-slider";
import type { HeroSlide } from "@/lib/queries/site-config";

import { ArrowRight } from "@/components/public/botanical-icons";
import { btnPrimaryStyle } from "./shared";

function HeroText({ text, delay }: { text: string; delay: number }) {
  return (
    <span>
      {text.split(" ").map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", marginRight: "0.28em" }}>
          <span className="sh-hero-word-inner" style={{ animationDelay: `${delay + i * 0.12}s` }}>
            {w}
          </span>
        </span>
      ))}
    </span>
  );
}

export function HeroSection({ heroSlides }: { heroSlides: HeroSlide[] }) {
  return (
    <section
      style={{
        height: "calc(100vh - 5rem)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {heroSlides.length > 0 ? (
        <HeroSlider slides={heroSlides} />
      ) : (
        <>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: `
                radial-gradient(ellipse 80% 60% at 30% 60%, rgba(58,90,60,0.45) 0%, transparent 60%),
                radial-gradient(ellipse 60% 50% at 75% 25%, rgba(184,118,44,0.2) 0%, transparent 50%),
                radial-gradient(ellipse 50% 70% at 60% 80%, rgba(22,27,14,0.9) 0%, transparent 60%),
                #0d1008
              `,
              animation: "sh-mesh-pulse 8s ease-in-out infinite",
            }}
          />

          <svg aria-hidden="true" className="sh-hero-deco-svg" style={{ position: "absolute", top: "8%", right: "6%", opacity: 0.12, animation: "sh-float-leaf 7s ease-in-out infinite" }} width="180" height="240" viewBox="0 0 180 240" fill="none">
            <path d="M90 220 C90 220 30 160 30 100 C30 60 55 20 90 10 C125 20 150 60 150 100 C150 160 90 220 90 220Z" stroke="#6aaa88" strokeWidth="1" fill="rgba(106,170,136,0.06)" />
            <path d="M90 220 L90 30" stroke="#6aaa88" strokeWidth="0.8" opacity="0.5" />
            <path d="M90 80 C90 80 60 70 50 50" stroke="#6aaa88" strokeWidth="0.6" opacity="0.4" />
            <path d="M90 80 C90 80 120 70 130 50" stroke="#6aaa88" strokeWidth="0.6" opacity="0.4" />
            <path d="M90 120 C90 120 58 108 45 85" stroke="#6aaa88" strokeWidth="0.6" opacity="0.4" />
            <path d="M90 120 C90 120 122 108 135 85" stroke="#6aaa88" strokeWidth="0.6" opacity="0.4" />
            <path d="M90 160 C90 160 65 148 55 125" stroke="#6aaa88" strokeWidth="0.6" opacity="0.3" />
            <path d="M90 160 C90 160 115 148 125 125" stroke="#6aaa88" strokeWidth="0.6" opacity="0.3" />
          </svg>

          <svg aria-hidden="true" className="sh-hero-deco-svg" style={{ position: "absolute", bottom: "10%", left: "4%", opacity: 0.1, animation: "sh-float-leaf 9s ease-in-out infinite 2s" }} width="120" height="160" viewBox="0 0 120 160" fill="none">
            <path d="M60 150 C60 150 10 100 15 50 C20 20 40 5 60 5 C80 5 100 20 105 50 C110 100 60 150 60 150Z" stroke="#c9923a" strokeWidth="1" fill="rgba(201,146,58,0.05)" />
            <path d="M60 150 L60 20" stroke="#c9923a" strokeWidth="0.7" opacity="0.4" />
          </svg>

          <div style={{ position: "relative", zIndex: 2, maxWidth: 900, padding: "0 2rem" }}>
            <div style={{ fontFamily: "var(--sh-sans)", fontSize: "0.62rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--sh-gold)", marginBottom: "2rem", animation: "sh-fade-up 1s ease both", animationDelay: "0.1s" }}>
              Santa Rosa de Cabal · Colombia · Desde 2012
            </div>
            <h1 style={{ fontFamily: "var(--sh-serif)", fontSize: "clamp(3.2rem, 8vw, 7rem)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.01em", color: "var(--sh-cream)", marginBottom: "1.5rem" }}>
              <HeroText text="Donde la tierra" delay={0.3} />
              <br />
              <span style={{ fontStyle: "italic", color: "var(--sh-gold)" }}>
                <HeroText text="habla y sana." delay={0.9} />
              </span>
            </h1>
            <p style={{ fontFamily: "var(--sh-sans)", fontSize: "1rem", color: "var(--sh-cream-2)", fontWeight: 300, maxWidth: "50ch", margin: "0 auto 3rem", lineHeight: 1.8, animation: "sh-fade-up 1s ease both", animationDelay: "0.9s" }}>
              Herbolaria boutique y hospedaje de bienestar en el corazón del Eje Cafetero. Plantas, remedios y descanso auténtico.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", animation: "sh-fade-up 1s ease both", animationDelay: "1.1s" }}>
              <Link href="/tienda" style={btnPrimaryStyle}>
                Explorar tienda <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div aria-hidden="true" className="sh-hero-scroll-hint" style={{ position: "absolute", bottom: "3rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem", animation: "sh-fade-up 1s ease both", animationDelay: "1.4s" }}>
            <span style={{ fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--sh-cream-3)" }}>Scroll</span>
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, var(--sh-gold), transparent)", animation: "sh-line-grow 2s ease-in-out infinite" }} />
          </div>
        </>
      )}
    </section>
  );
}
