import { z } from "zod";

export const habitacionSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  tipo: z.string().min(1, "El tipo es requerido"),
  capacidad: z.coerce.number().int().min(1),
  precio_noche: z.coerce.number().int().min(0),
  descripcion: z.string().optional(),
  amenidades: z.string().optional(),
  destacada: z.coerce.boolean().default(false),
});
