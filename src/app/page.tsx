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

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b bg-white dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold tracking-tight">
              Siete Hierbas
            </span>
            <span className="text-sm text-zinc-500">
              Santa Rosa de Cabal
            </span>
          </div>
          <nav className="hidden gap-6 text-sm text-zinc-600 dark:text-zinc-400 md:flex">
            <Link href="/tienda" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Tienda
            </Link>
            <Link href="/hostal" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Hostal
            </Link>
            <Link href="/contacto" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Contacto
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-16">
        <section className="flex flex-col gap-4">
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Productos naturistas y hospedaje en el corazón de Risaralda.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Hierbas, aceites, tés y una casa para descansar — todo en Santa
            Rosa de Cabal.
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

        <Separator />

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Herboristería</CardTitle>
              <CardDescription>
                Catálogo de productos naturales: tés, aceites esenciales,
                cremas y tinturas artesanales.
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

        <section className="rounded-lg border bg-amber-50 p-6 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          <p className="font-medium">🚧 Sitio en construcción</p>
          <p className="mt-1 text-amber-800 dark:text-amber-300">
            Estamos trabajando en la nueva plataforma. Pronto podrás comprar y
            reservar directamente desde acá.
          </p>
        </section>
      </main>

      <footer className="border-t bg-white py-6 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-6 text-sm text-zinc-500">
          © {new Date().getFullYear()} Siete Hierbas — Santa Rosa de Cabal,
          Colombia
        </div>
      </footer>
    </div>
  );
}
