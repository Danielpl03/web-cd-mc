import { Component } from '@angular/core';
import { COMPANY, COMPANY_MAILTO, COMPANY_PHONE_TEL } from '../../constants/company.constants';

@Component({
  selector: 'app-company-contact-block',
  standalone: true,
  template: `
    <aside class="contact-block" aria-label="Información de contacto de la empresa">
      <h2 class="contact-block-title">Información de la empresa</h2>
      <dl class="contact-list">
        <div class="contact-row">
          <dt>Razón social</dt>
          <dd>{{ company.legalName }}</dd>
        </div>
        <div class="contact-row">
          <dt>Dirección</dt>
          <dd>
            {{ company.address.line1 }}<br />
            {{ company.address.city }}, {{ company.address.state }}
            {{ company.address.zip }}<br />
            {{ company.address.country }}
          </dd>
        </div>
        <div class="contact-row">
          <dt>Teléfono</dt>
          <dd>
            <a [href]="phoneHref">{{ company.phoneDisplay }}</a>
          </dd>
        </div>
        <div class="contact-row">
          <dt>Correo</dt>
          <dd>
            <a [href]="mailHref">{{ company.email }}</a>
          </dd>
        </div>
      </dl>
    </aside>
  `,
  styles: [
    `
      .contact-block {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1.5rem;
        box-shadow: var(--shadow);
      }

      .contact-block-title {
        font-size: 1.0625rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--border);
      }

      .contact-list {
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .contact-row dt {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-muted);
        margin-bottom: 0.25rem;
      }

      .contact-row dd {
        margin: 0;
        font-size: 0.9375rem;
        color: var(--text-primary);
        line-height: 1.5;
      }

      .contact-row a {
        color: var(--accent);
        font-weight: 500;
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      .contact-row a:hover {
        color: var(--primary);
      }
    `,
  ],
})
export class CompanyContactBlockComponent {
  readonly company = COMPANY;
  readonly phoneHref = `tel:${COMPANY_PHONE_TEL}`;
  readonly mailHref = COMPANY_MAILTO;
}
