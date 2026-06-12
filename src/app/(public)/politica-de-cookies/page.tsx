import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/public/legal-page";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Información sobre el uso de cookies en el sitio web de Siete Hierbas.",
};

export default function CookiesPage() {
  return (
    <LegalPage
      label="Legal"
      title="Política de Cookies"
      lastUpdated="12 de junio de 2026"
    >
      <LegalSection title="1. ¿Qué son las cookies?">
        <p>
          Las cookies son pequeños archivos de texto que un sitio web almacena en el dispositivo del
          usuario al visitarlo. Sirven para recordar preferencias, analizar el comportamiento de navegación
          y mejorar la experiencia del sitio.
        </p>
      </LegalSection>

      <LegalSection title="2. Cookies que utilizamos">
        <p>Este sitio web utiliza los siguientes tipos de cookies:</p>

        <p><strong>Cookies esenciales (de sesión)</strong></p>
        <ul>
          <li>
            <strong>Carrito de compras:</strong> almacena temporalmente los productos que agregó al carrito.
            Se elimina al cerrar el navegador. No recolecta datos personales.
          </li>
        </ul>

        <p style={{ marginTop: "1rem" }}><strong>Cookies de análisis (Google Analytics)</strong></p>
        <ul>
          <li>
            <strong>_ga, _ga_*:</strong> cookies de Google Analytics 4 que nos permiten entender
            cómo los visitantes interactúan con el sitio (páginas visitadas, tiempo de sesión,
            fuente de tráfico). Los datos son anónimos y agregados — no identifican a personas individuales.
          </li>
        </ul>

        <p style={{ marginTop: "1rem" }}>
          <strong>No utilizamos</strong> cookies publicitarias, de rastreo entre sitios ni de redes sociales.
        </p>
      </LegalSection>

      <LegalSection title="3. Base legal">
        <p>
          Las cookies esenciales son necesarias para el funcionamiento básico del sitio y no requieren
          consentimiento. Las cookies de análisis se instalan con base en su consentimiento, conforme
          a la <strong>Ley 1581 de 2012</strong> y las directrices de la Superintendencia de Industria
          y Comercio de Colombia.
        </p>
      </LegalSection>

      <LegalSection title="4. Cómo gestionar las cookies">
        <p>
          Puede controlar y eliminar las cookies desde la configuración de su navegador. A continuación
          los enlaces de ayuda de los navegadores más comunes:
        </p>
        <ul>
          <li>
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
              Google Chrome
            </a>
          </li>
          <li>
            <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web" target="_blank" rel="noopener noreferrer">
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a href="https://support.apple.com/es-co/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
              Safari
            </a>
          </li>
          <li>
            <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
              Microsoft Edge
            </a>
          </li>
        </ul>
        <p>
          Tenga en cuenta que deshabilitar cookies puede afectar el funcionamiento del carrito de compras.
        </p>
      </LegalSection>

      <LegalSection title="5. Más información">
        <p>
          Si tiene preguntas sobre el uso de cookies en este sitio, puede contactarnos en{" "}
          <a href="mailto:yerbateriacolombia@gmail.com">yerbateriacolombia@gmail.com</a>.
        </p>
        <p>
          Para más información sobre cómo Google usa los datos de analytics, visite{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            policies.google.com/privacy
          </a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
