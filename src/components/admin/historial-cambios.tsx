import { getAuditLog, type TablaAudit } from "@/lib/queries/audit";

const ACCION_LABEL: Record<string, string> = {
  create: "creó",
  update: "actualizó",
  delete: "eliminó",
  restore: "restauró",
};

export async function HistorialCambios({
  entidad,
  entidadId,
}: {
  entidad: TablaAudit;
  entidadId: string;
}) {
  const entradas = await getAuditLog(entidad, entidadId);

  if (entradas.length === 0) {
    return (
      <p className="py-4 text-sm text-zinc-400">
        Sin historial de cambios aún.
      </p>
    );
  }

  return (
    <ol className="space-y-4">
      {entradas.map((entrada) => (
        <li key={entrada.id} className="flex items-start gap-3 text-sm">
          <div className="mt-1.5 size-2 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <div>
            <p>
              <span className="font-medium">{entrada.usuario_nombre}</span>{" "}
              <span className="text-zinc-500">
                {ACCION_LABEL[entrada.accion] ?? entrada.accion} este elemento
              </span>
            </p>
            <time className="text-xs text-zinc-400">
              {new Date(entrada.created_at).toLocaleString("es-CO", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}
