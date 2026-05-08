"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  imagenes: string[];
  nombre: string;
  height?: number;
};

export function HostalImageSlider({ imagenes, nombre, height = 550 }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (imagenes.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % imagenes.length);
    }, 3000);
    return () => clearInterval(id);
  }, [imagenes.length]);

  if (imagenes.length === 0) return null;

  return (
    <div style={{ height, position: "relative", background: "var(--sh-dark-3)", overflow: "hidden" }}>
      {imagenes.map((url, i) => (
        <div
          key={url}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          <Image src={url} alt={`${nombre} ${i + 1}`} fill className="object-cover" />
        </div>
      ))}
      {imagenes.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.4rem",
            zIndex: 2,
          }}
        >
          {imagenes.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Imagen ${i + 1}`}
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                background: i === current ? "var(--sh-gold)" : "rgba(228,215,184,0.4)",
                border: "none",
                borderRadius: 3,
                cursor: "pointer",
                transition: "width 0.3s, background 0.3s",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
