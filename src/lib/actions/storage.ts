"use server";

import { createClient } from "@/lib/supabase/server";

type Bucket = "productos" | "habitaciones";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function validateImageFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) return "La imagen no puede superar 10 MB.";
  if (!ALLOWED_MIME_TYPES.has(file.type))
    return "Tipo de archivo no permitido. Solo JPEG, PNG, WebP o GIF.";
  return null;
}

export async function subirImagen(
  bucket: Bucket,
  entidadId: string,
  file: File,
): Promise<{ url: string } | { error: string }> {
  const validationError = validateImageFile(file);
  if (validationError) return { error: validationError };

  const supabase = await createClient();

  const ext = MIME_TO_EXT[file.type] ?? "jpg";
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

  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return { error: "URL inválida." };
  const path = url.slice(idx + marker.length);

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) return { error: "Error al eliminar la imagen." };
  return {};
}
