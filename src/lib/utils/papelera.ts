export type TablaEliminable = "productos" | "categorias" | "habitaciones" | "pedidos";

const TABLAS_PERMITIDAS = new Set<string>([
  "productos",
  "categorias",
  "habitaciones",
  "pedidos",
]);

export function isTablaPermitida(tabla: string): tabla is TablaEliminable {
  return TABLAS_PERMITIDAS.has(tabla);
}
