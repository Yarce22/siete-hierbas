import { z } from "zod";

export const categoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  icono: z.string().optional(),
  orden: z.coerce.number().int().default(0),
});
