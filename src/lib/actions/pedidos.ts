"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type EstadoPedido = Database["public"]["Enums"]["estado_pedido"];

const crearPedidoSchema = z.object({
  clienteNombre: z.string().min(2, "Ingresá tu nombre completo"),
  clienteTelefono: z.string().min(7, "Ingresá un número de WhatsApp válido"),
  metodoPago: z.enum(["efectivo", "transferencia"]),
  notas: z.string().optional(),
  lines: z
    .array(
      z.object({
        productoId: z.string().min(1),
        varianteId: z.string().min(1),
        cantidad: z.number().int().min(1),
        precio: z.number().positive(),
      }),
    )
    .min(1),
});

export type CrearPedidoInput = z.infer<typeof crearPedidoSchema>;

export async function crearPedido(
  input: CrearPedidoInput,
): Promise<{ success: true; pedidoId: string } | { error: string }> {
  const parsed = crearPedidoSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { clienteNombre, clienteTelefono, metodoPago, notas, lines } =
    parsed.data;
  const total = lines.reduce((sum, l) => sum + l.precio * l.cantidad, 0);

  const supabase = await createClient();

  const { data: pedido, error: pedidoError } = await supabase
    .from("pedidos")
    .insert({
      cliente_nombre: clienteNombre,
      cliente_telefono: clienteTelefono,
      metodo_pago: metodoPago,
      notas: notas ?? null,
      total,
      estado: "pendiente_whatsapp",
    })
    .select("id")
    .single();

  if (pedidoError || !pedido) {
    return { error: "No se pudo registrar el pedido. Intentá de nuevo." };
  }

  const { error: itemsError } = await supabase.from("pedido_items").insert(
    lines.map((l) => ({
      pedido_id: pedido.id,
      producto_id: l.productoId,
      variante_id: l.varianteId,
      cantidad: l.cantidad,
      precio_unitario: l.precio,
      subtotal: l.precio * l.cantidad,
    })),
  );

  if (itemsError) {
    await supabase
      .from("pedidos")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", pedido.id);
    return { error: "Error al registrar los productos. Intentá de nuevo." };
  }

  revalidatePath("/admin/pedidos");
  return { success: true, pedidoId: pedido.id };
}

const estadoSchema = z.enum([
  "pendiente_whatsapp",
  "confirmado",
  "en_camino",
  "entregado",
  "cancelado",
]);

export async function cambiarEstadoPedido(
  pedidoId: string,
  estado: EstadoPedido,
) {
  const parsed = estadoSchema.safeParse(estado);
  if (!parsed.success) return { error: "Estado inválido." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("pedidos")
    .update({ estado: parsed.data })
    .eq("id", pedidoId);

  if (error) return { error: "No se pudo actualizar el estado." };

  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${pedidoId}`);
  return { success: true };
}

export async function eliminarPedido(pedidoId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("pedidos")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", pedidoId);

  if (error) return { error: "No se pudo eliminar el pedido." };

  revalidatePath("/admin/pedidos");
  return { success: true };
}
