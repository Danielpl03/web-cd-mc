import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { environment } from '../environment';
import { ProductDetail } from '../models/store.models';

export interface SeoPageConfig {
  title: string;
  description?: string;
  /** Ruta relativa, ej. `/producto/12` o `/buscar?q=x` */
  urlPath?: string;
  /** URL absoluta de imagen para Open Graph (producto, etc.) */
  imageUrl?: string | null;
  pageType?: 'website' | 'product';
  /** true en carrito, errores 404 internos, etc. */
  noIndex?: boolean;
  /** JSON-LD opcional (se reemplaza el nodo `#seo-structured-data`) */
  jsonLd?: Record<string, unknown> | null;
  /** Dimensiones exactas de la imagen (mejora previsualización en WhatsApp) */
  imageWidth?: number;
  imageHeight?: number;
  /** Texto alternativo de la imagen para og:image:alt */
  imageAlt?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  readonly brand = 'C&D Marquez Corp';
  readonly defaultDescription =
    'Tienda en línea C&D Marquez Corp: Haz tus pedidos y consulta por WhatsApp.';

  setPage(config: SeoPageConfig): void {
    

    const fullTitle = config.title.includes(this.brand)
      ? config.title
      : `${config.title} | ${this.brand}`;

    this.titleService.setTitle(fullTitle);

    const description = (config.description ?? this.defaultDescription).slice(0, 320);
    this.meta.updateTag({ name: 'description', content: description });

    const origin = this.resolveOrigin();
    let canonicalUrl: string;
    if (config.urlPath != null && config.urlPath !== '') {
      const p = config.urlPath.startsWith('/') ? config.urlPath : `/${config.urlPath}`;
      canonicalUrl = `${origin}${p}`;
    } else {
      const pathname =
        typeof this.document.defaultView?.location?.pathname === 'string'
          ? this.document.defaultView.location.pathname
          : '/';
      const search =
        typeof this.document.defaultView?.location?.search === 'string'
          ? this.document.defaultView.location.search
          : '';
      canonicalUrl = `${origin}${pathname}${search}`;
    }

    const ogType = config.pageType === 'product' ? 'product' : 'website';
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: ogType });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:site_name', content: this.brand });
    this.meta.updateTag({ property: 'og:locale', content: 'es_ES' });

    const absImage = this.toAbsoluteImageUrl(config.imageUrl, origin);
    if (absImage) {
      this.meta.updateTag({ property: 'og:image', content: absImage });
      this.meta.updateTag({ name: 'twitter:image', content: absImage });
      // Añadir etiquetas adicionales para WhatsApp
      if (absImage.startsWith('https://')) {
        this.meta.updateTag({ property: 'og:image:secure_url', content: absImage });
      } else {
        this.meta.removeTag('property="og:image:secure_url"');
      }
      if (config.imageWidth != null) {
        this.meta.updateTag({ property: 'og:image:width', content: String(config.imageWidth) });
      } else {
        this.meta.removeTag('property="og:image:width"');
      }
      if (config.imageHeight != null) {
        this.meta.updateTag({ property: 'og:image:height', content: String(config.imageHeight) });
      } else {
        this.meta.removeTag('property="og:image:height"');
      }
      if (config.imageAlt) {
        this.meta.updateTag({ property: 'og:image:alt', content: config.imageAlt });
        this.meta.updateTag({ name: 'twitter:image:alt', content: config.imageAlt });
      } else {
        this.meta.removeTag('property="og:image:alt"');
        this.meta.removeTag('name="twitter:image:alt"');
      }
    } else {
      this.meta.removeTag('property="og:image"');
      this.meta.removeTag('name="twitter:image"');
      this.meta.removeTag('property="og:image:secure_url"');
      this.meta.removeTag('property="og:image:width"');
      this.meta.removeTag('property="og:image:height"');
      this.meta.removeTag('property="og:image:alt"');
      this.meta.removeTag('name="twitter:image:alt"');
    }

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    if (config.noIndex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });
    }

    this.setCanonicalLink(canonicalUrl);
    this.setJsonLd(config.jsonLd ?? null);
  }

  buildProductJsonLd(p: ProductDetail, imageAbsoluteUrls: string[]): Record<string, unknown> {
    const price = p.precioUSD ?? 0;
    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.descripcion,
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    };
    if (imageAbsoluteUrls.length > 0) {
      data['image'] = imageAbsoluteUrls.length === 1 ? imageAbsoluteUrls[0] : imageAbsoluteUrls;
    }
    if (p.codigo) {
      data['sku'] = p.codigo;
    }
    return data;
  }

  /** Página de inicio: descripción + datos estructurados tienda y búsqueda */
  setHomePage(): void {
    const origin = this.resolveOrigin();
    const jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${origin}/#organization`,
          name: this.brand,
          url: origin || undefined,
        },
        {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          url: origin || undefined,
          name: this.brand,
          publisher: { '@id': `${origin}/#organization` },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${origin}/buscar?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
      ],
    };

    this.setPage({
      title: 'Inicio',
      description: this.defaultDescription,
      urlPath: '/',
      jsonLd,
    });
  }

  private resolveOrigin(): string {
    const configured = environment.siteUrl?.replace(/\/$/, '').trim();
    if (configured) {
      return configured;
    }
    const browserOrigin =
      typeof this.document.defaultView?.location?.origin === 'string'
        ? this.document.defaultView.location.origin
        : '';
    return browserOrigin;
  }

  /** Convierte URLs de imágenes del producto a absolutas (JSON-LD, og:image). */
  productImageUrlsForJsonLd(urls: string[]): string[] {
    const origin = this.resolveOrigin();
    const out: string[] = [];
    for (const u of urls) {
      const abs = this.toAbsoluteImageUrl(u, origin);
      if (abs) {
        out.push(abs);
      }
    }
    return out;
  }

  private toAbsoluteImageUrl(url: string | null | undefined, origin: string): string | null {
    if (!url || !origin) {
      return null;
    }
    const u = url.trim();
    if (!u) {
      return null;
    }
    if (u.startsWith('http://') || u.startsWith('https://')) {
      return u;
    }
    const path = u.startsWith('/') ? u : `/${u}`;
    const full = `${origin}${path}`;
    return full;
  }

  private setCanonicalLink(href: string): void {
    if (!href) {
      return;
    }
    let link = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private setJsonLd(data: Record<string, unknown> | null): void {
    const existing = this.document.getElementById('seo-structured-data');
    if (existing) {
      existing.remove();
    }

    if (!data) {
      return;
    }

    const script = this.document.createElement('script');
    script.id = 'seo-structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }
}