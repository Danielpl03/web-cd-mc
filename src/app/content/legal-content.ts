import { COMPANY } from '../constants/company.constants';

export type LegalSection = {
  title: string;
  paragraphs: string[];
  list?: string[];
  images?: { src: string; alt: string }[];
};

export type LegalDocument = {
  slug: string;
  title: string;
  metaDescription: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export const LEGAL_DOCUMENTS: Record<string, LegalDocument> = {
  privacidad: {
    slug: 'privacidad',
    title: 'Política de Privacidad',
    metaDescription:
      'Política de privacidad de C&D Marquez Corp: cómo recopilamos, usamos y protegemos sus datos personales.',
    lastUpdated: '2026-05-26',
    sections: [
      {
        title: '1. Responsable del tratamiento',
        paragraphs: [
          `${COMPANY.legalName} ("nosotros", "la Empresa"), con domicilio en ${COMPANY.address.formatted}, es responsable del tratamiento de los datos personales recopilados a través de este sitio web y de los canales de contacto asociados.`,
        ],
      },
      {
        title: '2. Datos que recopilamos',
        paragraphs: [
          'Podemos recopilar los siguientes tipos de información cuando usted navega, realiza consultas o envía formularios en nuestro sitio:',
        ],
        list: [
          'Datos de identificación y contacto: nombre, empresa, correo electrónico, teléfono y país.',
          'Datos comerciales: productos de interés, cantidades solicitadas y mensajes enviados en cotizaciones o consultas.',
          'Datos técnicos: dirección IP, tipo de navegador, páginas visitadas y cookies estrictamente necesarias para el funcionamiento del sitio.',
        ],
      },
      {
        title: '3. Finalidad del tratamiento',
        paragraphs: [
          'Utilizamos sus datos para responder solicitudes de cotización, procesar pedidos, comunicarnos por correo o WhatsApp, cumplir obligaciones legales, mejorar nuestros servicios y mantener la seguridad del sitio.',
        ],
      },
      {
        title: '4. Base legal y conservación',
        paragraphs: [
          'El tratamiento se basa en su consentimiento, la ejecución de medidas precontractuales o contractuales, y el interés legítimo de la Empresa en operar su actividad comercial. Conservamos los datos el tiempo necesario para las finalidades indicadas y según la normativa aplicable.',
        ],
      },
      {
        title: '5. Compartición de datos',
        paragraphs: [
          'No vendemos datos personales. Podemos compartir información con proveedores de hosting, pasarelas de pago, mensajería y logística únicamente para prestar el servicio solicitado, bajo obligaciones de confidencialidad.',
        ],
      },
      {
        title: '6. Sus derechos',
        paragraphs: [
          `Puede solicitar acceso, rectificación, supresión u oposición escribiendo a ${COMPANY.email}. Responderemos en un plazo razonable conforme a la ley aplicable.`,
        ],
      },
      {
        title: '7. Seguridad',
        paragraphs: [
          'Aplicamos medidas técnicas y organizativas razonables para proteger la información. Ningún sistema en Internet es 100 % seguro; le recomendamos no enviar datos sensibles innecesarios por canales no cifrados.',
        ],
      },
      {
        title: '8. Cambios',
        paragraphs: [
          'Podemos actualizar esta política. La fecha de última revisión se indica al inicio del documento. El uso continuado del sitio tras los cambios implica su aceptación.',
        ],
      },
    ],
  },
  terminos: {
    slug: 'terminos',
    title: 'Términos y Condiciones',
    metaDescription:
      'Términos y condiciones de uso del sitio web y servicios comerciales de C&D Marquez Corp.',
    lastUpdated: '2026-05-26',
    sections: [
      {
        title: '1. Aceptación',
        paragraphs: [
          `Al acceder a este sitio web operado por ${COMPANY.legalName}, usted acepta estos Términos y Condiciones. Si no está de acuerdo, debe abstenerse de utilizar el sitio.`,
        ],
      },
      {
        title: '2. Naturaleza del servicio',
        paragraphs: [
          `${COMPANY.legalName} opera con sede en Miami, Florida. Los productos se gestionan y encuentran en Panamá. Ofrecemos atención tanto para clientes mayoristas como para compras minoristas. Una vez acordada una compra, el cliente puede retirar en almacenes en Panamá o coordinar envío con terceros logísticos. Para destinos internacionales, nuestros afiliados gestionan el transporte. Los precios, disponibilidad y condiciones de entrega se confirman al formalizar cada pedido o cotización, incluyendo los costos de envío que se coordinen con la compañía logística responsable.`,
        ],
      },
      {
        title: '3. Uso del sitio',
        paragraphs: [
          'El usuario se compromete a utilizar el sitio de forma lícita, sin intentar dañar, interceptar o acceder sin autorización a sistemas o datos de la Empresa o de terceros.',
        ],
      },
      {
        title: '4. Pedidos y cotizaciones',
        paragraphs: [
          'Las solicitudes enviadas por formulario, correo o WhatsApp no constituyen un contrato vinculante hasta confirmación expresa por parte de la Empresa. Nos reservamos el derecho de rechazar pedidos por causas comerciales, regulatorias o de inventario.',
        ],
      },
      {
        title: '5. Precios y pagos',
        paragraphs: [
          'Los precios mostrados en el catálogo son referenciales en USD salvo indicación contraria. Impuestos, aranceles, fletes y comisiones bancarias pueden aplicarse según destino y método de pago acordado.',
        ],
      },
      {
        title: '6. Propiedad intelectual',
        paragraphs: [
          'Contenidos, marcas, logotipos e imágenes del sitio pertenecen a la Empresa o a sus licenciantes. Queda prohibida su reproducción sin autorización escrita.',
        ],
      },
      {
        title: '7. Limitación de responsabilidad',
        paragraphs: [
          'En la medida permitida por la ley, la Empresa no será responsable por daños indirectos derivados del uso del sitio. La responsabilidad comercial por productos entregados se regirá por el acuerdo específico de cada operación.',
        ],
      },
      {
        title: '8. Ley aplicable',
        paragraphs: [
          'Estos términos se interpretan conforme a las leyes del Estado de Florida, Estados Unidos, sin perjuicio de normas imperativas del país del cliente cuando corresponda.',
        ],
      },
      {
        title: '9. Contacto',
        paragraphs: [
          `Para consultas sobre estos términos: ${COMPANY.email} · ${COMPANY.phoneDisplay}.`,
        ],
      },
    ],
  },
  devoluciones: {
    slug: 'devoluciones',
    title: 'Política de Devoluciones y Reembolsos',
    metaDescription:
      'Política de devoluciones, cambios y reembolsos de C&D Marquez Corp.',
    lastUpdated: '2026-05-26',
    sections: [
      {
        title: '1. Alcance',
        paragraphs: [
          `Esta política aplica a compras realizadas con ${COMPANY.legalName} sujetas a confirmación comercial escrita. Las condiciones específicas de cada factura o contrato prevalecen en caso de conflicto.`,
        ],
      },
      {
        title: '2. Plazo para reportar incidencias',
        paragraphs: [
          'El cliente debe notificar daños, faltantes o discrepancias dentro de los 7 (siete) días calendario posteriores a la recepción documentada de la mercancía, acompañando evidencia fotográfica y detalle del empaque.',
        ],
      },
      {
        title: '3. Productos elegibles',
        paragraphs: [
          'Se evaluarán devoluciones o cambios cuando el producto presente defecto de fabricación, error de despacho atribuible a la Empresa o no corresponda al pedido confirmado. No aplican devoluciones por cambio de opinión en pedidos mayoristas salvo acuerdo previo.',
        ],
      },
      {
        title: '4. Productos no retornables',
        paragraphs: [
          'Artículos personalizados, pedidos especiales importados bajo demanda, productos perecederos o con sellos de seguridad violados pueden no ser elegibles para devolución.',
        ],
      },
      {
        title: '5. Proceso',
        paragraphs: [
          `Contacte a ${COMPANY.email} indicando número de pedido, descripción del problema y fotografías. Tras revisión, indicaremos si procede reemplazo, nota de crédito o reembolso parcial o total.`,
        ],
      },
      {
        title: '6. Reembolsos',
        paragraphs: [
          'Los reembolsos aprobados se procesarán al mismo método de pago utilizado, en un plazo de 10 a 30 días hábiles según entidad financiera. Gastos de envío de retorno corren por cuenta del cliente salvo error comprobado de la Empresa.',
        ],
      },
      {
        title: '7. Cancelaciones',
        paragraphs: [
          'Pedidos en preparación o ya despachados pueden incurrir en cargos de cancelación o logística. Las cancelaciones deben solicitarse por escrito lo antes posible.',
        ],
      },
    ],
  },
  envios: {
    slug: 'envios',
    title: 'Política de Envíos',
    metaDescription:
      'Política de envíos, plazos y logística internacional de C&D Marquez Corp.',
    lastUpdated: '2026-05-26',
    sections: [
      {
        title: '1. Cobertura',
        paragraphs: [
          `${COMPANY.legalName} coordina entregas a partir de Panamá, donde se gestionan y almacenan los productos. Cuando aplique, utilizamos infraestructura logística vinculada a la ${COMPANY.location.logisticsHub} para consolidación y coordinación. Para retiros, el cliente puede recoger en nuestros almacenes en Panamá una vez confirmada la compra. Para envíos, la logística se realiza mediante una compañía tercera responsable del transporte; para destinos internacionales, nuestros afiliados gestionan el traslado. Los costos de envío se coordinan directamente con la compañía logística responsable.`,
        ],
      },
      {
        title: '2. Métodos de envío',
        paragraphs: [
          'Utilizamos transportistas terrestres, marítimos y aéreos según volumen, urgencia y regulaciones del país destino. El método se confirma en la cotización o factura.',
        ],
      },
      {
        title: '3. Plazos estimados',
        paragraphs: [
          'Los tiempos de tránsito son estimados y no garantizados; pueden verse afectados por aduanas, inspecciones, clima o fuerza mayor. El plazo exacto se comunica al confirmar el pedido.',
        ],
      },
      {
        title: '4. Costos de envío',
        paragraphs: [
          'El flete, seguro, despacho aduanero y otros cargos aplicables pueden cotizarse por separado según el destino y el método de transporte. Salvo pacto en contrario, el cliente asume los impuestos de importación en su país. En todos los casos, los costos de envío se coordinan directamente con la compañía logística responsable del traslado, quien confirma el presupuesto final de acuerdo con los requisitos del servicio.',
        ],
      },
      {
        title: '5. Seguimiento',
        paragraphs: [
          'Cuando el transportista lo permita, proporcionaremos número de guía o referencia de seguimiento. Es responsabilidad del consignatario facilitar dirección correcta y datos de contacto.',
        ],
      },
      {
        title: '6. Recepción',
        paragraphs: [
          'Verifique el estado del embalaje al recibir. Cualquier daño visible debe anotarse con el transportista y reportarse a la Empresa dentro del plazo indicado en la política de devoluciones.',
        ],
      },
      {
        title: '7. Contacto logístico',
        paragraphs: [
          `Consultas de envío: ${COMPANY.email} · Tel. ${COMPANY.phoneDisplay}.`,
        ],
      },
      {
        title: 'Compañía logística (referencial)',
        paragraphs: [
          'A continuación se muestran imágenes de la compañía aliada que coordina el transporte y el proceso logístico según el destino de cada compra.',
        ],
        images: [
          { src: 'images/logistica-1.jpg', alt: 'Logística - carga 1' },
          { src: 'images/logistica-2.jpg', alt: 'Logística - carga 2' },
          { src: 'images/logistica-3.jpg', alt: 'Logística - carga 3' },
        ],
      },
    ],
  },
};

export function getLegalDocument(slug: string): LegalDocument | undefined {
  return LEGAL_DOCUMENTS[slug];
}
