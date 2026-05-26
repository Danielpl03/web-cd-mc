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
              <strong>distribución mayorista</strong> y al
              <strong>comercio internacional</strong> de productos comerciales y de consumo.
              Trabajamos con proveedores y aliados logísticos confiables para conectar productos
              con clientes en Estados Unidos, Latinoamérica y el Caribe con catálogos
              competitivos y procesos comerciales transparentes.
            </p>
            <p>
              Nuestra operación combina la proximidad al mercado estadounidense
              con una relación logística estratégica en la
              <strong>{{ company.location.logisticsHub }}</strong>, lo que nos
              permite consolidar cargas, optimizar tiempos y ofrecer soluciones
              adaptadas a clientes mayoristas y distribuidores.
            </p>
          </section>

          <section class="content-section">
            <h2>Qué hacemos</h2>
            <ul class="feature-list">
              <li>Distribución mayorista B2B con cotizaciones por volumen</li>
              <li>Coordinación logística desde Miami y Zona Libre de Colón</li>
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
              Explore nuestro catálogo en línea por departamentos o solicite una
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
      description: `${COMPANY.legalName}: distribución mayorista e importación internacional desde Miami, FL, con operaciones logísticas en Zona Libre de Colón, Panamá.`,
      urlPath: '/sobre-nosotros',
    });
  }
}
