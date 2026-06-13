"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateSiteConfig } from "@/lib/actions/site-config";
import { siteConfigSchema, type SiteConfigInput } from "@/lib/validators/site-config";
import type { SiteConfig } from "@/lib/queries/site-config";

import { Feedback } from "./feedback";

const ICON_OPTIONS = ["leaf", "flower", "drop", "moon", "sun", "shield", "heart", "star"];

export function PorQueTab({ config }: { config: SiteConfig }) {
  const router = useRouter();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SiteConfigInput>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: config as SiteConfigInput,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "por_que_cards" });

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
          <CardTitle className="text-base">Sección "¿Por qué elegirnos?"</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Eyebrow (etiqueta pequeña)</Label>
              <Input placeholder="¿Por qué elegirnos?" {...register("por_que_subtitulo")} />
              {errors.por_que_subtitulo && <p className="text-xs text-red-500">{errors.por_que_subtitulo.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Título principal</Label>
              <Input placeholder="Una experiencia que trasciende" {...register("por_que_titulo")} />
              {errors.por_que_titulo && <p className="text-xs text-red-500">{errors.por_que_titulo.message}</p>}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-700">Tarjetas</p>
            {fields.map((field, i) => (
              <div key={field.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500">Tarjeta {i + 1}</span>
                  <button type="button" onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-700">
                    Eliminar
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Ícono</Label>
                    <select
                      className="w-full rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-sm focus:outline-none"
                      {...register(`por_que_cards.${i}.icono`)}
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Título</Label>
                    <Input placeholder="Cultivo propio y ético" {...register(`por_que_cards.${i}.titulo`)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Descripción</Label>
                  <textarea
                    rows={2}
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
                    {...register(`por_que_cards.${i}.descripcion`)}
                  />
                </div>
              </div>
            ))}
            {fields.length < 6 && (
              <button
                type="button"
                onClick={() => append({ icono: "leaf", titulo: "", descripcion: "" })}
                className="text-sm text-zinc-600 hover:text-zinc-900 underline"
              >
                + Agregar tarjeta
              </button>
            )}
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
