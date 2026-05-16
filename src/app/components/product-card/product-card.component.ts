import { Component, computed, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductDetail } from '../../models/store.models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  template: `
    <a [routerLink]="['/producto', product.id_producto]" class="product-card">
      <div class="image-container">
        <img
          [src]="product.imageUrl"
          [alt]="product.descripcion"
          (load)="onImageLoad()"
          (error)="onImageError($event)"
          loading="lazy"
          decoding="async"
        />
        @if (imageLoading) {
          <div class="image-placeholder">
            <div class="skeleton"></div>
          </div>
        }
      </div>
      <div class="product-info">
        <h3 class="product-name">{{ product.descripcion }}</h3>
        @if (product.codigo) {
          <p class="product-code">Código: {{ product.codigo }}</p>
        } @else {
          <p class="product-code">&nbsp;</p>
        }

        @if (availability()) {
          <div
            [class]="
              'availability-badge status-' +
              getAvailabilityClass(availability()!)
            "
            role="status"
            [attr.aria-label]="'Disponibilidad: ' + availability()"
          >
            <span class="availability-dot" aria-hidden="true"></span>
            <span class="availability-text">{{ availability() }}</span>
          </div>
        }

        @if (product.precioUSD) {
          <p class="product-price">
            {{ product.precioUSD | currency: 'USD' : 'symbol' : '1.2-2' }}
          </p>
        }
      </div>
    </a>
  `,
  styles: [
    `
      .product-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--surface);
        border-radius: var(--radius);
        overflow: hidden;
        box-shadow: var(--shadow);
        transition:
          transform 0.2s,
          box-shadow 0.2s;
        text-decoration: none;
        color: inherit;
      }

      .product-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
      }

      .image-container {
        position: relative;
        aspect-ratio: 1;
        overflow: hidden;
        background: var(--background);
      }

      .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition:
          transform 0.3s,
          opacity 0.3s;
      }

      .image-placeholder {
        position: absolute;
        inset: 0;
        background: var(--background);
      }

      .skeleton {
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          var(--surface) 25%,
          var(--background) 50%,
          var(--surface) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }

      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      .product-card:hover .image-container img {
        transform: scale(1.05);
      }

      .product-info {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .product-name {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.25rem;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        min-height: 2.8em;
      }

      .product-code {
        font-size: 0.8125rem;
        color: var(--text-muted);
        margin-bottom: 0.5rem;
        min-height: 1.25em;
      }

      .product-price {
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--accent);
        margin-top: auto;
      }

      .availability-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        align-self: flex-start;
        margin: 0.25rem 0 0.65rem;
        padding: 0.4rem 0.65rem 0.4rem 0.55rem;
        border-radius: 9999px;
        font-size: 0.6875rem;
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        white-space: nowrap;
        border: 1px solid transparent;
        box-shadow:
          0 1px 2px rgba(26, 39, 68, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 0.65);
      }

      .availability-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex-shrink: 0;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.7);
      }

      .availability-text {
        max-width: 11rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .availability-badge.status-disponible {
        color: #0f5132;
        background: linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%);
        border-color: rgba(16, 185, 129, 0.35);
      }

      .availability-badge.status-disponible .availability-dot {
        background: #10b981;
        box-shadow:
          0 0 0 2px rgba(255, 255, 255, 0.7),
          0 0 10px rgba(16, 185, 129, 0.45);
      }

      .availability-badge.status-agotado {
        color: #842029;
        background: linear-gradient(180deg, #fef2f2 0%, #fee2e2 100%);
        border-color: rgba(239, 68, 68, 0.3);
      }

      .availability-badge.status-agotado .availability-dot {
        background: #ef4444;
        box-shadow:
          0 0 0 2px rgba(255, 255, 255, 0.7),
          0 0 8px rgba(239, 68, 68, 0.35);
      }

      .availability-badge.status-otros {
        color: #664d03;
        background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%);
        border-color: rgba(245, 158, 11, 0.35);
      }

      .availability-badge.status-otros .availability-dot {
        background: #f59e0b;
        box-shadow:
          0 0 0 2px rgba(255, 255, 255, 0.7),
          0 0 8px rgba(245, 158, 11, 0.4);
      }
    `,
  ],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductDetail;
  imageLoading = true;

  availability = computed(() => {
    return this.product.etiquetasInt.find((ep) => ep.id_etiqueta == 5)?.valor;
  });

  onImageLoad(): void {
    this.imageLoading = false;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'images/placeholder.jpg';
    this.imageLoading = false;
  }

  getAvailabilityClass(value: string): string {
    const v = value.trim().toUpperCase();
    if (v === 'DISPONIBLE') return 'disponible';
    if (v === 'AGOTADO') return 'agotado';
    return 'otros';
  }
}
