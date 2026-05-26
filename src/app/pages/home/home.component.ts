// home.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DepartmentCardComponent } from '../../components/department-card/department-card.component';
import { COMPANY } from '../../constants/company.constants';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { SupabaseService } from '../../services/supabase.service';
import { SeoService } from '../../services/seo.service';
import { DepartmentWithImage } from '../../models/store.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    DepartmentCardComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  template: `
    <div class="home-page">
      <section class="hero">
        <h1>Bienvenido a C&D Marquez Corp</h1>
        <p>Descubre nuestra amplia variedad de productos</p>
        <!-- <p class="delivery-info">
          🚚 Entregas en La Habana y Pinar del Río
        </p> -->
        <div class="hero-actions">
          <a routerLink="/cotizacion" class="hero-btn primary">Solicitar cotización</a>
          <a routerLink="/sobre-nosotros" class="hero-btn secondary">Sobre nosotros</a>
        </div>
      </section>

      <!-- <section class="trust-strip" aria-label="Información de la empresa">
        <div class="trust-item">
          <span class="trust-label">Sede</span>
          <span class="trust-value">{{ company.location.headquarters }}</span>
        </div>
        <div class="trust-item">
          <span class="trust-label">Actividad</span>
          <span class="trust-value">Mayorista y servicio minorista (productos en Panamá)</span>
        </div>
        <div class="trust-item">
          <span class="trust-label">Logística</span>
          <span class="trust-value">{{ company.location.logisticsHub }}</span>
        </div>
      </section> -->

      <section class="departments-section">
        <h2>Nuestros Departamentos</h2>
        
        @if (loading()) {
          <app-loading-spinner />
        } @else if (departments().length === 0) {
          <app-empty-state 
            title="No hay departamentos" 
            message="No se encontraron departamentos disponibles en este momento."
          />
        } @else {
          <div class="departments-grid">
            @for (department of departments(); track department.id_departamento) {
              <app-department-card [department]="department" />
            }
          </div>
        }
      </section>
    </div>
  `,
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit {
  readonly company = COMPANY;
  departments = signal<DepartmentWithImage[]>([]);
  loading = signal(true);

  constructor(
    private supabaseService: SupabaseService,
    private seo: SeoService
  ) {}

  async ngOnInit(): Promise<void> {
    this.seo.setHomePage();
    try {
      const data = await this.supabaseService.getDepartments();
      this.departments.set(data);
    } catch (error) {
      console.error('Error loading departments:', error);
    } finally {
      this.loading.set(false);
    }
  }
}