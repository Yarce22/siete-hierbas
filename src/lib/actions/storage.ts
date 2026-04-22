"use server";

import { createClient } from "@/lib/supabase/server";

type Bucket = "productos" | "habitaciones";

export async function subirImagen(
  bucket: Bucket,
  entidadId: string,
  file: File,
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${entidadId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: false });

  if (uploadError) return { error: "Error al subir la imagen." };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function eliminarImagen(
  bucket: Bucket,
  url: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();

  // Extract path from public URL
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return { error: "URL inválida." };
  const path = url.slice(idx + marker.length);

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) return { error: "Error al eliminar la imagen." };
  return {};
}
