"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Imagen = { id: string; url: string; alt_text: string | null; orden: number };

type Props = {
  imagenes: Imagen[];
  onAgregar: (fd: FormData) => Promise<{ error?: string; success?: boolean }>;
  onEliminar: (id: string, url: string) => Promise<{ error?: string }>;
};

export function ImagenesAdmin({ imagenes, onAgregar, onEliminar }: Props) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubir(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const result = await onAgregar(new FormData(e.currentTarget));
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Imagen agregada");
      formRef.current?.reset();
      setPreview(null);
    }
  }

  async function handleEliminar(img: Imagen) {
    if (!confirm("¿Eliminar esta imagen?")) return;
    const result = await onEliminar(img.id, img.url);
    if (result.error) toast.error(result.error);
    else toast.success("Imagen eliminada");
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Imágenes</h2>
        <p className="text-sm text-zinc-500">
          La primera imagen es la principal que aparece en el catálogo.
        </p>
      </div>

      {imagenes.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {imagenes.map((img, i) => (
            <div key={img.id} className="group relative">
              <div className="aspect-square overflow-hidden rounded-lg border bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt_text ?? `Imagen ${i + 1}`}
                  className="size-full object-cover"
                />
              </div>
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-zinc-900/70 px-1.5 py-0.5 text-xs text-white">
                  Principal
                </span>
              )}
              <button
                type="button"
                onClick={() => handleEliminar(img)}
                className="absolute right-1 top-1 hidden rounded bg-red-600 p-1 text-white group-hover:flex"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubir} className="space-y-3 rounded-lg border p-4">
        <p className="text-sm font-medium">Subir imagen</p>

        <div className="space-y-1">
          <Label htmlFor="img-file">Archivo</Label>
          <Input
            id="img-file"
            name="imagen"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
        </div>

        {preview && (
          <div className="size-20 overflow-hidden rounded-lg border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="size-full object-cover" />
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="img-alt">
            Texto alternativo{" "}
            <span className="text-xs text-zinc-500">(descripción para accesibilidad)</span>
          </Label>
          <Input
            id="img-alt"
            name="alt_text"
            placeholder="Aceite de lavanda en frasco ámbar"
          />
        </div>

        <Button type="submit" size="sm" disabled={loading}>
          <ImagePlus className="mr-2 size-4" />
          {loading ? "Subiendo..." : "Subir imagen"}
        </Button>
      </form>
    </section>
  );
}
