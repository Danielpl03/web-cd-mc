# Web CD-MC --- C&D Marquez Corp

Aplicación web de ventas online desarrollada con Angular 18 y Supabase.
Permite consultar el catálogo de productos, navegar por departamentos y
categorías, realizar búsquedas, gestionar un carrito de compras y enviar
pedidos o solicitudes de cotización mediante WhatsApp.

**Producción:** https://marquez-corp-cd.vercel.app/\
**Repositorio:** https://github.com/Danielpl03/web-cd-mc

## 1. Tecnologías

  Tecnología               Uso
  ------------------------ ------------------------------------------
  Angular 18               Framework frontend.
  TypeScript 5.5           Lenguaje principal.
  RxJS 7.8                 Programación reactiva.
  Angular Signals          Gestión del estado reactivo.
  Angular Router           Navegación entre páginas y lazy loading.
  Angular Reactive Forms   Formularios y validaciones.
  Supabase JS 2            Acceso al backend y base de datos.
  PostgreSQL               Base de datos de Supabase.
  Vercel                   Despliegue de producción.
  Jasmine / Karma          Pruebas unitarias.

La aplicación utiliza componentes standalone, sin necesidad de módulos
tradicionales de Angular.

## 2. Arquitectura

El proyecto sigue una arquitectura frontend modular, separando la
presentación, el acceso a datos, los modelos y la gestión del estado.

``` text
             APLICACIÓN ANGULAR
                     |
          +----------+----------+
          |                     |
       PAGES                COMPONENTS
          |                     |
          +----------+----------+
                     |
                 SERVICES
                     |
          +----------+----------+
          |          |          |
       Supabase     Cart       SEO
       Service     Service   Service
          |
          v
       SUPABASE
          |
       PostgreSQL
```

**Responsabilidades principales:**

-   `pages/`: páginas completas y funcionalidades de navegación.
-   `components/`: elementos reutilizables de interfaz.
-   `services/`: lógica compartida, acceso a datos y gestión del estado.
-   `models/`: interfaces y estructuras de datos.
-   `constants/`: constantes generales del negocio.
-   `content/`: contenido estático de la aplicación.

## 3. Estructura del código fuente

``` text
src/
├── app/
│   ├── components/
│   │   ├── category-chip/
│   │   ├── company-contact-block/
│   │   ├── department-card/
│   │   ├── empty-state/
│   │   ├── footer/
│   │   ├── header/
│   │   ├── loading-spinner/
│   │   └── product-card/
│   │
│   ├── pages/
│   │   ├── home/
│   │   ├── about/
│   │   ├── department/
│   │   ├── category/
│   │   ├── product/
│   │   ├── search/
│   │   ├── cart/
│   │   ├── quote-request/
│   │   └── legal/
│   │
│   ├── services/
│   │   ├── supabase.service.ts
│   │   ├── cart.service.ts
│   │   └── seo.service.ts
│   │
│   ├── models/
│   │   ├── store.models.ts
│   │   └── quote.models.ts
│   │
│   ├── constants/
│   ├── content/
│   ├── environment.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
│
└── ...
```

### Servicios principales

**SupabaseService**

Es la capa de acceso a los datos del catálogo. Centraliza las consultas
a Supabase y gestiona información de:

-   Departamentos y categorías.
-   Productos y sus detalles.
-   Precios en USD.
-   Imágenes de productos.
-   Etiquetas y fichas técnicas.
-   Productos recomendados.
-   Búsqueda de productos.

Implementa cachés en memoria para reutilizar información y reducir
consultas repetidas.

**CartService**

Gestiona el carrito mediante Angular Signals.

Sus principales responsabilidades son: - Agregar y eliminar productos. -
Modificar cantidades. - Calcular subtotal y cantidad total. - Persistir
el carrito en `localStorage`.

La clave utilizada para almacenar el carrito es `cd-marquez-cart`.

**SeoService**

Centraliza la configuración SEO de las páginas: - Títulos y
descripciones. - URLs canónicas. - Metadatos Open Graph y Twitter. -
Etiquetas de indexación. - Datos estructurados JSON-LD.

## 4. Navegación

Las rutas están definidas en `app.routes.ts` y utilizan carga diferida
mediante `loadComponent`.

  Ruta                  Funcionalidad
  --------------------- -----------------------------
  `/`                   Página principal.
  `/sobre-nosotros`     Información de la empresa.
  `/departamento/:id`   Productos por departamento.
  `/categoria/:id`      Productos por categoría.
  `/producto/:id`       Detalle del producto.
  `/buscar`             Búsqueda de productos.
  `/carrito`            Gestión del carrito.
  `/cotizacion`         Solicitud de cotizaciones.
  `/legal/:slug`        Páginas legales.

El componente raíz `AppComponent` mantiene la estructura común de la
aplicación: encabezado, contenido de navegación y pie de página.

## 5. Configuración y ejecución

### Requisitos

-   Node.js compatible con Angular 18.
-   npm.
-   Git.

### Instalación

``` bash
git clone https://github.com/Danielpl03/web-cd-mc.git

cd web-cd-mc

npm install
```

### Configuración

Los parámetros de conexión y configuración de la aplicación se
encuentran en:

`src/app/environment.ts`

Incluye: - URL del sitio. - URL y clave pública de Supabase. - Nombre
del bucket de imágenes. - Número de WhatsApp para pedidos.

Para utilizar otra instancia de Supabase, deben actualizarse los
parámetros correspondientes y disponer de la estructura de datos y
almacenamiento esperada por `SupabaseService`.

La clave utilizada en el frontend debe ser exclusivamente una clave
pública (publishable/anon). Nunca incorporar claves `service_role` ni
credenciales administrativas. El acceso a los datos debe protegerse
mediante las políticas RLS de Supabase.

### Comandos

  Comando           Descripción
  ----------------- ----------------------------------
  `npm start`       Ejecutar servidor de desarrollo.
  `npm run build`   Compilar para producción.
  `npm run watch`   Compilar observando cambios.
  `npm test`        Ejecutar pruebas unitarias.

El servidor de desarrollo estará disponible en `http://localhost:4200/`.

## 6. Consideraciones para nuevos desarrolladores

Antes de modificar o incorporar funcionalidades:

1.  Revisar `app.routes.ts` para comprender la navegación.
2.  Consultar `store.models.ts` para conocer las estructuras de datos.
3.  Utilizar `SupabaseService` para las operaciones relacionadas con el
    catálogo, evitando duplicar consultas.
4.  Utilizar `CartService` para cualquier modificación del carrito.
5.  Mantener la lógica reutilizable fuera de los componentes cuando
    corresponda.
6.  Actualizar `SeoService` cuando se incorporen nuevas páginas o se
    modifiquen sus metadatos.
7.  Mantener la compatibilidad con Angular 18 y las dependencias
    existentes.

**Importante:** El carrito es local y los pedidos y cotizaciones se
canalizan mediante WhatsApp. No implementar una supuesta pasarela de
pagos o persistencia de pedidos sin definir primero esa funcionalidad.

## 7. Documentación

-   [Angular](https://angular.dev/)
-   [Angular Router](https://angular.dev/guide/routing)
-   [Angular Signals](https://angular.dev/guide/signals)
-   [Supabase](https://supabase.com/docs)
-   [Supabase
    JavaScript](https://supabase.com/docs/reference/javascript/introduction)
-   [Vercel](https://vercel.com/docs)
