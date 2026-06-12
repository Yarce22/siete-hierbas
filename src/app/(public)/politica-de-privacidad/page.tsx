import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/public/legal-page";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de tratamiento de datos personales de Siete Hierbas, conforme a la Ley 1581 de 2012.",
};

export default function PrivacidadPage() {
  return (
    <LegalPage
      label="Legal"
      title="Política de Privacidad"
      lastUpdated="12 de junio de 2026"
    >
      <LegalSection title="1. Responsable del tratamiento">
        <p>
          <strong>Siete Hierbas</strong> — Santa Rosa de Cabal, Risaralda, Colombia.
        </p>
        <p>
          Contacto del responsable:{" "}
          <a href="mailto:yerbateriacolombia@gmail.com">yerbateriacolombia@gmail.com</a>
        </p>
        <p>
          Esta política se rige por la <strong>Ley Estatutaria 1581 de 2012</strong> y el{" "}
          <strong>Decreto 1377 de 2013</strong> sobre protección de datos personales en Colombia.
        </p>
      </LegalSection>

      <LegalSection title="2. Datos que recolectamos">
        <p>Recolectamos únicamente los datos necesarios para gestionar pedidos y reservas:</p>
        <ul>
          <li>Nombre completo</li>
          <li>Número de teléfono (WhatsApp)</li>
          <li>Correo electrónico (cuando se proporciona voluntariamente)</li>
          <li>Dirección de entrega (solo para pedidos con envío)</li>
          <li>Datos de navegación mediante cookies de Google Analytics (ver Política de Cookies)</li>
        </ul>
        <p>
          <strong>No recolectamos</strong> datos de tarjetas de crédito ni información bancaria.
          Los pagos se coordinan directamente por WhatsApp.
        </p>
      </LegalSection>

      <LegalSection title="3. Finalidad del tratamiento">
        <p>Sus datos son utilizados exclusivamente para:</p>
        <ul>
          <li>Gestionar y confirmar pedidos de productos naturistas.</li>
          <li>Gestionar y confirmar reservas del hostal.</li>
          <li>Coordinar envíos y entregas.</li>
          <li>Responder consultas y solicitudes de atención al cliente.</li>
          <li>Mejorar la experiencia del sitio web mediante análisis de navegación anónimo.</li>
        </ul>
        <p>
          Sus datos <strong>no serán vendidos, cedidos ni compartidos</strong> con terceros con fines
          comerciales o publicitarios.
        </p>
      </LegalSection>

      <LegalSection title="4. Base legal del tratamiento">
        <p>
          El tratamiento de sus datos se realiza con base en su <strong>consentimiento expreso</strong>,
          otorgado al comunicarse con nosotros o al utilizar este sitio web, y en la ejecución de la
          relación contractual derivada de su pedido o reserva.
        </p>
      </LegalSection>

      <LegalSection title="5. Conservación de los datos">
        <p>
          Sus datos se conservan durante el tiempo necesario para cumplir con la finalidad para la que
          fueron recolectados y para dar cumplimiento a obligaciones legales. Una vez cumplida dicha
          finalidad, serán eliminados de forma segura.
        </p>
      </LegalSection>

      <LegalSection title="6. Sus derechos (Habeas Data)">
        <p>Como titular de datos personales, usted tiene derecho a:</p>
        <ul>
          <li><strong>Conocer</strong> qué datos suyos están siendo tratados.</li>
          <li><strong>Actualizar</strong> y <strong>rectificar</strong> sus datos cuando sean inexactos.</li>
          <li><strong>Solicitar la supresión</strong> de sus datos cuando no exista obligación legal de conservarlos.</li>
          <li><strong>Revocar</strong> el consentimiento otorgado para el tratamiento.</li>
          <li><strong>Presentar quejas</strong> ante la Superintendencia de Industria y Comercio (SIC).</li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, contáctenos en{" "}
          <a href="mailto:yerbateriacolombia@gmail.com">yerbateriacolombia@gmail.com</a>. Responderemos
          en un plazo máximo de <strong>10 días hábiles</strong>.
        </p>
      </LegalSection>

      <LegalSection title="7. Seguridad">
        <p>
          Adoptamos medidas técnicas y organizativas razonables para proteger sus datos personales contra
          acceso no autorizado, pérdida o divulgación. Sin embargo, ningún sistema de transmisión por
          internet es completamente seguro.
        </p>
      </LegalSection>

      <LegalSection title="8. Cambios a esta política">
        <p>
          Podemos actualizar esta política en cualquier momento. La fecha de última actualización siempre
          estará visible al inicio de esta página. Le recomendamos revisarla periódicamente.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
