import type { Metadata } from "next";
import { CategoriaForm } from "@/components/admin/categoria-form";

export const metadata: Metadata = { title: "Nueva categoría · Admin" };

export default function NuevaCategoria() {
  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Nueva categoría</h1>
      <CategoriaForm />
    </div>
  );
}
