import { z } from "zod";

export const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  descripcion: z.string().optional(),
  categoria_id: z.string().uuid().optional().or(z.literal("")),
  destacado: z.coerce.boolean().default(false),
});

export const varianteSchema = z.object({
  nombre: z.string().min(1),
  precio: z.coerce.number().int().min(0),
  stock: z.coerce.number().int().min(0).default(0),
  stock_minimo: z.coerce.number().int().min(0).default(5),
  sku: z.string().optional().or(z.literal("")),
});
