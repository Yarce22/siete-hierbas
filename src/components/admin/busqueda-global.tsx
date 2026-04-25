"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Package,
  ShoppingBag,
  BedDouble,
  CalendarCheck,
  Search,
  Loader2,
} from "lucide-react";

import { buscarGlobal, type ResultadoBusqueda } from "@/lib/actions/busqueda";

const TIPO_ICONO: Record<ResultadoBusqueda["tipo"], React.ElementType> = {
  producto: Package,
  pedido: ShoppingBag,
  reserva: CalendarCheck,
  habitacion: BedDouble,
};

const TIPO_LABEL: Record<ResultadoBusqueda["tipo"], string> = {
  producto: "Productos",
  pedido: "Pedidos",
  reserva: "Reservas",
  habitacion: "Habitaciones",
};

export function BusquedaGlobal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResultados([]);
      return;
    }
    startTransition(async () => {
      const r = await buscarGlobal(query);
      setResultados(r);
    });
  }, [query]);

  function navegar(href: string) {
    setOpen(false);
    setQuery("");
    setResultados([]);
    router.push(href);
  }

  const porTipo = resultados.reduce<
    Partial<Record<ResultadoBusqueda["tipo"], ResultadoBusqueda[]>>
  >((acc, r) => {
    (acc[r.tipo] ??= []).push(r);
    return acc;
  }, {});

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-xl border bg-white shadow-2xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <Command shouldFilter={false} label="Búsqueda global">
          <div className="flex items-center gap-3 border-b px-4">
            {isPending ? (
              <Loader2 className="size-4 shrink-0 animate-spin text-zinc-400" />
            ) : (
              <Search className="size-4 shrink-0 text-zinc-400" />
            )}
            <Command.Input
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder="Buscar productos, pedidos, reservas..."
              className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-zinc-400"
            />
            <kbd className="rounded border bg-zinc-100 px-1.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              Esc
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            {query.length < 2 && (
              <Command.Empty className="py-8 text-center text-sm text-zinc-400">
                Escribí al menos 2 caracteres para buscar
              </Command.Empty>
            )}
            {query.length >= 2 && resultados.length === 0 && !isPending && (
              <Command.Empty className="py-8 text-center text-sm text-zinc-400">
                No se encontraron resultados para &ldquo;{query}&rdquo;
              </Command.Empty>
            )}

            {(
              Object.entries(porTipo) as [
                ResultadoBusqueda["tipo"],
                ResultadoBusqueda[],
              ][]
            ).map(([tipo, items]) => {
              const Icono = TIPO_ICONO[tipo];
              return (
                <Command.Group
                  key={tipo}
                  heading={TIPO_LABEL[tipo]}
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-zinc-400"
                >
                  {items.map((r) => (
                    <Command.Item
                      key={r.id}
                      value={r.id}
                      onSelect={() => navegar(r.href)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800"
                    >
                      <Icono className="size-4 shrink-0 text-zinc-400" />
                      <div className="flex flex-col">
                        <span>{r.titulo}</span>
                        {r.subtitulo && (
                          <span className="text-xs text-zinc-400">
                            {r.subtitulo}
                          </span>
                        )}
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              );
            })}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
