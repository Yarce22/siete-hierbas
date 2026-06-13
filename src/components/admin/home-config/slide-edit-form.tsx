"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { actualizarHeroSlideConImagen } from "@/lib/actions/site-config";
import { heroSlideFormSchema, type HeroSlideFormInput } from "@/lib/validators/site-config";
import type { HeroSlide } from "@/lib/queries/site-config";

type Props = {
  slide: HeroSlide;
  onSaved: (updated: HeroSlide) => void;
  onCancel: () => void;
};

export function SlideEditForm({ slide, onSaved, onCancel }: Props) {
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(slide.imagen_url);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<HeroSlideFormInput>({
    resolver: zodResolver(heroSlideFormSchema),
    defaultValues: {
      titulo: slide.titulo,
      subtitulo: slide.subtitulo ?? "",
      boton_texto: slide.boton_texto,
      boton_link: slide.boton_link,
      orden: slide.orden,
    },
  });

  const onSubmit = async (data: HeroSlideFormInput) => {
    setSaving(true);
    setEditError(null);
    const fd = new FormData();
    const file = fileRef.current?.files?.[0];
    if (file) fd.append("imagen", file);
    fd.append("imagen_url_actual", slide.imagen_url);
    fd.append("titulo", data.titulo);
    fd.append("subtitulo", data.subtitulo ?? "");
    fd.append("boton_texto", data.boton_texto);
    fd.append("boton_link", data.boton_link);
    fd.append("orden", String(data.orden));
    const result = await actualizarHeroSlideConImagen(slide.id, fd);
    if (result.ok) {
      onSaved({
        ...slide,
        imagen_url: file && preview ? preview : slide.imagen_url,
        ...data,
        subtitulo: data.subtitulo ?? null,
      });
    } else {
      setEditError(result.error ?? "Error al guardar.");
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-3 rounded-lg border bg-zinc-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Editar slide</p>
      <div className="space-y-1.5">
        <Label className="text-xs">Nueva imagen (opcional)</Label>
        {preview && (
          <div className="h-20 w-32 overflow-hidden rounded border bg-zinc-100">
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          </div>
        )}
        <Input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setPreview(URL.createObjectURL(f));
          }}
        />
        <p className="text-xs text-zinc-400">Dejá vacío para mantener la imagen actual.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Título</Label>
          <Input {...register("titulo")} />
          {errors.titulo && <p className="text-xs text-red-500">{errors.titulo.message}</p>}
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Subtítulo</Label>
          <Input {...register("subtitulo")} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Texto del botón</Label>
          <Input {...register("boton_texto")} />
          {errors.boton_texto && <p className="text-xs text-red-500">{errors.boton_texto.message}</p>}
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Link del botón</Label>
          <Input {...register("boton_link")} />
          {errors.boton_link && <p className="text-xs text-red-500">{errors.boton_link.message}</p>}
        </div>
      </div>
      <div className="w-28 space-y-1">
        <Label className="text-xs">Orden</Label>
        <Input type="number" min={0} {...register("orden", { valueAsNumber: true })} />
      </div>
      {editError && <p className="text-xs text-red-500">{editError}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
