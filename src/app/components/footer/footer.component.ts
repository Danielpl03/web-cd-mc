import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  COMPANY,
  COMPANY_MAILTO,
  COMPANY_PHONE_TEL,
} from '../../constants/company.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <section class="footer-brand" aria-labelledby="footer-brand-heading">
            <h2 id="footer-brand-heading">{{ company.displayName }}</h2>
            <p class="footer-tagline">{{ company.tagline }}</p>
            <p class="footer-legal-name">{{ company.legalName }}</p>
            <address class="footer-address">
              {{ company.address.line1 }}<br />
              {{ company.address.city }}, {{ company.address.state }}
              {{ company.address.zip }}<br />
              {{ company.address.country }}
            </address>
          </section>

          <nav class="footer-nav" aria-labelledby="footer-nav-heading">
            <h3 id="footer-nav-heading">Empresa</h3>
            <a routerLink="/sobre-nosotros">Sobre nosotros</a>
            <a routerLink="/cotizacion">Solicitar cotización</a>
            <a routerLink="/">Catálogo</a>
            <a routerLink="/carrito">Carrito</a>
          </nav>

          <nav class="footer-nav" aria-labelledby="footer-legal-heading">
            <h3 id="footer-legal-heading">Legal</h3>
            <a routerLink="/legal/privacidad">Política de privacidad</a>
            <a routerLink="/legal/terminos">Términos y condiciones</a>
            <a routerLink="/legal/devoluciones">Devoluciones y reembolsos</a>
            <a routerLink="/legal/envios">Política de envíos</a>
          </nav>

          <section class="footer-contact" aria-labelledby="footer-contact-heading">
            <h3 id="footer-contact-heading">Contacto</h3>
            <p>
              <a [href]="phoneHref">{{ company.phoneDisplay }}</a>
            </p>
            <p>
              <a [href]="mailHref">{{ company.email }}</a>
            </p>
            <p class="footer-hub">
              Operaciones logísticas: {{ company.location.logisticsHub }}
            </p>
          </section>
        </div>

        <div class="footer-bottom">
          <p>
            &copy; {{ currentYear }} {{ company.legalName }}. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        background: var(--primary);
        color: white;
        margin-top: auto;
        padding: 2.5rem 1.5rem 1.25rem;
      }

      .footer-inner {
        max-width: 1400px;
        margin: 0 auto;
      }

      .footer-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr 1fr 1fr;
        gap: 2rem 1.5rem;
        margin-bottom: 2rem;
      }

      .footer-brand h2 {
        font-size: 1.125rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
      }

      .footer-tagline {
        font-size: 0.875rem;
        opacity: 0.9;
        margin: 0 0 0.75rem;
        line-height: 1.5;
      }

      .footer-legal-name {
        font-size: 0.8125rem;
        opacity: 0.75;
        margin: 0 0 0.5rem;
      }

      .footer-address {
        font-style: normal;
        font-size: 0.875rem;
        line-height: 1.55;
        opacity: 0.88;
      }

      .footer-nav h3,
      .footer-contact h3 {
        font-size: 0.8125rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin: 0 0 0.75rem;
        opacity: 0.85;
      }

      .footer-nav a {
        display: block;
        color: rgba(255, 255, 255, 0.88);
        font-size: 0.875rem;
        padding: 0.25rem 0;
        text-decoration: none;
        transition: color 0.2s;
      }

      .footer-nav a:hover {
        color: var(--accent-light);
      }

      .footer-contact p {
        font-size: 0.875rem;
        margin: 0 0 0.35rem;
        opacity: 0.9;
      }

      .footer-contact a {
        color: var(--accent-light);
        text-decoration: none;
      }

      .footer-contact a:hover {
        text-decoration: underline;
      }

      .footer-hub {
        margin-top: 0.75rem !important;
        font-size: 0.8125rem !important;
        opacity: 0.75 !important;
        line-height: 1.45;
      }

      .footer-bottom {
        padding-top: 1.25rem;
        border-top: 1px solid rgba(255, 255, 255, 0.15);
        text-align: center;
      }

      .footer-bottom p {
        font-size: 0.8125rem;
        opacity: 0.75;
        margin: 0;
      }

      @media (max-width: 900px) {
        .footer-grid {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (max-width: 520px) {
        .footer-grid {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
      }
    `,
  ],
})
export class FooterComponent {
  readonly company = COMPANY;
  readonly phoneHref = `tel:${COMPANY_PHONE_TEL}`;
  readonly mailHref = COMPANY_MAILTO;
  currentYear = new Date().getFullYear();
}
