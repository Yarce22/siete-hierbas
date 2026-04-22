"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type EstadoReserva = Database["public"]["Enums"]["estado_reserva"];

const estadoSchema = z.enum(["pendiente", "confirmada", "en_curso", "completada", "cancelada"]);

export async function cambiarEstadoReserva(reservaId: string, estado: EstadoReserva) {
  const parsed = estadoSchema.safeParse(estado);
  if (!parsed.success) return { error: "Estado inválido." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("reservas")
    .update({ estado: parsed.data })
    .eq("id", reservaId);

  if (error) return { error: "No se pudo actualizar el estado." };

  revalidatePath("/admin/reservas");
  revalidatePath(`/admin/reservas/${reservaId}`);
  return { success: true };
}
