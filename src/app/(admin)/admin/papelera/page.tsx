import type { Metadata } from "next";
import { Trash2 } from "lucide-react";

import { getElementosEliminados } from "@/lib/queries/papelera";
import { PapeleraCliente } from "@/components/admin/papelera-cliente";

export const metadata: Metadata = { title: "Papelera · Admin" };

export default async function PapeleraPage() {
  const items = await getElementosEliminados();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Trash2 className="size-6 text-zinc-400" />
        <div>
          <h1 className="text-2xl font-semibold">Papelera</h1>
          <p className="text-sm text-zinc-500">
            Los elementos eliminados se guardan acá. Podés restaurarlos o
            eliminarlos definitivamente.
          </p>
        </div>
      </div>

      <PapeleraCliente items={items} />
    </div>
  );
}
