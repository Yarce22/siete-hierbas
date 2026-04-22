"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type EstadoPedido = Database["public"]["Enums"]["estado_pedido"];

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
