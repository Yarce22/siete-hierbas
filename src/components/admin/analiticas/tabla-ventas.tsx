"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import type { PedidoResumen } from "@/lib/queries/metricas";
import { formatCOP } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const estadoVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pendiente_whatsapp: "outline",
  confirmado: "secondary",
  en_camino: "default",
  entregado: "secondary",
  cancelado: "destructive",
};

const estadoLabel: Record<string, string> = {
  pendiente_whatsapp: "Pendiente",
  confirmado: "Confirmado",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const columns: ColumnDef<PedidoResumen>[] = [
  {
    accessorKey: "numero_orden",
    header: "#Orden",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium">#{row.original.numero_orden}</span>
    ),
  },
  {
    accessorKey: "cliente_nombre",
    header: "Cliente",
    cell: ({ row }) => (
      <span className="truncate text-sm">{row.original.cliente_nombre}</span>
    ),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => (
      <Badge variant={estadoVariant[row.original.estado] ?? "outline"} className="text-xs">
        {estadoLabel[row.original.estado] ?? row.original.estado}
      </Badge>
    ),
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <button
        type="button"
        className="flex items-center gap-1 text-xs font-medium"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total
        <ArrowUpDown className="size-3" />
      </button>
    ),
    cell: ({ row }) => (
      <span className="font-semibold">{formatCOP(row.original.total)}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <button
        type="button"
        className="flex items-center gap-1 text-xs font-medium"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Fecha
        <ArrowUpDown className="size-3" />
      </button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-zinc-500">
        {new Date(row.original.created_at).toLocaleDateString("es-CO", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
  },
];

export function TablaVentas({ data }: { data: PedidoResumen[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true },
  ]);

  const tableData = useMemo(() => data, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Buscar por cliente o #orden..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs text-sm"
        />
        <p className="text-sm text-zinc-500">
          {table.getFilteredRowModel().rows.length} pedido
          {table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-zinc-50 dark:bg-zinc-900">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-zinc-400"
                >
                  Sin resultados
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
