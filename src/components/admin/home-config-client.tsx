"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  updateSiteConfig,
  createHeroSlide,
  deleteHeroSlide,
} from "@/lib/actions/site-config";
import {
  siteConfigSchema,
  heroSlideSchema,
  type SiteConfigInput,
  type HeroSlideInput,
} from "@/lib/validators/site-config";
import type { SiteConfig, HeroSlide } from "@/lib/queries/site-config";

type Props = {
  config: SiteConfig;
  slides: HeroSlide[];
};

function Feedback({ ok, message }: { ok: boolean; message: string }) {
  return (
    <p className={`mt-2 text-sm ${ok ? "text-green-600" : "text-red-600"}`}>
      {message}
    </p>
  );
}

function InfoBarTab({ config }: { config: SiteConfig }) {
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

function HeroTab({ slides: initialSlides }: { slides: HeroSlide[] }) {
  const [slides, setSlides] = useState(initialSlides);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HeroSlideInput>({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: { titulo: "", subtitulo: "", boton_texto: "Explorar", boton_link: "/tienda", orden: slides.length },
  });

  const onAdd = async (data: HeroSlideInput) => {
    setLoading(true);
    const result = await createHeroSlide(data);
    if (result.ok) {
      setSlides((prev) => [
        ...prev,
        { id: crypto.randomUUID(), ...data, subtitulo: data.subtitulo ?? null },
      ]);
      reset({ titulo: "", subtitulo: "", boton_texto: "Explorar", boton_link: "/tienda", orden: slides.length + 1 });
      setStatus({ ok: true, message: "Slide agregado. Recargá la página para ver el preview." });
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
                <li key={s.id} className="flex items-center gap-3 rounded-lg border p-3">
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
                    onClick={() => onDelete(s.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
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
              <Label>URL de imagen</Label>
              <Input placeholder="https://..." {...register("imagen_url")} />
              {errors.imagen_url && <p className="text-xs text-red-500">{errors.imagen_url.message}</p>}
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
              <Input
                type="number"
                min={0}
                {...register("orden", { valueAsNumber: true })}
              />
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

function HistoriaTab({ config }: { config: SiteConfig }) {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

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
    const result = await updateSiteConfig(data);
    setStatus({ ok: result.ok, message: result.ok ? "Guardado correctamente." : (result.error ?? "Error al guardar.") });
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
            <Label>URL de imagen (opcional)</Label>
            <Input placeholder="https://..." {...register("historia_imagen_url")} />
            {errors.historia_imagen_url && <p className="text-xs text-red-500">{errors.historia_imagen_url.message}</p>}
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

function HospedajeTab({ config }: { config: SiteConfig }) {
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

function PopupTab({ config }: { config: SiteConfig }) {
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

  const activo = watch("popup_activo");

  const onSubmit = async (data: SiteConfigInput) => {
    setLoading(true);
    const result = await updateSiteConfig(data);
    setStatus({ ok: result.ok, message: result.ok ? "Guardado correctamente." : (result.error ?? "Error al guardar.") });
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
            <Label htmlFor="popup_imagen_url">URL de la imagen</Label>
            <Input
              id="popup_imagen_url"
              placeholder="https://..."
              {...register("popup_imagen_url")}
            />
            {errors.popup_imagen_url && (
              <p className="text-xs text-red-500">{errors.popup_imagen_url.message as string}</p>
            )}
            <p className="text-xs text-zinc-400">Imagen que se mostrará en el popup. Recomendado: formato cuadrado o vertical.</p>
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

const ICON_OPTIONS = ["leaf", "flower", "drop", "moon", "sun", "shield", "heart", "star"];

function PorQueTab({ config }: { config: SiteConfig }) {
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "por_que_cards",
  });

  const onSubmit = async (data: SiteConfigInput) => {
    setLoading(true);
    const result = await updateSiteConfig(data);
    setStatus({ ok: result.ok, message: result.ok ? "Guardado correctamente." : (result.error ?? "Error al guardar.") });
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

export function HomeConfigClient({ config, slides }: Props) {
  return (
    <Tabs defaultValue="info-bar">
      <TabsList className="mb-6">
        <TabsTrigger value="info-bar">Barra de anuncios</TabsTrigger>
        <TabsTrigger value="hero">Hero (slider)</TabsTrigger>
        <TabsTrigger value="historia">Nuestra historia</TabsTrigger>
        <TabsTrigger value="hospedaje">El Hospedaje</TabsTrigger>
        <TabsTrigger value="por-que">¿Por qué elegirnos?</TabsTrigger>
        <TabsTrigger value="popup">Popup</TabsTrigger>
      </TabsList>

      <TabsContent value="info-bar">
        <InfoBarTab config={config} />
      </TabsContent>

      <TabsContent value="hero">
        <HeroTab slides={slides} />
      </TabsContent>

      <TabsContent value="historia">
        <HistoriaTab config={config} />
      </TabsContent>

      <TabsContent value="hospedaje">
        <HospedajeTab config={config} />
      </TabsContent>

      <TabsContent value="por-que">
        <PorQueTab config={config} />
      </TabsContent>

      <TabsContent value="popup">
        <PopupTab config={config} />
      </TabsContent>
    </Tabs>
  );
}
