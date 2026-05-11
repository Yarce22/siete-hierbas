import { createClient } from "@/lib/supabase/server";

export type PorQueCard = {
  icono: string;
  titulo: string;
  descripcion: string;
};

export type SiteConfig = {
  id: string;
  info_bar_texto: string;
  info_bar_visible: boolean;
  historia_titulo: string;
  historia_subtitulo: string;
  historia_parrafo1: string;
  historia_parrafo2: string;
  historia_imagen_url: string | null;
  hostal_titulo: string;
  hostal_subtitulo: string;
  hostal_parrafo: string;
  hostal_caracteristicas: string[];
  por_que_titulo: string;
  por_que_subtitulo: string;
  por_que_cards: PorQueCard[];
  popup_activo: boolean;
  popup_imagen_url: string | null;
  popup_link: string;
};

export type HeroSlide = {
  id: string;
  imagen_url: string;
  titulo: string;
  subtitulo: string | null;
  boton_texto: string;
  boton_link: string;
  orden: number;
};

const CONFIG_ID = "00000000-0000-0000-0000-000000000001";

const DEFAULT_CONFIG: SiteConfig = {
  id: CONFIG_ID,
  info_bar_texto: "",
  info_bar_visible: false,
  historia_titulo: "Doce años cultivando sabiduría vegetal",
  historia_subtitulo: "Nuestra historia",
  historia_parrafo1:
    "Siete Hierbas nació de una pregunta simple: ¿qué sabe el bosque que nosotros hemos olvidado? En 2012, en las faldas de los Andes colombianos, empezamos a cultivar, recolectar y transformar plantas medicinales con el respeto que merecen.",
  historia_parrafo2:
    "Hoy somos herbolaria, hospedaje y escuela de bienestar. Un espacio donde el conocimiento ancestral se encuentra con la sensibilidad contemporánea.",
  historia_imagen_url: null,
  hostal_titulo: "Descanso entre hierba y montaña",
  hostal_subtitulo: "El Hospedaje",
  hostal_parrafo:
    "Nuestro hospedaje boutique es una extensión del jardín. Habitaciones diseñadas para el silencio, con vista a la naturaleza andina, aromaterapia y acceso a termas. Un retiro genuino a minutos del centro de Santa Rosa de Cabal.",
  hostal_caracteristicas: [
    "Desayuno herbal incluido",
    "Acceso a termas cercanas",
    "Aromaterapia y bienestar",
    "Wifi y zonas de descanso",
  ],
  por_que_titulo: "Una experiencia que trasciende",
  por_que_subtitulo: "¿Por qué elegirnos?",
  por_que_cards: [
    { icono: "leaf", titulo: "Cultivo propio y ético", descripcion: "Nuestras plantas se cultivan o recolectan con prácticas agroecológicas, sin pesticidas ni aditivos." },
    { icono: "flower", titulo: "Conocimiento ancestral", descripcion: "Trabajamos con sabedores locales y tradiciones medicinales del Eje Cafetero colombiano." },
    { icono: "drop", titulo: "Elaboración artesanal", descripcion: "Cada tintura, aceite y preparado se elabora en pequeños lotes para garantizar frescura y potencia." },
    { icono: "moon", titulo: "Bienestar integral", descripcion: "El hospedaje ofrece programas de retiro y descanso, no solo una cama: una experiencia completa." },
  ],
  popup_activo: false,
  popup_imagen_url: null,
  popup_link: "",
};

export async function getSiteConfig(): Promise<SiteConfig> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_config")
    .select("*")
    .eq("id", CONFIG_ID)
    .single();
  if (error || !data) return DEFAULT_CONFIG;
  return {
    ...data,
    por_que_cards: (data.por_que_cards as PorQueCard[]) ?? [],
  };
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("id, imagen_url, titulo, subtitulo, boton_texto, boton_link, orden")
    .eq("activo", true)
    .order("orden", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("id, imagen_url, titulo, subtitulo, boton_texto, boton_link, orden")
    .order("orden", { ascending: true });
  if (error) return [];
  return data ?? [];
}
