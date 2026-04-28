export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const MIME_TO_EXT: Record<string, string> = {
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
