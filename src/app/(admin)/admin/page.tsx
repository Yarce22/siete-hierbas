import type { Metadata } from "next";
import { Package, Tags, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard · Admin" };

async function getStats() {
  const supabase = await createClient();

  const [{ count: productos }, { count: categorias }, { count: pedidos }] =
    await Promise.all([
      supabase
        .from("productos")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase
        .from("categorias")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase
        .from("pedidos")
        .select("*", { count: "exact", head: true })
        .eq("estado", "pendiente_whatsapp")
        .is("deleted_at", null),
    ]);

  return { productos: productos ?? 0, categorias: categorias ?? 0, pedidos: pedidos ?? 0 };
}

const stats = [
  {
    label: "Productos",
    key: "productos" as const,
    href: "/admin/productos",
    icon: Package,
  },
  {
    label: "Categorías",
    key: "categorias" as const,
    href: "/admin/categorias",
    icon: Tags,
  },
  {
    label: "Pedidos pendientes",
    key: "pedidos" as const,
    href: "/admin/pedidos",
    icon: ShoppingBag,
  },
];

export default async function AdminPage() {
  const counts = await getStats();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-8 text-2xl font-semibold">Panel de administración</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.key} href={s.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">
                  {s.label}
                </CardTitle>
                <s.icon className="size-4 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{counts[s.key]}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
