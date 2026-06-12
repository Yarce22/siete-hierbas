import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/public/legal-page";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Condiciones generales de uso y compra en Siete Hierbas, herboristería y hostal en Santa Rosa de Cabal, Colombia.",
};

export default function TerminosPage() {
  return (
    <LegalPage
      label="Legal"
      title="Términos y Condiciones"
      lastUpdated="12 de junio de 2026"
    >
      <LegalSection title="1. Identificación del vendedor">
        <p>
          <strong>Siete Hierbas</strong> es un negocio ubicado en Santa Rosa de Cabal, Risaralda, Colombia,
          dedicado a la comercialización de productos naturistas y al servicio de hospedaje (hostal).
        </p>
        <p>
          Contacto: <a href="mailto:yerbateriacolombia@gmail.com">yerbateriacolombia@gmail.com</a> —{" "}
          <a href="https://wa.me/573103180273">+57 310 318 0273</a>
        </p>
      </LegalSection>

      <LegalSection title="2. Aceptación de los términos">
        <p>
          Al navegar por este sitio web o realizar un pedido, el usuario acepta los presentes términos y condiciones
          en su totalidad. Si no está de acuerdo con alguno de ellos, debe abstenerse de utilizar el sitio.
        </p>
      </LegalSection>

      <LegalSection title="3. Proceso de compra">
        <p>
          Todos los pedidos se gestionan a través de <strong>WhatsApp</strong>. Al finalizar el proceso de
          selección de productos en el sitio, el usuario es redirigido a WhatsApp con un mensaje predefinido
          que contiene el detalle de su pedido.
        </p>
        <p>
          El pedido queda confirmado únicamente cuando un representante de Siete Hierbas lo confirma
          expresamente por el mismo medio.
        </p>
      </LegalSection>

      <LegalSection title="4. Formas de pago">
        <p>Siete Hierbas acepta los siguientes métodos de pago:</p>
        <ul>
          <li><strong>Efectivo contra entrega</strong> — para pedidos con entrega local.</li>
          <li><strong>Transferencia bancaria</strong> — los datos se informan al confirmar el pedido por WhatsApp.</li>
        </ul>
        <p>
          No se procesan pagos en línea a través de este sitio web. Todos los montos se expresan en
          pesos colombianos (COP).
        </p>
      </LegalSection>

      <LegalSection title="5. Envíos y entrega">
        <p>
          Los tiempos y costos de envío se informan al momento de confirmar el pedido, según la ubicación del
          comprador. Para entregas fuera de Santa Rosa de Cabal, el costo de envío corre por cuenta del comprador,
          salvo que se indique lo contrario.
        </p>
      </LegalSection>

      <LegalSection title="6. Devoluciones y garantías">
        <p>
          De conformidad con la <strong>Ley 1480 de 2011 (Estatuto del Consumidor)</strong>, el consumidor tiene
          derecho a la garantía del producto adquirido. En caso de recibir un producto en mal estado o diferente
          al solicitado, debe comunicarse con nosotros dentro de los <strong>5 días hábiles</strong> siguientes
          a la recepción, adjuntando evidencia fotográfica.
        </p>
        <p>
          No se aceptan devoluciones por cambio de opinión en productos naturales una vez entregados,
          salvo defecto comprobado de fábrica.
        </p>
      </LegalSection>

      <LegalSection title="7. Productos naturistas — Aviso importante">
        <p>
          Los productos comercializados por Siete Hierbas son de origen natural y no constituyen medicamentos,
          diagnósticos ni tratamientos médicos. No reemplazan la consulta con un profesional de la salud.
          Siete Hierbas no se responsabiliza por el uso inadecuado de los productos.
        </p>
      </LegalSection>

      <LegalSection title="8. Servicio de hospedaje">
        <p>
          Las reservas del hostal se gestionan igualmente vía WhatsApp. El check-in y check-out, las
          condiciones de la habitación y las políticas de cancelación se informan al confirmar la reserva.
        </p>
        <p>
          Siete Hierbas se reserva el derecho de cancelar una reserva en caso de fuerza mayor, notificando
          al huésped con la mayor anticipación posible.
        </p>
      </LegalSection>

      <LegalSection title="9. Propiedad intelectual">
        <p>
          Todos los contenidos de este sitio web (textos, imágenes, marca, diseño) son propiedad de
          Siete Hierbas o de sus respectivos titulares. Está prohibida su reproducción, distribución o
          uso comercial sin autorización expresa.
        </p>
      </LegalSection>

      <LegalSection title="10. Ley aplicable">
        <p>
          Los presentes términos se rigen por la legislación de la República de Colombia. Cualquier
          controversia será sometida a los jueces competentes de Santa Rosa de Cabal, Risaralda.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
