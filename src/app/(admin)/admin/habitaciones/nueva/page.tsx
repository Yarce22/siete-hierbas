import type { Metadata } from "next";
import { HabitacionForm } from "@/components/admin/habitacion-form";

export const metadata: Metadata = { title: "Nueva habitación · Admin" };

export default function NuevaHabitacion() {
  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Nueva habitación</h1>
      <HabitacionForm />
    </div>
  );
}
