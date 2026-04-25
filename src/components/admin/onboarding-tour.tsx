"use client";

import "driver.js/dist/driver.css";
import { useEffect } from "react";

const TOUR_KEY = "sh_onboarding_v1";

export function OnboardingTour() {
  useEffect(() => {
    if (localStorage.getItem(TOUR_KEY) === "true") return;

    let cancelled = false;

    async function iniciar() {
      const { driver } = await import("driver.js");
      if (cancelled) return;

      const driverObj = driver({
        showProgress: true,
        progressText: "{{current}} de {{total}}",
        nextBtnText: "Siguiente →",
        prevBtnText: "← Anterior",
        doneBtnText: "¡Listo!",
        onDestroyed: () => localStorage.setItem(TOUR_KEY, "true"),
        steps: [
          {
            element: "[data-tour='inicio']",
            popover: {
              title: "Bienvenido al panel admin",
              description:
                "Desde acá manejás todo el negocio. Esta sección muestra las métricas del día.",
            },
          },
          {
            element: "[data-tour='productos']",
            popover: {
              title: "Productos",
              description:
                "Creá y editá los productos de la tienda con precios, fotos y stock.",
            },
          },
          {
            element: "[data-tour='pedidos']",
            popover: {
              title: "Pedidos",
              description:
                "Los pedidos que llegan por WhatsApp. Podés cambiar el estado de cada uno.",
            },
          },
          {
            element: "[data-tour='reservas']",
            popover: {
              title: "Reservas del hostal",
              description:
                "Reservas de habitaciones. Manejá check-in, check-out y estados.",
            },
          },
          {
            element: "[data-tour='analiticas']",
            popover: {
              title: "Analíticas",
              description:
                "Gráficos de ingresos, productos más vendidos y métricas del hostal.",
              side: "right",
            },
          },
        ],
      });

      driverObj.drive();
    }

    const timer = setTimeout(iniciar, 800);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return null;
}
