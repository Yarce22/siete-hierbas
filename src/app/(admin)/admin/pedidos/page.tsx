import type { Metadata } from "next";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatCOP } from "@/lib/format";

export const metadata: Metadata = { title: "Pedidos · Admin" };

const estadoLabel: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pendiente_whatsapp: { label: "Pendiente WhatsApp", variant: "outline" },
  confirmado: { label: "Confirmado", variant: "secondary" },
  en_camino: { label: "En camino", variant: "default" },
  entregado: { label: "Entregado", variant: "secondary" },
  cancelado: { label: "Cancelado", variant: "destructive" },
};

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("pedidos")
    .select("id, numero_orden, cliente_nombre, cliente_telefono, estado, total, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  type EstadoPedido = "pendiente_whatsapp" | "confirmado" | "en_camino" | "entregado" | "cancelado";
  if (estado) query = query.eq("estado", estado as EstadoPedido);

  const { data: pedidos } = await query;

  const estados = ["pendiente_whatsapp", "confirmado", "en_camino", "entregado", "cancelado"];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <p className="text-sm text-zinc-500">{pedidos?.length ?? 0} pedido{pedidos?.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/pedidos"
          className={`rounded-full border px-3 py-1 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${!estado ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 dark:border-zinc-800"}`}
        >
          Todos
        </Link>
        {estados.map((e) => (
          <Link
            key={e}
            href={`/admin/pedidos?estado=${e}`}
            className={`rounded-full border px-3 py-1 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${estado === e ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 dark:border-zinc-800"}`}
          >
            {estadoLabel[e]?.label ?? e}
          </Link>
        ))}
      </div>

      {(!pedidos || pedidos.length === 0) ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-zinc-500">
          <p className="font-medium">No hay pedidos{estado ? ` con estado "${estadoLabel[estado]?.label}"` : ""}.</p>
        </div>
      ) : (
        <ul className="divide-y rounded-lg border">
          {pedidos.map((p) => {
            const info = estadoLabel[p.estado];
            return (
              <li key={p.id}>
                <Link
                  href={`/admin/pedidos/${p.id}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">#{p.numero_orden}</span>
                      <Badge variant={info?.variant ?? "outline"} className="text-xs">
                        {info?.label ?? p.estado}
                      </Badge>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-zinc-600 dark:text-zinc-400">
                      {p.cliente_nombre} · {p.cliente_telefono}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="font-semibold">{formatCOP(p.total)}</p>
                    <p className="text-xs text-zinc-500">
                      {new Date(p.created_at).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
