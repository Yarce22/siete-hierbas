import Link from "next/link";

import { CartButton } from "@/components/public/cart-button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight">
            Siete Hierbas
          </span>
          <span className="hidden text-sm text-zinc-500 sm:inline">
            Santa Rosa de Cabal
          </span>
        </Link>

        <nav className="hidden gap-6 text-sm text-zinc-600 dark:text-zinc-400 md:flex">
          <Link
            href="/tienda"
            className="hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Tienda
          </Link>
          <Link
            href="/hostal"
            className="hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Hostal
          </Link>
          <Link
            href="/contacto"
            className="hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Contacto
          </Link>
        </nav>

        <CartButton />
      </div>
    </header>
  );
}
