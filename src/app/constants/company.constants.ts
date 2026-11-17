/** Información corporativa pública (footer, legales, cotizaciones). */
export const COMPANY = {
  legalName: 'C&D Marquez Corp',
  displayName: 'C&D Marquez Corp',
  tagline:
    'Distribución mayorista y minorista.',
  address: {
    line1: '18324 SW 152nd Pl',
    city: 'Miami',
    state: 'FL',
    zip: '33187',
    country: 'United States',
    formatted: '18324 SW 152nd Pl, Miami, FL 33187, United States',
  },
  phone: '+17866919325',
  phoneDisplay: '+1 (786)-691-9325',
  email: 'cdmarquez.corp@gmail.com',
  location: {
    headquarters: 'Miami, Florida, USA',
    logisticsHub: 'Zona Libre de Colón, Panamá',
  },
  business: {
    wholesale: true,
    retail: true,
    internationalTrade: true,
  },
  productCategories: [
    'Herramientas y equipos de energía renovable',
    'Electrodomésticos y línea blanca',
    'Hogar y ferretería',
    'Productos para comercio y distribución',
  ],
} as const;

export const COMPANY_PHONE_TEL = `${COMPANY.phone}`;

export const COMPANY_MAILTO = `mailto:${COMPANY.email}`;
