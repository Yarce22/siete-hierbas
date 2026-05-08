"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { HeroSlide } from "@/lib/queries/site-config";

type Props = {
  slides: HeroSlide[];
};

function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12,5 19,12 12,19" />
    </svg>
  );
}

export function HeroSlider({ slides }: Props) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const goTo = (i: number) => {
    setCurrent(i);
    startTimer();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? (current + 1) % slides.length : (current - 1 + slides.length) % slides.length);
    }
    touchStartX.current = null;
  };

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((s, i) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 1s ease",
            zIndex: 0,
          }}
        >
          <Image
            src={s.imagen_url}
            alt={s.titulo || `Slide ${i + 1}`}
            fill
            className="object-cover"
            priority={i === 0}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(13,16,8,0.55)" }} />
        </div>
      ))}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          textAlign: "center",
          padding: "0 2rem",
        }}
      >
        {slide.titulo && (
          <h2
            style={{
              fontFamily: "var(--sh-serif)",
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              fontWeight: 300,
              lineHeight: 1.08,
              color: "var(--sh-cream)",
              marginBottom: "1.2rem",
              maxWidth: 800,
            }}
          >
            {slide.titulo}
          </h2>
        )}
        {slide.subtitulo && (
          <p
            style={{
              fontFamily: "var(--sh-sans)",
              fontSize: "1rem",
              color: "var(--sh-cream-2)",
              fontWeight: 300,
              maxWidth: "50ch",
              margin: "0 auto 2.5rem",
              lineHeight: 1.8,
            }}
          >
            {slide.subtitulo}
          </p>
        )}
        <Link
          href={slide.boton_link}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "var(--sh-gold)",
            color: "var(--sh-dark)",
            fontFamily: "var(--sh-sans)",
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 500,
            padding: "0.9rem 2rem",
            textDecoration: "none",
          }}
        >
          {slide.boton_texto} <ArrowRight size={14} />
        </Link>
      </div>

      {slides.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "5rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.5rem",
            zIndex: 3,
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Ir al slide ${i + 1}`}
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                background: i === current ? "var(--sh-gold)" : "rgba(228,215,184,0.4)",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                transition: "width 0.35s, background 0.35s",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {slides.length > 1 && (
        <>
          <button
            onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            aria-label="Slide anterior"
            className="hidden md:flex"
            style={{
              position: "absolute",
              left: "1.5rem",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              background: "rgba(13,16,8,0.4)",
              border: "1px solid rgba(228,215,184,0.2)",
              color: "var(--sh-cream)",
              width: 44,
              height: 44,
              borderRadius: "50%",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>
          <button
            onClick={() => goTo((current + 1) % slides.length)}
            aria-label="Siguiente slide"
            className="hidden md:flex"
            style={{
              position: "absolute",
              right: "1.5rem",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              background: "rgba(13,16,8,0.4)",
              border: "1px solid rgba(228,215,184,0.2)",
              color: "var(--sh-cream)",
              width: 44,
              height: 44,
              borderRadius: "50%",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
