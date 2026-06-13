"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateSiteConfig, subirImagenHome } from "@/lib/actions/site-config";
import { siteConfigSchema, type SiteConfigInput } from "@/lib/validators/site-config";
import type { SiteConfig } from "@/lib/queries/site-config";

import { Feedback } from "./feedback";

export function HistoriaTab({ config }: { config: SiteConfig }) {
  const router = useRouter();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(config.historia_imagen_url ?? null);
  const imgFileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SiteConfigInput>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: config as SiteConfigInput,
  });

  const handleUploadImagen = async () => {
    const file = imgFileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("imagen", file);
    const result = await subirImagenHome(fd);
    if (result.ok && result.url) {
      setValue("historia_imagen_url", result.url);
      setImagePreview(result.url);
    } else {
      setUploadError(result.error ?? "Error al subir.");
    }
    setUploading(false);
  };

  const onSubmit = async (data: SiteConfigInput) => {
    setLoading(true);
    const result = await updateSiteConfig(data);
    setStatus({ ok: result.ok, message: result.ok ? "Guardado correctamente." : (result.error ?? "Error al guardar.") });
    if (result.ok) router.refresh();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sección "Nuestra historia"</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Eyebrow (etiqueta pequeña)</Label>
              <Input placeholder="Nuestra historia" {...register("historia_subtitulo")} />
              {errors.historia_subtitulo && <p className="text-xs text-red-500">{errors.historia_subtitulo.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Título principal</Label>
              <Input placeholder="Doce años cultivando sabiduría vegetal" {...register("historia_titulo")} />
              {errors.historia_titulo && <p className="text-xs text-red-500">{errors.historia_titulo.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Párrafo 1</Label>
            <textarea
              rows={4}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
              {...register("historia_parrafo1")}
            />
            {errors.historia_parrafo1 && <p className="text-xs text-red-500">{errors.historia_parrafo1.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Párrafo 2</Label>
            <textarea
              rows={4}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
              {...register("historia_parrafo2")}
            />
            {errors.historia_parrafo2 && <p className="text-xs text-red-500">{errors.historia_parrafo2.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Imagen de la sección (opcional)</Label>
            {imagePreview && (
              <div className="mb-2 h-32 w-48 overflow-hidden rounded-lg border bg-zinc-100">
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Input
                ref={imgFileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setImagePreview(URL.createObjectURL(f));
                }}
              />
              <Button type="button" size="sm" variant="outline" disabled={uploading} onClick={handleUploadImagen}>
                {uploading ? "Subiendo..." : "Subir"}
              </Button>
            </div>
            {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
            <p className="text-xs text-zinc-400">Subí la imagen primero y después guardá el formulario.</p>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
          {status && <Feedback {...status} />}
        </CardContent>
      </Card>
    </form>
  );
}
