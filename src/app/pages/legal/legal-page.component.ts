import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { getLegalDocument } from '../../content/legal-content';
import { CompanyContactBlockComponent } from '../../components/company-contact-block/company-contact-block.component';
import { SeoService } from '../../services/seo.service';
import { COMPANY } from '../../constants/company.constants';

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [RouterLink, CompanyContactBlockComponent],
  template: `
    @if (document(); as doc) {
      <article class="static-page legal-document">
        <header class="page-hero">
          <p class="page-eyebrow">Información legal</p>
          <h1>{{ doc.title }}</h1>
          <p class="page-meta">Última actualización: {{ doc.lastUpdated }}</p>
        </header>

        <div class="page-layout">
          <div class="page-main">
            @for (section of doc.sections; track section.title) {
              <section class="legal-section">
                <h2>{{ section.title }}</h2>
                @for (p of section.paragraphs; track p) {
                  <p>{{ p }}</p>
                }
                @if (section.list?.length) {
                  <ul>
                    @for (item of section.list; track item) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                }

                @if (section.images?.length) {
                  <div class="legal-image-grid" aria-label="Imágenes">
                    @for (img of section.images; track img.src) {
                      <figure class="legal-figure">
                        <img [src]="img.src" [alt]="img.alt" loading="lazy" />
                        <figcaption>{{ img.alt }}</figcaption>
                      </figure>
                    }
                  </div>
                }
              </section>
            }

            <p class="legal-footer-note">
              {{ company.legalName }} · {{ company.address.formatted }} ·
              <a [href]="'mailto:' + company.email">{{ company.email }}</a>
            </p>
          </div>

          <div class="legal-sidebar">
            <app-company-contact-block />
            <nav class="legal-nav" aria-label="Otras políticas">
              <h3>Más información</h3>
              <a routerLink="/legal/privacidad">Privacidad</a>
              <a routerLink="/legal/terminos">Términos</a>
              <a routerLink="/legal/devoluciones">Devoluciones</a>
              <a routerLink="/legal/envios">Envíos</a>
              <a routerLink="/sobre-nosotros">Sobre nosotros</a>
              <a routerLink="/cotizacion">Solicitar cotización</a>
            </nav>
          </div>
        </div>
      </article>
    } @else {
      <div class="static-page not-found-legal">
        <h1>Documento no encontrado</h1>
        <p>La página legal solicitada no existe.</p>
        <a routerLink="/" class="btn-primary">Volver al inicio</a>
      </div>
    }
  `,
  styles: [
    `
      .legal-sidebar {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .legal-nav {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1.25rem;
      }

      .legal-nav h3 {
        font-size: 0.9375rem;
        font-weight: 700;
        margin: 0 0 0.75rem;
        color: var(--text-primary);
      }

      .legal-nav a {
        display: block;
        padding: 0.4rem 0;
        font-size: 0.875rem;
        color: var(--accent);
        text-decoration: none;
      }

      .legal-nav a:hover {
        text-decoration: underline;
      }

      .not-found-legal {
        text-align: center;
        padding: 3rem 1rem;
      }

      .not-found-legal h1 {
        margin-bottom: 0.5rem;
      }

      .not-found-legal .btn-primary {
        margin-top: 1rem;
      }

      .legal-image-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-top: 1rem;
      }

      .legal-figure {
        margin: 0;
      }

      .legal-figure img {
        width: 100%;
        height: 210px;
        object-fit: contain;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        box-shadow: var(--shadow);
        background: var(--background);
      }

      .legal-figure figcaption {
        margin-top: 0.5rem;
        font-size: 0.8125rem;
        color: var(--text-muted);
        line-height: 1.4;
      }

      @media (max-width: 900px) {
        .legal-image-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .legal-figure img {
          height: 190px;
        }
      }

      @media (max-width: 640px) {
        .legal-image-grid {
          grid-template-columns: 1fr;
        }
        .legal-figure img {
          height: 220px;
        }
      }
    `,
  ],
  styleUrls: ['../static-pages.css'],
})
export class LegalPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  readonly company = COMPANY;

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')),
    { initialValue: '' },
  );

  readonly document = computed(() => getLegalDocument(this.slug()));

  constructor() {
    effect(() => {
      const doc = this.document();
      if (doc) {
        this.seo.setPage({
          title: doc.title,
          description: doc.metaDescription,
          urlPath: `/legal/${doc.slug}`,
        });
      }
    });
  }
}
