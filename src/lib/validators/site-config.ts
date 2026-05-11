import { z } from "zod";

export const porQueCardSchema = z.object({
  icono: z.string().min(1),
  titulo: z.string().min(1).max(80),
  descripcion: z.string().min(1).max(300),
});

export const siteConfigSchema = z.object({
  info_bar_texto: z.string().max(200),
  info_bar_visible: z.boolean(),
  historia_titulo: z.string().min(1).max(120),
  historia_subtitulo: z.string().min(1).max(80),
  historia_parrafo1: z.string().min(1).max(900),
  historia_parrafo2: z.string().min(1).max(900),
  historia_imagen_url: z.string().url("URL inválida").nullable().optional(),
  hostal_titulo: z.string().min(1).max(120),
  hostal_subtitulo: z.string().min(1).max(80),
  hostal_parrafo: z.string().min(1).max(900),
  hostal_caracteristicas: z.array(z.string().min(1)).min(1).max(8),
  por_que_titulo: z.string().min(1).max(120),
  por_que_subtitulo: z.string().min(1).max(80),
  por_que_cards: z.array(porQueCardSchema).min(1).max(6),
  popup_activo: z.boolean(),
  popup_imagen_url: z.preprocess(
    (v) => (v === "" ? null : v),
    z.string().url("URL de imagen inválida").nullable(),
  ),
  popup_link: z.string().max(500),
});

export const heroSlideSchema = z.object({
  imagen_url: z.string().url("URL de imagen inválida"),
  titulo: z.string().max(120),
  subtitulo: z.string().max(250).nullable().optional(),
  boton_texto: z.string().min(1).max(50),
  boton_link: z.string().min(1).max(250),
  orden: z.number().int().min(0),
});

export type SiteConfigInput = z.infer<typeof siteConfigSchema>;
export type HeroSlideInput = z.infer<typeof heroSlideSchema>;
