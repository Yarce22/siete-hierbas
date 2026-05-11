"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

type Props = {
  imagenUrl: string;
  link: string;
};

export function PopupPromo({ imagenUrl, link }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  const isExternal = link.startsWith("http://") || link.startsWith("https://");
  const hasLink = link.trim().length > 0;

  const imageEl = (
    <img
      src={imagenUrl}
      alt="Promoción"
      style={{ width: "100%", display: "block", cursor: hasLink ? "pointer" : "default" }}
    />
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(0,0,0,0.72)",
      }}
      onClick={() => setVisible(false)}
    >
      <div
        style={{ position: "relative", maxWidth: 480, width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setVisible(false)}
          aria-label="Cerrar"
          style={{
            position: "absolute",
            top: -14,
            right: -14,
            zIndex: 10,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--sh-dark, #0d1008)",
            border: "1px solid rgba(228,215,184,0.25)",
            color: "var(--sh-cream, #e4d7b8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <X size={14} />
        </button>

        {hasLink ? (
          isExternal ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setVisible(false)}
            >
              {imageEl}
            </a>
          ) : (
            <Link href={link} onClick={() => setVisible(false)}>
              {imageEl}
            </Link>
          )
        ) : (
          imageEl
        )}
      </div>
    </div>
  );
}
