import type { Metadata } from "next";
import { Package, Tags, ShoppingBag, BedDouble, CalendarCheck } from "lucide-react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard · Admin" };

async function getStats() {
  const supabase = await createClient();

  const [
    { count: productos },
    { count: categorias },
    { count: pedidosPendientes },
    { count: habitaciones },
    { count: reservasActivas },
    { data: perfil },
  ] = await Promise.all([
    supabase.from("productos").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("categorias").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("pedidos").select("*", { count: "exact", head: true }).eq("estado", "pendiente_whatsapp").is("deleted_at", null),
    supabase.from("habitaciones").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("reservas").select("*", { count: "exact", head: true }).in("estado", ["confirmada", "en_curso"]).is("deleted_at", null),
    supabase.from("profiles").select("nombre").maybeSingle(),
  ]);

  return {
    productos: productos ?? 0,
    categorias: categorias ?? 0,
    pedidosPendientes: pedidosPendientes ?? 0,
    habitaciones: habitaciones ?? 0,
    reservasActivas: reservasActivas ?? 0,
    nombre: perfil?.nombre ?? "Admin",
  };
}

function saludo() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 18) return "Buenas tardes";
  return "Buenas noches";
}

const statsConfig = [
  { key: "productos" as const,         label: "Productos",           href: "/admin/productos",   icon: Package,       section: "tienda" },
  { key: "categorias" as const,        label: "Categorías",          href: "/admin/categorias",  icon: Tags,          section: "tienda" },
  { key: "pedidosPendientes" as const, label: "Pedidos pendientes",  href: "/admin/pedidos?estado=pendiente_whatsapp", icon: ShoppingBag, section: "tienda" },
  { key: "habitaciones" as const,      label: "Habitaciones",        href: "/admin/habitaciones",icon: BedDouble,     section: "hostal" },
  { key: "reservasActivas" as const,   label: "Reservas activas",    href: "/admin/reservas",    icon: CalendarCheck, section: "hostal" },
];

export default async function AdminPage() {
  const stats = await getStats();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          {saludo()}, {stats.nombre} 👋
        </h1>
        <p className="text-sm text-zinc-500">
          {new Date().toLocaleDateString("es-CO", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Tienda
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {statsConfig.filter(s => s.section === "tienda").map((s) => (
              <StatCard key={s.key} {...s} value={stats[s.key]} />
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Hostal
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {statsConfig.filter(s => s.section === "hostal").map((s) => (
              <StatCard key={s.key} {...s} value={stats[s.key]} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  href,
  icon: Icon,
  value,
}: {
  label: string;
  href: string;
  icon: React.ElementType;
  value: number;
}) {
  return (
    <Link href={href}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-500">{label}</CardTitle>
          <Icon className="size-4 text-zinc-400" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{value}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
