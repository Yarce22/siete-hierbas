"use client";

import { useState, useTransition } from "react";
import { Undo2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { restaurarElemento, eliminarDefinitivamente } from "@/lib/actions/papelera";
import { type ElementoEliminado, type TipoPapelera } from "@/lib/queries/papelera";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TIPO_TABLA: Record<TipoPapelera, "productos" | "categorias" | "habitaciones" | "pedidos"> = {
  producto: "productos",
  categoria: "categorias",
  habitacion: "habitaciones",
  pedido: "pedidos",
};

const TIPO_LABEL: Record<TipoPapelera, string> = {
  producto: "Productos",
  categoria: "Categorías",
  habitacion: "Habitaciones",
  pedido: "Pedidos",
};

function FilaEliminada({ item, onRestaurado }: { item: ElementoEliminado; onRestaurado: () => void }) {
  const [isPending, startTransition] = useTransition();

  function restaurar() {
    startTransition(async () => {
      const r = await restaurarElemento(TIPO_TABLA[item.tipo], item.id);
      if (r.error) {
        toast.error(r.error);
      } else {
        toast.success(`"${item.nombre}" restaurado correctamente`);
        onRestaurado();
      }
    });
  }

  async function eliminar() {
    const r = await eliminarDefinitivamente(TIPO_TABLA[item.tipo], item.id);
    if (r.error) {
      toast.error(r.error);
    } else {
      toast.success(`"${item.nombre}" eliminado definitivamente`);
      onRestaurado();
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 dark:bg-zinc-900">
      <div>
        <p className="text-sm font-medium">{item.nombre}</p>
        <p className="text-xs text-zinc-400">
          {item.extra ? `${item.extra} · ` : ""}
          Eliminado el{" "}
          {new Date(item.deleted_at).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={restaurar}
          disabled={isPending}
        >
          <Undo2 className="mr-1.5 size-3.5" />
          Restaurar
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="mr-1.5 size-3.5" />
              Eliminar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar definitivamente?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. &ldquo;{item.nombre}&rdquo; se eliminará
                permanentemente de la base de datos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={eliminar}
                className="bg-red-600 hover:bg-red-700"
              >
                Sí, eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

function ListaVacia() {
  return (
    <p className="py-12 text-center text-sm text-zinc-400">
      No hay elementos en la papelera.
    </p>
  );
}

export function PapeleraCliente({ items: initialItems }: { items: ElementoEliminado[] }) {
  const [items, setItems] = useState(initialItems);

  function remover(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const tipos = Array.from(new Set(items.map((i) => i.tipo)));

  return (
    <Tabs defaultValue="todos">
      <TabsList className="mb-6">
        <TabsTrigger value="todos">
          Todos ({items.length})
        </TabsTrigger>
        {tipos.map((tipo) => {
          const count = items.filter((i) => i.tipo === tipo).length;
          return (
            <TabsTrigger key={tipo} value={tipo}>
              {TIPO_LABEL[tipo]} ({count})
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="todos">
        {items.length === 0 ? (
          <ListaVacia />
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <FilaEliminada
                key={item.id}
                item={item}
                onRestaurado={() => remover(item.id)}
              />
            ))}
          </div>
        )}
      </TabsContent>

      {(["producto", "categoria", "habitacion", "pedido"] as TipoPapelera[]).map((tipo) => {
        const filtrados = items.filter((i) => i.tipo === tipo);
        return (
          <TabsContent key={tipo} value={tipo}>
            {filtrados.length === 0 ? (
              <ListaVacia />
            ) : (
              <div className="space-y-2">
                {filtrados.map((item) => (
                  <FilaEliminada
                    key={item.id}
                    item={item}
                    onRestaurado={() => remover(item.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
