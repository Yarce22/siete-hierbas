import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyCart() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-24 text-center">
      <p className="text-2xl font-semibold">El carrito está vacío</p>
      <p className="text-zinc-500">Explora nuestro catálogo y encuentra algo que te guste.</p>
      <Button asChild>
        <Link href="/tienda">Ver productos</Link>
      </Button>
    </div>
  );
}
