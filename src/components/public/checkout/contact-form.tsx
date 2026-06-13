const inputClass =
  "rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-white";

type MetodoPago = "transferencia" | "efectivo";

type Props = {
  nombre: string;
  onNombre: (v: string) => void;
  telefono: string;
  onTelefono: (v: string) => void;
  metodoPago: MetodoPago;
  onMetodoPago: (v: MetodoPago) => void;
  notas: string;
  onNotas: (v: string) => void;
};

export function ContactForm({
  nombre, onNombre,
  telefono, onTelefono,
  metodoPago, onMetodoPago,
  notas, onNotas,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold">Tus datos</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="nombre" className="text-sm font-medium">
          Nombre completo <span className="text-red-500">*</span>
        </label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => onNombre(e.target.value)}
          placeholder="Tu nombre"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="telefono" className="text-sm font-medium">
          WhatsApp <span className="text-red-500">*</span>
        </label>
        <input
          id="telefono"
          type="tel"
          value={telefono}
          onChange={(e) => onTelefono(e.target.value)}
          placeholder="57 310 318 0273"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Método de pago</span>
        <div className="flex gap-2">
          {(["transferencia", "efectivo"] as const).map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => onMetodoPago(op)}
              className={`flex-1 rounded-lg border py-2 text-sm capitalize transition-colors ${
                metodoPago === op
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              }`}
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notas" className="text-sm font-medium">
          Notas <span className="font-normal text-zinc-400">(opcional)</span>
        </label>
        <textarea
          id="notas"
          value={notas}
          onChange={(e) => onNotas(e.target.value)}
          placeholder="Dirección de entrega, instrucciones especiales..."
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </div>
    </div>
  );
}
