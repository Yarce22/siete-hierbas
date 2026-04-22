import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, ShoppingBag, CalendarCheck } from "lucide-react";

import { IngresosChart } from "@/components/admin/analiticas/ingresos-chart";
import { TopProductosChart } from "@/components/admin/analiticas/top-productos-chart";
import { TablaVentas } from "@/components/admin/analiticas/tabla-ventas";
import { ExportCsvBtn } from "@/components/admin/analiticas/export-csv-btn";
import {
  getIngresosPorPeriodo,
  getTopProductos,
  getHistorialPedidos,
  getMetricasHostal,
  type Periodo,
} from "@/lib/queries/metricas";
import { formatCOP } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Analíticas · Admin" };

type SearchParams = { periodo?: string; tab?: string };

const PERIODOS: { value: Periodo; label: string }[] = [
  { value: "semana", label: "Semana" },
  { value: "mes", label: "Mes" },
  { value: "anio", label: "Año" },
];

export default async function AnaliticasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { periodo: periodoParam, tab: tabParam } = await searchParams;

  const periodo: Periodo =
    periodoParam === "mes" || periodoParam === "anio" ? periodoParam : "semana";
  const tab = tabParam === "hostal" ? "hostal" : "tienda";

  const [ingresos, topProductos, pedidos, metricasHostal] = await Promise.all([
    getIngresosPorPeriodo(periodo),
    getTopProductos(periodo),
    getHistorialPedidos(),
    getMetricasHostal(periodo),
  ]);

  const totalIngresiosTienda = ingresos.reduce((s, d) => s + d.ingresos_tienda, 0);
  const totalIngresosHostal = ingresos.reduce((s, d) => s + d.ingresos_hostal, 0);
  const pedidosPeriodo = pedidos.filter((p) => {
    const desde = new Date();
    if (periodo === "semana") desde.setDate(desde.getDate() - 7);
    else if (periodo === "mes") desde.setDate(desde.getDate() - 30);
    else desde.setDate(desde.getDate() - 365);
    return new Date(p.created_at) >= desde && p.estado !== "cancelado";
  });
  const ticketPromedio =
    pedidosPeriodo.length > 0
      ? Math.round(
          pedidosPeriodo.reduce((s, p) => s + p.total, 0) / pedidosPeriodo.length,
        )
      : 0;

  const pedidosCsv = pedidos.map((p) => ({
    orden: `#${p.numero_orden}`,
    cliente: p.cliente_nombre,
    estado: p.estado,
    total: p.total,
    fecha: new Date(p.created_at).toLocaleDateString("es-CO"),
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Analíticas</h1>

        <div className="flex items-center gap-1 rounded-lg border p-1 self-start">
          {PERIODOS.map((p) => (
            <Link
              key={p.value}
              href={`/admin/analiticas?periodo=${p.value}&tab=${tab}`}
              className={cn(
                "rounded-md px-3 py-1 text-sm transition-colors",
                periodo === p.value
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
              )}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-6 flex gap-2 border-b">
        {[
          { value: "tienda", label: "Tienda" },
          { value: "hostal", label: "Hostal" },
        ].map((t) => (
          <Link
            key={t.value}
            href={`/admin/analiticas?periodo=${periodo}&tab=${t.value}`}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              tab === t.value
                ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {tab === "tienda" ? (
        <div className="flex flex-col gap-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={TrendingUp}
              label="Ingresos del período"
              value={formatCOP(totalIngresiosTienda)}
            />
            <StatCard
              icon={ShoppingBag}
              label="Pedidos completados"
              value={String(pedidosPeriodo.length)}
            />
            <StatCard
              icon={ShoppingBag}
              label="Ticket promedio"
              value={ticketPromedio > 0 ? formatCOP(ticketPromedio) : "—"}
            />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-500">
                Ingresos en el tiempo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IngresosChart data={ingresos} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-500">
                Productos más vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TopProductosChart data={topProductos} />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Historial de pedidos</h2>
              <ExportCsvBtn data={pedidosCsv} filename="pedidos-siete-hierbas.csv" />
            </div>
            <TablaVentas data={pedidos} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              icon={TrendingUp}
              label="Ingresos del período"
              value={formatCOP(totalIngresosHostal)}
            />
            <StatCard
              icon={CalendarCheck}
              label="Reservas en el período"
              value={String(metricasHostal.total_reservas)}
            />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-500">
                Ingresos hostal en el tiempo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IngresosChart data={ingresos} />
            </CardContent>
          </Card>

          <Separator />

          <div className="flex flex-col gap-3">
            <h2 className="font-semibold">Próximas reservas</h2>
            {metricasHostal.proximas.length === 0 ? (
              <p className="text-sm text-zinc-500">Sin reservas próximas confirmadas.</p>
            ) : (
              <ul className="divide-y rounded-lg border">
                {metricasHostal.proximas.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-4 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{r.huesped_nombre}</p>
                      <p className="text-xs text-zinc-500">{r.habitacion_nombre}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        {new Date(r.fecha_check_in + "T12:00:00").toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "short",
                        })}
                        {" → "}
                        {new Date(r.fecha_check_out + "T12:00:00").toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <p className="text-xs text-zinc-500 font-mono">#{r.numero_reserva}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-zinc-500">{label}</CardTitle>
        <Icon className="size-4 text-zinc-400" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
