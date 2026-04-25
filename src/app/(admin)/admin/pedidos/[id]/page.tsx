import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { HistorialCambios } from "@/components/admin/historial-cambios";
import { formatCOP } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CambiarEstadoPedido } from "@/components/admin/cambiar-estado-pedido";

export const metadata: Metadata = { title: "Pedido · Admin" };

const estadoLabel: Record<string, string> = {
  pendiente_whatsapp: "Pendiente WhatsApp",
  confirmado: "Confirmado",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export default async function PedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pedido } = await supabase
    .from("pedidos")
    .select(
      `id, numero_orden, cliente_nombre, cliente_telefono, cliente_email,
       direccion_entrega, metodo_pago, estado, total, notas, created_at,
       pedido_items (
         id, cantidad, precio_unitario, subtotal,
         productos:producto_id ( nombre ),
         producto_variantes:variante_id ( nombre )
       )`,
    )
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!pedido) notFound();

  type PedidoConItems = typeof pedido & {
    pedido_items: {
      id: string;
      cantidad: number;
      precio_unitario: number;
      subtotal: number;
      productos: { nombre: string } | null;
      producto_variantes: { nombre: string } | null;
    }[];
  };

  const p = pedido as PedidoConItems;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">Pedido</p>
          <h1 className="text-2xl font-bold font-mono">#{p.numero_orden}</h1>
          <p className="text-sm text-zinc-500">
            {new Date(p.created_at).toLocaleDateString("es-CO", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Badge className="text-sm">{estadoLabel[p.estado] ?? p.estado}</Badge>
      </div>

      <CambiarEstadoPedido pedidoId={p.id} estadoActual={p.estado} />

      <Separator />

      <section>
        <h2 className="mb-3 font-semibold">Cliente</h2>
        <dl className="space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="w-32 text-zinc-500">Nombre</dt>
            <dd>{p.cliente_nombre}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-32 text-zinc-500">Teléfono</dt>
            <dd>
              <a
                href={`https://wa.me/${p.cliente_telefono}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 underline dark:text-green-400"
              >
                {p.cliente_telefono}
              </a>
            </dd>
          </div>
          {p.cliente_email && (
            <div className="flex gap-2">
              <dt className="w-32 text-zinc-500">Email</dt>
              <dd>{p.cliente_email}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="w-32 text-zinc-500">Método de pago</dt>
            <dd className="capitalize">{p.metodo_pago}</dd>
          </div>
          {p.direccion_entrega && (
            <div className="flex gap-2">
              <dt className="w-32 text-zinc-500">Dirección</dt>
              <dd>{p.direccion_entrega}</dd>
            </div>
          )}
        </dl>
      </section>

      <Separator />

      <section>
        <h2 className="mb-3 font-semibold">Productos</h2>
        <ul className="divide-y rounded-lg border">
          {(p.pedido_items ?? []).map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="font-medium">{item.productos?.nombre ?? "—"}</p>
                <p className="text-sm text-zinc-500">
                  {item.producto_variantes?.nombre} · x{item.cantidad} · {formatCOP(item.precio_unitario)} c/u
                </p>
              </div>
              <p className="font-semibold flex-shrink-0">{formatCOP(item.subtotal)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between text-lg font-bold px-1">
          <span>Total</span>
          <span>{formatCOP(p.total)}</span>
        </div>
      </section>

      {p.notas && (
        <>
          <Separator />
          <section>
            <h2 className="mb-2 font-semibold">Notas</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{p.notas}</p>
          </section>
        </>
      )}

      <Separator />

      <section>
        <h2 className="mb-4 font-semibold">Historial de cambios</h2>
        <Suspense fallback={<p className="text-sm text-zinc-400">Cargando historial...</p>}>
          <HistorialCambios entidad="pedidos" entidadId={id} />
        </Suspense>
      </section>
    </div>
  );
}
