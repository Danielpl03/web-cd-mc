import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'sobre-nosotros',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'cotizacion',
    loadComponent: () =>
      import('./pages/quote-request/quote-request.component').then(
        (m) => m.QuoteRequestComponent,
      ),
  },
  {
    path: 'legal/:slug',
    loadComponent: () =>
      import('./pages/legal/legal-page.component').then(
        (m) => m.LegalPageComponent,
      ),
  },
  {
    path: 'departamento/:id',
    loadComponent: () =>
      import('./pages/department/department.component').then(
        (m) => m.DepartmentComponent,
      ),
  },
  {
    path: 'categoria/:id',
    loadComponent: () =>
      import('./pages/category/category.component').then(
        (m) => m.CategoryComponent,
      ),
  },
  {
    path: 'buscar',
    loadComponent: () =>
      import('./pages/search/search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'producto/:id',
    loadComponent: () =>
      import('./pages/product/product.component').then((m) => m.ProductComponent),
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
