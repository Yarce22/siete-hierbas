"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  data: Record<string, string | number>[];
  filename: string;
};

export function ExportCsvBtn({ data, filename }: Props) {
  function handleExport() {
    if (!data.length) return;

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = "﻿" + [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={!data.length}>
      <Download className="size-4" />
      Exportar CSV
    </Button>
  );
}
