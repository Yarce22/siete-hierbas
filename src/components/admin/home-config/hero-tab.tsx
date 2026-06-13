"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { crearHeroSlideConImagen, deleteHeroSlide } from "@/lib/actions/site-config";
import { heroSlideFormSchema, type HeroSlideFormInput } from "@/lib/validators/site-config";
import type { HeroSlide } from "@/lib/queries/site-config";

import { Feedback } from "./feedback";
import { SlideEditForm } from "./slide-edit-form";

export function HeroTab({ slides: initialSlides }: { slides: HeroSlide[] }) {
  const [slides, setSlides] = useState(initialSlides);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HeroSlideFormInput>({
    resolver: zodResolver(heroSlideFormSchema),
    defaultValues: { titulo: "", subtitulo: "", boton_texto: "Explorar", boton_link: "/tienda", orden: slides.length },
  });

  const onAdd = async (data: HeroSlideFormInput) => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setStatus({ ok: false, message: "Seleccioná una imagen para el slide." });
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append("imagen", file);
    fd.append("titulo", data.titulo);
    fd.append("subtitulo", data.subtitulo ?? "");
    fd.append("boton_texto", data.boton_texto);
    fd.append("boton_link", data.boton_link);
    fd.append("orden", String(data.orden));
    const result = await crearHeroSlideConImagen(fd);
    if (result.ok) {
      setSlides((prev) => [
        ...prev,
        { id: crypto.randomUUID(), imagen_url: preview ?? "", ...data, subtitulo: data.subtitulo ?? null },
      ]);
      reset({ titulo: "", subtitulo: "", boton_texto: "Explorar", boton_link: "/tienda", orden: slides.length + 1 });
      if (fileRef.current) fileRef.current.value = "";
      setPreview(null);
      setStatus({ ok: true, message: "Slide agregado." });
    } else {
      setStatus({ ok: false, message: result.error ?? "Error al agregar." });
    }
    setLoading(false);
  };

  const onDelete = async (id: string) => {
    const result = await deleteHeroSlide(id);
    if (result.ok) {
      setSlides((prev) => prev.filter((s) => s.id !== id));
    } else {
      setStatus({ ok: false, message: result.error ?? "Error al eliminar." });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Slides actuales</CardTitle>
        </CardHeader>
        <CardContent>
          {slides.length === 0 ? (
            <p className="text-sm text-zinc-500">No hay slides. Se mostrará el hero estático por defecto.</p>
          ) : (
            <ul className="space-y-3">
              {slides.map((s) => (
                <li key={s.id} className="rounded-lg border">
                  <div className="flex items-center gap-3 p-3">
                    <div className="h-12 w-20 flex-shrink-0 overflow-hidden rounded bg-zinc-100">
                      <img src={s.imagen_url} alt={s.titulo} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{s.titulo || "(sin título)"}</p>
                      <p className="truncate text-xs text-zinc-500">{s.boton_texto} → {s.boton_link}</p>
                    </div>
                    <span className="text-xs text-zinc-400">#{s.orden}</span>
                    <button
                      type="button"
                      onClick={() => setEditingId(s.id)}
                      className="text-xs text-zinc-600 hover:text-zinc-900"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(s.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                  {editingId === s.id && (
                    <div className="px-3 pb-3">
                      <SlideEditForm
                        slide={s}
                        onSaved={(updated) => {
                          setSlides((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
                          setEditingId(null);
                        }}
                        onCancel={() => setEditingId(null)}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Agregar slide</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Imagen del slide</Label>
              <Input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setPreview(f ? URL.createObjectURL(f) : null);
                }}
              />
              {preview && (
                <div className="h-28 w-full overflow-hidden rounded-lg border bg-zinc-100">
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Título</Label>
                <Input placeholder="Plantas que sanan" {...register("titulo")} />
                {errors.titulo && <p className="text-xs text-red-500">{errors.titulo.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Subtítulo (opcional)</Label>
                <Input placeholder="Descripción breve" {...register("subtitulo")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Texto del botón</Label>
                <Input placeholder="Explorar tienda" {...register("boton_texto")} />
                {errors.boton_texto && <p className="text-xs text-red-500">{errors.boton_texto.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Link del botón</Label>
                <Input placeholder="/tienda" {...register("boton_link")} />
                {errors.boton_link && <p className="text-xs text-red-500">{errors.boton_link.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5 w-32">
              <Label>Orden</Label>
              <Input type="number" min={0} {...register("orden", { valueAsNumber: true })} />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Agregando..." : "Agregar slide"}
            </Button>
            {status && <Feedback {...status} />}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
