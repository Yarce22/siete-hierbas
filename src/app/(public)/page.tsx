import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductoCard } from "@/components/public/producto-card";
import { getProductos } from "@/lib/queries/productos";

export default async function Home() {
  const destacados = await getProductos({ soloDestacados: true, limit: 4 });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16">
      <section className="flex flex-col gap-4">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Productos naturistas y hospedaje en el corazón de Risaralda.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Hierbas, aceites, tés y una casa para descansar — todo en Santa Rosa
          de Cabal.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/tienda">Ver productos</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/hostal">Conocer el hostal</Link>
          </Button>
        </div>
      </section>

      {destacados.length > 0 && (
        <>
          <Separator />
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">
                Productos destacados
              </h2>
              <Link
                href="/tienda"
                className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Ver todos →
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {destacados.map((p) => (
                <li key={p.id}>
                  <ProductoCard producto={p} />
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <Separator />

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Herboristería</CardTitle>
            <CardDescription>
              Catálogo de productos naturales: tés, aceites esenciales, cremas y
              tinturas artesanales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="px-0">
              <Link href="/tienda">Explorar catálogo →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hostal</CardTitle>
            <CardDescription>
              Habitaciones cómodas a pasos de los termales de Santa Rosa de
              Cabal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="px-0">
              <Link href="/hostal">Ver habitaciones →</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
