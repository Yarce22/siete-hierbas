import type { CartLine } from "@/components/public/cart-provider";
import { formatCOP } from "@/lib/format";

const NUMERO = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export function buildWhatsAppUrl(lines: CartLine[]): string {
  const itemsTexto = lines
    .map(
      (l) =>
        `• ${l.productoNombre} (${l.varianteNombre}) x${l.cantidad} — ${formatCOP(l.precio * l.cantidad)}`,
    )
    .join("\n");

  const total = lines.reduce((sum, l) => sum + l.precio * l.cantidad, 0);

  const mensaje = [
    "¡Hola! Quiero hacer el siguiente pedido:",
    "",
    itemsTexto,
    "",
    `*Total: ${formatCOP(total)}*`,
    "",
    "¿Me confirman disponibilidad y forma de pago? Gracias.",
  ].join("\n");

  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(mensaje)}`;
}
