"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/public/cart-provider";

export function CartButton() {
  const { totalItems } = useCart();

  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className="relative"
      aria-label={`Carrito (${totalItems} items)`}
    >
      <Link href="/checkout">
        <ShoppingBag className="size-4" />
        <span className="hidden sm:inline">Carrito</span>
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
            {totalItems}
          </span>
        )}
      </Link>
    </Button>
  );
}
