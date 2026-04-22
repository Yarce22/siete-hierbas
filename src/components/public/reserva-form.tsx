"use client";

import { useState, useMemo } from "react";
import { MessageCircle } from "lucide-react";

import { generarLinkReserva } from "@/lib/whatsapp";
import { formatCOP } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  habitacionNombre: string;
  capacidad: number;
  precioPorNoche: number;
};

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function addDays(iso: string, days: number) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function ReservaForm({ habitacionNombre, capacidad, precioPorNoche }: Props) {
  const hoy = todayISO();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [huespedes, setHuespedes] = useState(1);
  const [nombre, setNombre] = useState("");

  const noches = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = Math.round(
      (new Date(checkOut + "T12:00:00").getTime() -
        new Date(checkIn + "T12:00:00").getTime()) /
        86_400_000,
    );
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const total = noches * precioPorNoche;

  const listo =
    checkIn.length > 0 &&
    checkOut.length > 0 &&
    noches > 0 &&
    nombre.trim().length > 0;

  const waUrl = listo
    ? generarLinkReserva({
        habitacionNombre,
        checkIn,
        checkOut,
        huespedes,
        nombre: nombre.trim(),
        precioPorNoche,
      })
    : null;

  return (
    <div className="flex flex-col gap-5 rounded-xl border bg-zinc-50 p-6 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold">Consultar disponibilidad</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="check-in">Llegada</Label>
          <Input
            id="check-in"
            type="date"
            min={hoy}
            value={checkIn}
            onChange={(e) => {
              setCheckIn(e.target.value);
              if (checkOut && checkOut <= e.target.value) setCheckOut("");
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="check-out">Salida</Label>
          <Input
            id="check-out"
            type="date"
            min={checkIn ? addDays(checkIn, 1) : hoy}
            value={checkOut}
            disabled={!checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="huespedes">Huéspedes</Label>
        <Input
          id="huespedes"
          type="number"
          min={1}
          max={capacidad}
          value={huespedes}
          onChange={(e) => setHuespedes(Math.min(capacidad, Math.max(1, Number(e.target.value))))}
        />
        <p className="text-xs text-zinc-500">Máximo {capacidad} {capacidad === 1 ? "persona" : "personas"}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="nombre-huesped">Tu nombre</Label>
        <Input
          id="nombre-huesped"
          type="text"
          placeholder="Ej: María García"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      {noches > 0 && (
        <div className="flex items-center justify-between rounded-lg border bg-white p-3 text-sm dark:bg-zinc-800">
          <span className="text-zinc-500">
            {noches} {noches === 1 ? "noche" : "noches"} × {formatCOP(precioPorNoche)}
          </span>
          <span className="font-semibold">{formatCOP(total)}</span>
        </div>
      )}

      <div className="rounded-lg border bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        Al tocar el botón se abre WhatsApp con tu consulta lista. Confirmamos disponibilidad y coordinamos el pago.
      </div>

      {waUrl ? (
        <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white">
          <a href={waUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-5" />
            Consultar por WhatsApp
          </a>
        </Button>
      ) : (
        <Button size="lg" className="w-full" disabled>
          Completá el formulario para continuar
        </Button>
      )}
    </div>
  );
}
