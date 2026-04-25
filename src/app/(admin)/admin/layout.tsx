import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { BusquedaGlobal } from "@/components/admin/busqueda-global";
import { OnboardingTour } from "@/components/admin/onboarding-tour";
import { getAlertasStockBajo } from "@/lib/queries/metricas";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const alertas = await getAlertasStockBajo();

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <AdminSidebar alertasStock={alertas.length} />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <BusquedaGlobal />
      <OnboardingTour />
    </div>
  );
}
