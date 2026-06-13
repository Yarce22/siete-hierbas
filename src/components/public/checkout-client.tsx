"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/components/public/cart-provider";
import { formatCOP } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { crearPedido } from "@/lib/actions/pedidos";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { EmptyCart } from "./checkout/empty-cart";
import { CartLineItem } from "./checkout/cart-line-item";
import { ContactForm } from "./checkout/contact-form";

export function CheckoutClient() {
  const { lines, remove, setCantidad, totalCOP, clear } = useCart();

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [metodoPago, setMetodoPago] = useState<"transferencia" | "efectivo">("transferencia");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);

  const formValid = nombre.trim().length >= 2 && telefono.trim().length >= 7;

  if (lines.length === 0) return <EmptyCart />;

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

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tu carrito</h1>
        <button type="button" onClick={clear} className="text-sm text-zinc-500 hover:text-red-600 dark:hover:text-red-400">
          Vaciar
        </button>
      </div>

      <Separator className="my-6" />

      <ul className="flex flex-col gap-4">
        {lines.map((line) => (
          <CartLineItem key={line.varianteId} line={line} onRemove={remove} onSetCantidad={setCantidad} />
        ))}
      </ul>

      <Separator className="my-6" />

      <div className="flex items-center justify-between text-lg">
        <span className="font-medium">Total</span>
        <span className="text-2xl font-bold">{formatCOP(totalCOP)}</span>
      </div>

      <Separator className="my-6" />

      <ContactForm
        nombre={nombre} onNombre={setNombre}
        telefono={telefono} onTelefono={setTelefono}
        metodoPago={metodoPago} onMetodoPago={setMetodoPago}
        notas={notas} onNotas={setNotas}
      />

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
