"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";

import { useCart } from "@/components/public/cart-provider";
import { formatCOP } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function CheckoutClient() {
  const { lines, remove, setCantidad, totalCOP, clear } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-24 text-center">
        <p className="text-2xl font-semibold">El carrito está vacío</p>
        <p className="text-zinc-500">
          Explorá nuestro catálogo y encontrá algo que te guste.
        </p>
        <Button asChild>
          <Link href="/tienda">Ver productos</Link>
        </Button>
      </div>
    );
  }

  const whatsappUrl = buildWhatsAppUrl(lines);

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
            <div className="size-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
              {line.imagen ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={line.imagen}
                  alt={line.productoNombre}
                  className="size-full object-cover"
                />
              ) : (
                <div className="size-full" />
              )}
            </div>

            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <Link
                href={`/tienda/${line.productoSlug}`}
                className="font-medium leading-tight hover:underline truncate"
              >
                {line.productoNombre}
              </Link>
              <span className="text-sm text-zinc-500">{line.varianteNombre}</span>
              <span className="font-semibold">{formatCOP(line.precio * line.cantidad)}</span>
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

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-lg">
          <span className="font-medium">Total</span>
          <span className="text-2xl font-bold">{formatCOP(totalCOP)}</span>
        </div>

        <div className="rounded-lg border bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          <p className="font-medium">¿Cómo funciona?</p>
          <p className="mt-1">
            Al tocar el botón vas a WhatsApp con el pedido listo. Coordinamos el
            pago por transferencia o efectivo contra entrega.
          </p>
        </div>

        <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 size-5" />
            Pedir por WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
