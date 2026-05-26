import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPANY } from '../../constants/company.constants';
import { CompanyContactBlockComponent } from '../../components/company-contact-block/company-contact-block.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, CompanyContactBlockComponent],
  template: `
    <article class="static-page">
      <header class="page-hero">
        <p class="page-eyebrow">Sobre nosotros</p>
        <h1>{{ company.displayName }}</h1>
        <p class="page-lead">{{ company.tagline }}</p>
      </header>

      <div class="page-layout">
        <div class="page-main">
          <section class="content-section">
            <h2>Quiénes somos</h2>
            <p>
              <strong>{{ company.legalName }}</strong> es una empresa con sede en
              <strong>{{ company.location.headquarters }}</strong>, dedicada a la
              <strong>distribución mayorista</strong> y a
              <strong>servicio minorista</strong> (ventas para clientes finales).
              Los <strong>productos</strong> se gestionan y encuentran en <strong>Panamá</strong>.
              Coordinamos la logística con un <strong>tercero</strong> para retiros y envíos,
              incluyendo procesos de consolidación con relación a <strong>{{ company.location.logisticsHub }}</strong>.
              Para destinos internacionales, nuestros <strong>afiliados</strong> se encargan del transporte.
            </p>
            <p>
              Una vez acordada una compra, el cliente puede <strong>recoger</strong> en
              nuestros almacenes en Panamá o <strong>coordinar envío</strong> según destino.
              Los <strong>costos de envío</strong> se coordinan directamente con la
              compañía logística responsable del traslado.
            </p>
          </section>

          <section class="content-section">
            <h2>Nuestros almacenes en Panamá</h2>
            <p>
              Gestionamos la operación y el manejo de productos en Panamá a través de
              un aliado logístico.
            </p>
            <div class="store-gallery" aria-label="Imágenes de nuestros almacenes en Panamá">
              <figure class="store-figure">
                <img
                  src="images/almacen-1.jpg"
                  alt="Almacén en Panamá - vista 1"
                  loading="lazy"
                />
                <figcaption>Almacén (Panamá) - vista 1</figcaption>
              </figure>
              <figure class="store-figure">
                <img
                  src="images/almacen-2.jpg"
                  alt="Almacén en Panamá - vista 2"
                  loading="lazy"
                />
                <figcaption>Almacén (Panamá) - vista 2</figcaption>
              </figure>
            </div>
          </section>

          <section class="content-section">
            <h2>Qué hacemos</h2>
            <ul class="feature-list">
              <li>Distribución mayorista B2B y servicio minorista</li>
              <li>Consolidación y coordinación logística vinculada a Zona Libre de Colón</li>
              <li>Retiro en almacenes en Panamá o coordinación de envío con terceros</li>
              <li>Envíos internacionales gestionados por afiliados</li>
              <li>Atención comercial por correo, teléfono y WhatsApp</li>
            </ul>
          </section>

          <section class="content-section">
            <h2>Tipos de productos</h2>
            <p>
              Trabajamos con un catálogo amplio orientado al comercio y la
              reventa. Entre las líneas que manejamos se incluyen:
            </p>
            <ul class="product-categories">
              @for (cat of company.productCategories; track cat) {
                <li>{{ cat }}</li>
              }
            </ul>
            <p class="note">
              Explore nuestro catálogo en línea o solicite una
              cotización personalizada para pedidos específicos.
            </p>
          </section>

          <section class="content-section cta-row">
            <a routerLink="/cotizacion" class="btn-primary">Solicitar cotización</a>
            <a routerLink="/" class="btn-secondary">Ver catálogo</a>
          </section>
        </div>

        <app-company-contact-block />
      </div>
    </article>
  `,
  styleUrls: ['../static-pages.css'],
})
export class AboutComponent implements OnInit {
  readonly company = COMPANY;

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Sobre Nosotros',
      description: `${COMPANY.legalName}: empresa con sede en Miami, Florida. Productos y operación en Panamá, con retiro en almacenes o envío coordinado por terceros. Para destinos internacionales, afiliados gestionan el transporte y los costos de envío se coordinan con la compañía logística.`,
      urlPath: '/sobre-nosotros',
    });
  }
}
