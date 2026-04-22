"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { Database } from "@/types/supabase";
import { cambiarEstadoPedido } from "@/lib/actions/pedidos";
import { Button } from "@/components/ui/button";

type Estado = Database["public"]["Enums"]["estado_pedido"];

const transiciones: Record<Estado, Estado[]> = {
  pendiente_whatsapp: ["confirmado", "cancelado"],
  confirmado: ["en_camino", "cancelado"],
  en_camino: ["entregado", "cancelado"],
  entregado: [],
  cancelado: [],
};

const estadoLabel: Record<Estado, string> = {
  pendiente_whatsapp: "Pendiente WhatsApp",
  confirmado: "Confirmado",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export function CambiarEstadoPedido({
  pedidoId,
  estadoActual,
}: {
  pedidoId: string;
  estadoActual: Estado;
}) {
  const [loading, setLoading] = useState<Estado | null>(null);
  const siguientes = transiciones[estadoActual] ?? [];

  if (siguientes.length === 0) return null;

  async function handleCambio(estado: Estado) {
    setLoading(estado);
    const result = await cambiarEstadoPedido(pedidoId, estado);
    setLoading(null);
    if (result.error) toast.error(result.error);
    else toast.success(`Estado actualizado a "${estadoLabel[estado]}"`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {siguientes.map((estado) => (
        <Button
          key={estado}
          variant={estado === "cancelado" ? "destructive" : "default"}
          size="sm"
          disabled={loading !== null}
          onClick={() => handleCambio(estado)}
        >
          {loading === estado ? "Actualizando..." : `Marcar como ${estadoLabel[estado]}`}
        </Button>
      ))}
    </div>
  );
}
