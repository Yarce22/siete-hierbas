import { TestimonialMarquee } from "@/components/public/testimonial-marquee";
import { Eyebrow } from "./shared";

export function TestimoniosSection() {
  return (
    <section style={{ padding: "clamp(4rem,8vw,7rem) 0" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem", padding: "0 2rem" }}>
        <Eyebrow center>Testimonios</Eyebrow>
        <h2 className="sh-reveal" data-delay="100" style={{ fontFamily: "var(--sh-serif)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: "var(--sh-cream)" }}>
          Lo que dicen nuestros{" "}
          <em style={{ color: "var(--sh-gold)" }}>clientes</em>
        </h2>
      </div>
      <TestimonialMarquee />
    </section>
  );
}
