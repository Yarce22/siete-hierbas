"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartLine = {
  varianteId: string;
  productoId: string;
  productoNombre: string;
  productoSlug: string;
  varianteNombre: string;
  precio: number;
  imagen: string | null;
  cantidad: number;
};

type CartState = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "cantidad">, cantidad?: number) => void;
  remove: (varianteId: string) => void;
  setCantidad: (varianteId: string, cantidad: number) => void;
  clear: () => void;
  totalItems: number;
  totalCOP: number;
};

const STORAGE_KEY = "siete-hierbas:cart:v1";

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const add = useCallback(
    (line: Omit<CartLine, "cantidad">, cantidad = 1) => {
      setLines((prev) => {
        const idx = prev.findIndex((l) => l.varianteId === line.varianteId);
        if (idx === -1) return [...prev, { ...line, cantidad }];
        const next = [...prev];
        next[idx] = { ...next[idx], cantidad: next[idx].cantidad + cantidad };
        return next;
      });
    },
    [],
  );

  const remove = useCallback((varianteId: string) => {
    setLines((prev) => prev.filter((l) => l.varianteId !== varianteId));
  }, []);

  const setCantidad = useCallback((varianteId: string, cantidad: number) => {
    setLines((prev) =>
      cantidad <= 0
        ? prev.filter((l) => l.varianteId !== varianteId)
        : prev.map((l) =>
            l.varianteId === varianteId ? { ...l, cantidad } : l,
          ),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(() => {
    const totalItems = lines.reduce((sum, l) => sum + l.cantidad, 0);
    const totalCOP = lines.reduce((sum, l) => sum + l.precio * l.cantidad, 0);
    return { lines, add, remove, setCantidad, clear, totalItems, totalCOP };
  }, [lines, add, remove, setCantidad, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
