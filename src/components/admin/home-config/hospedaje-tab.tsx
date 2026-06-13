"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateSiteConfig } from "@/lib/actions/site-config";
import { siteConfigSchema, type SiteConfigInput } from "@/lib/validators/site-config";
import type { SiteConfig } from "@/lib/queries/site-config";

import { Feedback } from "./feedback";

export function HospedajeTab({ config }: { config: SiteConfig }) {
  const router = useRouter();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [caracteristicasText, setCaracteristicasText] = useState(
    config.hostal_caracteristicas.join("\n"),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SiteConfigInput>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: config as SiteConfigInput,
  });

  const onSubmit = async (data: SiteConfigInput) => {
    setLoading(true);
    const hostal_caracteristicas = caracteristicasText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const result = await updateSiteConfig({ ...data, hostal_caracteristicas });
    setStatus({ ok: result.ok, message: result.ok ? "Guardado correctamente." : (result.error ?? "Error al guardar.") });
    if (result.ok) router.refresh();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sección "El Hospedaje"</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Eyebrow (etiqueta pequeña)</Label>
              <Input placeholder="El Hospedaje" {...register("hostal_subtitulo")} />
              {errors.hostal_subtitulo && <p className="text-xs text-red-500">{errors.hostal_subtitulo.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Título principal</Label>
              <Input placeholder="Descanso entre hierba y montaña" {...register("hostal_titulo")} />
              {errors.hostal_titulo && <p className="text-xs text-red-500">{errors.hostal_titulo.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Párrafo descriptivo</Label>
            <textarea
              rows={4}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
              {...register("hostal_parrafo")}
            />
            {errors.hostal_parrafo && <p className="text-xs text-red-500">{errors.hostal_parrafo.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Características (una por línea, máx. 8)</Label>
            <textarea
              rows={6}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
              value={caracteristicasText}
              onChange={(e) => setCaracteristicasText(e.target.value)}
            />
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
