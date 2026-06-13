import { ScrollRevealInit } from "@/components/public/scroll-reveal-init";
import { PopupPromo } from "@/components/public/popup-promo";
import { getProductos } from "@/lib/queries/productos";
import { getSiteConfig, getHeroSlides } from "@/lib/queries/site-config";

import { HomeStyles } from "@/components/public/home/home-styles";
import { HeroSection } from "@/components/public/home/hero-section";
import { StatsSection } from "@/components/public/home/stats-section";
import { HistoriaSection } from "@/components/public/home/historia-section";
import { BotanicalDivider } from "@/components/public/home/shared";
import { ProductosSection } from "@/components/public/home/productos-section";
import { PorQueSection } from "@/components/public/home/por-que-section";
import { TestimoniosSection } from "@/components/public/home/testimonios-section";
import { CTASection } from "@/components/public/home/cta-section";

export default async function Home() {
  const [destacados, siteConfig, heroSlides] = await Promise.all([
    getProductos({ soloDestacados: true, limit: 4 }),
    getSiteConfig(),
    getHeroSlides(),
  ]);

  return (
    <div style={{ fontFamily: "var(--sh-sans)", color: "var(--sh-cream)", fontWeight: 300 }}>
      <ScrollRevealInit />
      <HomeStyles />

      {siteConfig.popup_activo && siteConfig.popup_imagen_url && (
        <PopupPromo imagenUrl={siteConfig.popup_imagen_url} link={siteConfig.popup_link} />
      )}

      <HeroSection heroSlides={heroSlides} />
      <StatsSection />
      <HistoriaSection siteConfig={siteConfig} />

      <div style={{ padding: "0 clamp(1.5rem,5vw,4rem)" }}>
        <BotanicalDivider />
      </div>

      <ProductosSection destacados={destacados} />
      <PorQueSection siteConfig={siteConfig} />
      <TestimoniosSection />
      <CTASection />
    </div>
  );
}
