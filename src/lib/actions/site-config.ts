"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { siteConfigSchema, heroSlideSchema } from "@/lib/validators/site-config";

const CONFIG_ID = "00000000-0000-0000-0000-000000000001";

export async function updateSiteConfig(data: unknown): Promise<{ ok: boolean; error?: string }> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { ok: false, error: authError ?? "Sin permisos" };

  const parsed = siteConfigSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("site_config")
    .update(parsed.data)
    .eq("id", CONFIG_ID);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/home");
  return { ok: true };
}

export async function createHeroSlide(data: unknown): Promise<{ ok: boolean; error?: string }> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { ok: false, error: authError ?? "Sin permisos" };

  const parsed = heroSlideSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const { error } = await supabase.from("hero_slides").insert({
    imagen_url: parsed.data.imagen_url,
    titulo: parsed.data.titulo,
    subtitulo: parsed.data.subtitulo ?? null,
    boton_texto: parsed.data.boton_texto,
    boton_link: parsed.data.boton_link,
    orden: parsed.data.orden,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/home");
  return { ok: true };
}

export async function updateHeroSlide(id: string, data: unknown): Promise<{ ok: boolean; error?: string }> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { ok: false, error: authError ?? "Sin permisos" };

  const parsed = heroSlideSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("hero_slides")
    .update({
      imagen_url: parsed.data.imagen_url,
      titulo: parsed.data.titulo,
      subtitulo: parsed.data.subtitulo ?? null,
      boton_texto: parsed.data.boton_texto,
      boton_link: parsed.data.boton_link,
      orden: parsed.data.orden,
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/home");
  return { ok: true };
}

export async function deleteHeroSlide(id: string): Promise<{ ok: boolean; error?: string }> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { ok: false, error: authError ?? "Sin permisos" };

  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/home");
  return { ok: true };
}
