"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  BedDouble,
  CalendarCheck,
  BarChart3,
  Trash2,
  LogOut,
  Search,
} from "lucide-react";

import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  badge?: number;
  tourId?: string;
};

export function AdminSidebar({ alertasStock = 0 }: { alertasStock?: number }) {
  const pathname = usePathname();

  const sections: { label: string; items: NavItem[] }[] = [
    {
      label: "Tienda",
      items: [
        {
          href: "/admin",
          label: "Inicio",
          icon: LayoutDashboard,
          exact: true,
          tourId: "inicio",
        },
        {
          href: "/admin/productos",
          label: "Productos",
          icon: Package,
          badge: alertasStock,
          tourId: "productos",
        },
        { href: "/admin/categorias", label: "Categorías", icon: Tags },
        {
          href: "/admin/pedidos",
          label: "Pedidos",
          icon: ShoppingBag,
          tourId: "pedidos",
        },
      ],
    },
    {
      label: "Hostal",
      items: [
        { href: "/admin/habitaciones", label: "Habitaciones", icon: BedDouble },
        {
          href: "/admin/reservas",
          label: "Reservas",
          icon: CalendarCheck,
          tourId: "reservas",
        },
      ],
    },
    {
      label: "Reportes",
      items: [
        {
          href: "/admin/analiticas",
          label: "Analíticas",
          icon: BarChart3,
          tourId: "analiticas",
        },
      ],
    },
    {
      label: "Gestión",
      items: [
        { href: "/admin/papelera", label: "Papelera", icon: Trash2 },
      ],
    },
  ];

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-white dark:bg-zinc-950">
      <div className="border-b px-6 py-5">
        <p className="font-semibold">Siete Hierbas</p>
        <p className="text-xs text-zinc-500">Panel admin</p>
      </div>

      <div className="border-b px-3 py-2">
        <button
          type="button"
          onClick={() =>
            document.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }),
            )
          }
          className="flex w-full items-center gap-2 rounded-md border bg-zinc-50 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <Search className="size-3.5" />
          <span>Buscar...</span>
          <kbd className="ml-auto rounded border bg-white px-1 text-[10px] dark:bg-zinc-950">
            Ctrl K
          </kbd>
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {sections.map((section, i) => (
          <div key={section.label}>
            <p
              className={`px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-zinc-400 ${i === 0 ? "pt-2" : "pt-4"}`}
            >
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isActive(item.href, item.exact)}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t p-3">
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          >
            <LogOut className="size-4 flex-shrink-0" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      data-tour={item.tourId}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100",
      )}
    >
      <item.icon className="size-4 flex-shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.badge != null && item.badge > 0 && (
        <span className="flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      )}
    </Link>
  );
}
