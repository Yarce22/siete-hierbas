import { getSiteConfig, getAllHeroSlides } from "@/lib/queries/site-config";
import { HomeConfigClient } from "@/components/admin/home-config-client";

export default async function AdminHomePage() {
  const [config, slides] = await Promise.all([getSiteConfig(), getAllHeroSlides()]);

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-6">Contenido de la página principal</h1>
      <HomeConfigClient config={config} slides={slides} />
    </div>
  );
}
