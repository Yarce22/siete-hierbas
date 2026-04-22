"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { formatCOP } from "@/lib/format";
import type { TopProducto } from "@/lib/queries/metricas";

const COLORS = [
  "#16a34a",
  "#15803d",
  "#166534",
  "#14532d",
  "#22c55e",
  "#4ade80",
  "#86efac",
  "#bbf7d0",
];

export function TopProductosChart({ data }: { data: TopProducto[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-zinc-400">
        Sin ventas registradas en este período
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => b.unidades - a.unidades);

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, sorted.length * 36)}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 0, right: 48, bottom: 0, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "#71717a" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="nombre"
          width={140}
          tick={{ fontSize: 11, fill: "#3f3f46" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value, name) => [
            name === "unidades"
              ? `${value ?? 0} uds`
              : formatCOP((value as number) ?? 0),
            name === "unidades" ? "Unidades" : "Ingresos",
          ]}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Bar dataKey="unidades" radius={[0, 4, 4, 0]} label={{ position: "right", fontSize: 11, fill: "#71717a" }}>
          {sorted.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
