"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/components/public/cart-provider";
import { formatCOP } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { crearPedido } from "@/lib/actions/pedidos";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function CheckoutClient() {
  const { lines, remove, setCantidad, totalCOP, clear } = useCart();

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [metodoPago, setMetodoPago] = useState<"transferencia" | "efectivo">(
    "transferencia",
  );
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);

  const formValid = nombre.trim().length >= 2 && telefono.trim().length >= 7;

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-24 text-center">
        <p className="text-2xl font-semibold">El carrito está vacío</p>
        <p className="text-zinc-500">
          Explora nuestro catálogo y encuentra algo que te guste.
        </p>
        <Button asChild>
          <Link href="/tienda">Ver productos</Link>
        </Button>
      </div>
    );
  }

  const whatsappUrl = buildWhatsAppUrl(lines);

  async function handlePedir() {
    if (!formValid || loading) return;
    setLoading(true);

    const result = await crearPedido({
      clienteNombre: nombre.trim(),
      clienteTelefono: telefono.trim(),
      metodoPago,
      notas: notas.trim() || undefined,
      lines: lines.map((l) => ({
        productoId: l.productoId,
        varianteId: l.varianteId,
        cantidad: l.cantidad,
        precio: l.precio,
      })),
    });

    setLoading(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    window.open(whatsappUrl, "_blank");
    clear();
  }

  const inputClass =
    "rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-white";

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tu carrito</h1>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-zinc-500 hover:text-red-600 dark:hover:text-red-400"
        >
          Vaciar
        </button>
      </div>

      <Separator className="my-6" />

      <ul className="flex flex-col gap-4">
        {lines.map((line) => (
          <li
            key={line.varianteId}
            className="flex items-start gap-4 rounded-xl border p-4"
          >
            <div className="relative size-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
              {line.imagen ? (
                <Image
                  src={line.imagen}
                  alt={line.productoNombre}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="size-full" />
              )}
            </div>

            <div className="flex flex-1 min-w-0 flex-col gap-1">
              <Link
                href={`/tienda/${line.productoSlug}`}
                className="truncate font-medium leading-tight hover:underline"
              >
                {line.productoNombre}
              </Link>
              <span className="text-sm text-zinc-500">{line.varianteNombre}</span>
              <span className="font-semibold">
                {formatCOP(line.precio * line.cantidad)}
              </span>
            </div>

            <div className="flex flex-shrink-0 items-center gap-1">
              <button
                type="button"
                aria-label="Disminuir cantidad"
                onClick={() => setCantidad(line.varianteId, line.cantidad - 1)}
                className="flex size-7 items-center justify-center rounded-md border hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Minus className="size-3" />
              </button>
              <span className="w-6 text-center text-sm">{line.cantidad}</span>
              <button
                type="button"
                aria-label="Aumentar cantidad"
                onClick={() => setCantidad(line.varianteId, line.cantidad + 1)}
                className="flex size-7 items-center justify-center rounded-md border hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Plus className="size-3" />
              </button>
              <button
                type="button"
                aria-label="Eliminar"
                onClick={() => remove(line.varianteId)}
                className="ml-1 flex size-7 items-center justify-center rounded-md text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Separator className="my-6" />

      <div className="flex items-center justify-between text-lg">
        <span className="font-medium">Total</span>
        <span className="text-2xl font-bold">{formatCOP(totalCOP)}</span>
      </div>

      <Separator className="my-6" />

      {/* ── Datos de contacto ── */}
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold">Tus datos</h2>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="nombre" className="text-sm font-medium">
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="telefono" className="text-sm font-medium">
            WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            id="telefono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="57 310 318 0273"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Método de pago</span>
          <div className="flex gap-2">
            {(["transferencia", "efectivo"] as const).map((op) => (
              <button
                key={op}
                type="button"
                onClick={() => setMetodoPago(op)}
                className={`flex-1 rounded-lg border py-2 text-sm capitalize transition-colors ${
                  metodoPago === op
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                    : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="notas" className="text-sm font-medium">
            Notas{" "}
            <span className="font-normal text-zinc-400">(opcional)</span>
          </label>
          <textarea
            id="notas"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Dirección de entrega, instrucciones especiales..."
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col gap-4">
        <div className="rounded-lg border bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          <p className="font-medium">¿Cómo funciona?</p>
          <p className="mt-1">
            Registramos tu pedido y te abrimos WhatsApp con el detalle listo.
            Coordinamos el pago por transferencia o efectivo contra entrega.
          </p>
        </div>

        <Button
          size="lg"
          className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
          onClick={handlePedir}
          disabled={!formValid || loading}
        >
          <MessageCircle className="mr-2 size-5" />
          {loading ? "Registrando pedido..." : "Pedir por WhatsApp"}
        </Button>

        {!formValid && (
          <p className="text-center text-xs text-zinc-400">
            Completá tu nombre y WhatsApp para continuar
          </p>
        )}
      </div>
    </div>
  );
}
