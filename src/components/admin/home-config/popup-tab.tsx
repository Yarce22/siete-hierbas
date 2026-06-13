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

export function PopupTab({ config }: { config: SiteConfig }) {
  const router = useRouter();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(config.popup_imagen_url ?? null);
  const imgFileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SiteConfigInput>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: config as SiteConfigInput,
  });

  const activo = watch("popup_activo");

  const handleUploadImagen = async () => {
    const file = imgFileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("imagen", file);
    const result = await subirImagenHome(fd);
    if (result.ok && result.url) {
      setValue("popup_imagen_url", result.url);
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
          <CardTitle className="text-base">Popup de bienvenida</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="popup_activo"
              checked={activo}
              onChange={(e) => setValue("popup_activo", e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300"
            />
            <Label htmlFor="popup_activo" className="cursor-pointer">
              Mostrar popup al entrar a la página principal
            </Label>
          </div>
          <div className="space-y-1.5">
            <Label>Imagen del popup</Label>
            {imagePreview && (
              <div className="mb-2 h-40 w-32 overflow-hidden rounded-lg border bg-zinc-100">
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
            <p className="text-xs text-zinc-400">Recomendado: formato cuadrado o vertical. Subí primero y después guardá.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="popup_link">Link al hacer clic en la imagen</Label>
            <Input
              id="popup_link"
              placeholder="Ej: /tienda o https://..."
              {...register("popup_link")}
            />
            {errors.popup_link && (
              <p className="text-xs text-red-500">{errors.popup_link.message}</p>
            )}
            <p className="text-xs text-zinc-400">Dejá en blanco si no querés que la imagen lleve a ningún lugar.</p>
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
