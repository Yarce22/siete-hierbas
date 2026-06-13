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

export function InfoBarTab({ config }: { config: SiteConfig }) {
  const router = useRouter();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

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

  const visible = watch("info_bar_visible");

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
          <CardTitle className="text-base">Barra de anuncios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="info_bar_texto">Texto del anuncio</Label>
            <Input
              id="info_bar_texto"
              maxLength={200}
              placeholder="Ej: Envíos gratis a todo el país esta semana"
              {...register("info_bar_texto")}
            />
            {errors.info_bar_texto && (
              <p className="text-xs text-red-500">{errors.info_bar_texto.message}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="info_bar_visible"
              checked={visible}
              onChange={(e) => setValue("info_bar_visible", e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300"
            />
            <Label htmlFor="info_bar_visible" className="cursor-pointer">
              Mostrar barra en el sitio
            </Label>
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
