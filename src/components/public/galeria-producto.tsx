"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Imagen = { url: string; alt: string | null };

export function GaleriaProducto({ imagenes }: { imagenes: Imagen[] }) {
  const [principal, setPrincipal] = useState(0);

  if (imagenes.length === 0) {
    return (
      <div className="aspect-square w-full rounded-xl bg-zinc-100 flex items-center justify-center text-sm text-zinc-400 dark:bg-zinc-900">
        Sin imágenes
      </div>
    );
  }

  const actual = imagenes[principal];

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={actual.url}
          alt={actual.alt ?? "Foto del producto"}
          className="size-full object-cover"
        />
      </div>

      {imagenes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imagenes.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setPrincipal(i)}
              className={cn(
                "size-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                i === principal
                  ? "border-zinc-900 dark:border-zinc-100"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt ?? `Foto ${i + 1}`}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
