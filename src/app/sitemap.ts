import type { MetadataRoute } from "next";

import { getProductos } from "@/lib/queries/productos";
import { getHabitaciones } from "@/lib/queries/habitaciones";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sietehierbas.co";

  const [productos, habitaciones] = await Promise.all([
    getProductos({}),
    getHabitaciones(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/tienda`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/hostal`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const productoRoutes: MetadataRoute.Sitemap = productos.map((p) => ({
    url: `${siteUrl}/tienda/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const habitacionRoutes: MetadataRoute.Sitemap = habitaciones.map((h) => ({
    url: `${siteUrl}/hostal/${h.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productoRoutes, ...habitacionRoutes];
}
