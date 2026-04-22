import type { CartLine } from "@/components/public/cart-provider";
import { formatCOP } from "@/lib/format";

const NUMERO = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

type ReservaParams = {
  habitacionNombre: string;
  checkIn: string;
  checkOut: string;
  huespedes: number;
  nombre: string;
  precioPorNoche: number;
};

export function generarLinkReserva({
  habitacionNombre,
  checkIn,
  checkOut,
  huespedes,
  nombre,
  precioPorNoche,
}: ReservaParams): string {
  const formatFecha = (iso: string) =>
    new Date(iso + "T12:00:00").toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const noches = Math.round(
    (new Date(checkOut + "T12:00:00").getTime() -
      new Date(checkIn + "T12:00:00").getTime()) /
      86_400_000,
  );
  const total = noches * precioPorNoche;

  const mensaje = [
    "¡Hola! Me gustaría reservar en el Hostal Siete Hierbas.",
    "",
    `• Habitación: ${habitacionNombre}`,
    `• Llegada: ${formatFecha(checkIn)}`,
    `• Salida: ${formatFecha(checkOut)}`,
    `• Huéspedes: ${huespedes}`,
    `• Nombre: ${nombre}`,
    `• Total estimado: ${formatCOP(total)} (${noches} ${noches === 1 ? "noche" : "noches"} × ${formatCOP(precioPorNoche)}/noche)`,
    "",
    "¿Está disponible para esas fechas?",
  ].join("\n");

  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

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
