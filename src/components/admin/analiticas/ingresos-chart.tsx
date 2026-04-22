"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { formatCOP } from "@/lib/format";
import type { PuntoIngresos } from "@/lib/queries/metricas";

export function IngresosChart({ data }: { data: PuntoIngresos[] }) {
  if (data.every((d) => d.ingresos_tienda === 0 && d.ingresos_hostal === 0)) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-zinc-400">
        Sin ingresos registrados en este período
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="gradTienda" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradHostal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
        <XAxis
          dataKey="fecha"
          tick={{ fontSize: 11, fill: "#71717a" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v: number) =>
            v === 0 ? "0" : `$${(v / 1000).toFixed(0)}k`
          }
          tick={{ fontSize: 11, fill: "#71717a" }}
          tickLine={false}
          axisLine={false}
          width={52}
        />
        <Tooltip
          formatter={(value, name) => [
            value != null ? formatCOP(value as number) : "—",
            name === "ingresos_tienda" ? "Tienda" : "Hostal",
          ]}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Legend
          formatter={(value) =>
            value === "ingresos_tienda" ? "Tienda" : "Hostal"
          }
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
        />
        <Area
          type="monotone"
          dataKey="ingresos_tienda"
          stroke="#16a34a"
          fill="url(#gradTienda)"
          strokeWidth={2}
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="ingresos_hostal"
          stroke="#2563eb"
          fill="url(#gradHostal)"
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
