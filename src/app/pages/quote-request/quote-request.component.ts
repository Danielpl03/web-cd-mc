import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { COMPANY } from '../../constants/company.constants';
import { CompanyContactBlockComponent } from '../../components/company-contact-block/company-contact-block.component';
import { SeoService } from '../../services/seo.service';
import { environment } from '../../environment';
import { QuoteRequest } from '../../models/quote.models';

@Component({
  selector: 'app-quote-request',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CompanyContactBlockComponent],
  template: `
    <article class="static-page">
      <header class="page-hero">
        <p class="page-eyebrow">Cotización B2B</p>
        <h1>Solicitar cotización</h1>
        <p class="page-lead">
          Complete el formulario y envíe su solicitud por WhatsApp. Nuestro
          equipo comercial de {{ company.legalName }} le responderá con precios,
          disponibilidad y opciones de retiro o envío.
          <br />
          Los productos se gestionan en <strong>Panamá</strong>. Una vez acordada
          una compra, puede <strong>recoger en nuestros almacenes</strong> o
          <strong> coordinar envío</strong> con un tercero logístico. Para
          destinos internacionales, nuestros afiliados se encargan del
          transporte. Los <strong>costos de envío</strong> se coordinan
          directamente con la compañía logística responsable.
        </p>
      </header>

      <div class="page-layout">
        <div class="page-main">
          @if (submitted()) {
            <div class="form-success" role="status">
              <h2>Abra WhatsApp para enviar</h2>
              <p>
                Se abrió WhatsApp con el mensaje de cotización. Confirme el
                envío en la aplicación para que nuestro equipo pueda atenderle.
              </p>
              <button type="button" class="btn-secondary" (click)="resetForm()">
                Nueva solicitud
              </button>
            </div>
          } @else {
            <form
              class="quote-form"
              [formGroup]="form"
              (ngSubmit)="onSubmit()"
              novalidate
            >
              <div class="form-grid">
                <div class="form-field">
                  <label for="nombre">Nombre completo *</label>
                  <input
                    id="nombre"
                    type="text"
                    formControlName="nombre"
                    autocomplete="name"
                  />
                  @if (
                    form.get('nombre')?.touched && form.get('nombre')?.invalid
                  ) {
                    <span class="field-error">Indique su nombre</span>
                  }
                </div>

                <div class="form-field">
                  <label for="empresa">Empresa</label>
                  <input
                    id="empresa"
                    type="text"
                    formControlName="empresa"
                    autocomplete="organization"
                  />
                </div>

                <div class="form-field form-field-full">
                  <label for="producto">Producto o descripción *</label>
                  <textarea
                    id="producto"
                    rows="3"
                    formControlName="producto"
                    placeholder="Marca, modelo, código o descripción del artículo"
                  ></textarea>
                  @if (
                    form.get('producto')?.touched &&
                    form.get('producto')?.invalid
                  ) {
                    <span class="field-error">Describa el producto</span>
                  }
                </div>

                <div class="form-field">
                  <label for="cantidad">Cantidad *</label>
                  <input
                    id="cantidad"
                    type="text"
                    formControlName="cantidad"
                    placeholder="Ej. 50 unidades, 2 contenedores"
                  />
                  @if (
                    form.get('cantidad')?.touched &&
                    form.get('cantidad')?.invalid
                  ) {
                    <span class="field-error">Indique la cantidad</span>
                  }
                </div>

                <div class="form-field">
                  <label for="pais">País de destino *</label>
                  <input
                    id="pais"
                    type="text"
                    formControlName="pais"
                    autocomplete="country-name"
                  />
                  @if (form.get('pais')?.touched && form.get('pais')?.invalid) {
                    <span class="field-error">Indique el país</span>
                  }
                </div>

                <div class="form-field">
                  <label for="telefono">Teléfono</label>
                  <input
                    id="telefono"
                    type="tel"
                    formControlName="telefono"
                    autocomplete="tel"
                  />
                </div>

                <div class="form-field">
                  <label for="email">Correo electrónico *</label>
                  <input
                    id="email"
                    type="email"
                    formControlName="email"
                    autocomplete="email"
                  />
                  @if (form.get('email')?.touched && form.get('email')?.invalid) {
                    <span class="field-error">Indique un correo válido</span>
                  }
                </div>
              </div>

              <p class="form-privacy">
                Al enviar acepta nuestra
                <a routerLink="/legal/privacidad">Política de Privacidad</a>.
              </p>

              @if (submitError()) {
                <p class="form-error" role="alert">{{ submitError() }}</p>
              }

              <button type="submit" class="btn-primary btn-submit">
                Enviar cotización por WhatsApp
              </button>
            </form>
          }
        </div>

        <app-company-contact-block />
      </div>
    </article>
  `,
  styles: [
    `
      .quote-form {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1.5rem;
        box-shadow: var(--shadow);
      }

      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem 1.25rem;
      }

      .form-field-full {
        grid-column: 1 / -1;
      }

      .form-field label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.35rem;
      }

      .form-field input,
      .form-field textarea {
        width: 100%;
        padding: 0.65rem 0.85rem;
        border: 2px solid var(--border);
        border-radius: var(--radius-sm);
        font: inherit;
        background: var(--background);
        transition: border-color 0.2s;
      }

      .form-field input:focus,
      .form-field textarea:focus {
        outline: none;
        border-color: var(--accent);
      }

      .field-error {
        display: block;
        font-size: 0.8125rem;
        color: #b42318;
        margin-top: 0.25rem;
      }

      .form-privacy {
        font-size: 0.8125rem;
        color: var(--text-muted);
        margin: 1rem 0;
      }

      .form-privacy a {
        color: var(--accent);
      }

      .form-error {
        color: #b42318;
        font-size: 0.875rem;
        margin-bottom: 0.75rem;
      }

      .btn-submit {
        width: 100%;
        border: none;
        cursor: pointer;
        background: #25d366;
      }

      .btn-submit:hover:not(:disabled) {
        background: #1ebe57;
      }

      .btn-submit:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }

      .form-success {
        background: #ecfdf5;
        border: 1px solid #a7f3d0;
        border-radius: var(--radius);
        padding: 1.5rem;
      }

      .form-success h2 {
        font-size: 1.25rem;
        color: #065f46;
        margin: 0 0 0.5rem;
      }

      .form-success p {
        color: #047857;
        line-height: 1.6;
        margin: 0 0 0.75rem;
      }

      .form-note {
        font-size: 0.875rem;
      }

      @media (max-width: 640px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  styleUrls: ['../static-pages.css'],
})
export class QuoteRequestComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  readonly company = COMPANY;
  readonly form: FormGroup;
  readonly submitted = signal(false);
  readonly submitError = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private seo: SeoService,
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(120)]],
      empresa: ['', Validators.maxLength(120)],
      producto: ['', [Validators.required, Validators.maxLength(500)]],
      cantidad: ['', [Validators.required, Validators.maxLength(80)]],
      pais: ['', [Validators.required, Validators.maxLength(80)]],
      telefono: ['', Validators.maxLength(40)],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    });
  }

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Solicitar Cotización',
      description: `Solicitar cotización B2B/B2C a ${COMPANY.legalName}. Productos gestionados en Panamá con retiro o envío coordinado por terceros; para envíos internacionales, afiliados gestionan el transporte.`,
      urlPath: '/cotizacion',
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.submitError.set(null);

    if (!isPlatformBrowser(this.platformId)) return;

    const payload = this.buildPayload();
    const opened = this.openWhatsAppQuote(payload);
    if (!opened) {
      this.submitError.set(
        'No se pudo abrir WhatsApp. Verifique que tenga la aplicación instalada o contacte por teléfono.',
      );
      return;
    }

    this.submitted.set(true);
  }

  resetForm(): void {
    this.form.reset();
    this.submitted.set(false);
    this.submitError.set(null);
  }

  private buildPayload(): QuoteRequest {
    const v = this.form.getRawValue();
    return {
      nombre: String(v.nombre).trim(),
      empresa: v.empresa?.trim() ? String(v.empresa).trim() : null,
      producto: String(v.producto).trim(),
      cantidad: String(v.cantidad).trim(),
      pais: String(v.pais).trim(),
      telefono: v.telefono?.trim() ? String(v.telefono).trim() : null,
      email: String(v.email).trim(),
    };
  }

  private openWhatsAppQuote(payload: QuoteRequest): boolean {
    const lines = [
      'Hola, solicito una cotización desde el sitio web:',
      '',
      `*Nombre:* ${payload.nombre}`,
      `*Empresa:* ${payload.empresa ?? '—'}`,
      `*Producto:* ${payload.producto}`,
      `*Cantidad:* ${payload.cantidad}`,
      `*País de destino:* ${payload.pais}`,
      `*Teléfono:* ${payload.telefono ?? '—'}`,
      `*Email:* ${payload.email}`,
    ];
    const encoded = encodeURIComponent(lines.join('\n'));
    const phoneDigits = (environment.whatsappOrderPhone ?? '').replace(
      /\D/g,
      '',
    );
    const url =
      phoneDigits.length > 0
        ? `https://wa.me/${phoneDigits}?text=${encoded}`
        : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
  }
}
