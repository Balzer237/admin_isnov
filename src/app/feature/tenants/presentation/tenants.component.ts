import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TenantService } from '../../../core/services/tenant.service';
import { PageAction, Tenant } from '../../../core/models/navigation.model';

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, CardComponent],
  template: `
    <div class="p-8 bg-gray-50 min-h-screen">
      <app-page-header
        title="Tenants"
        subtitle="Visualisez et pilotez les environnements disponibles."
        [actions]="headerActions"
      ></app-page-header>

      <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(20rem,1fr)] gap-6">
        <app-card>
          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Tenant actifs</h2>
              <p class="text-sm text-gray-500 mt-1">{{ tenants.length }} tenant(s) disponibles</p>
            </div>
            <div class="rounded-full bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1">
              {{ tenants.length }} total
            </div>
          </div>

          <div class="space-y-3">
            <button
              *ngFor="let tenant of tenants"
              type="button"
              (click)="selectTenant(tenant)"
              class="w-full text-left rounded-xl border px-4 py-4 transition-all"
              [ngClass]="tenant.id === currentTenant?.id
                ? 'border-blue-300 bg-blue-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/40'"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-semibold">
                      {{ getInitials(tenant.name) }}
                    </div>
                    <div class="min-w-0">
                      <div class="font-semibold text-gray-900 truncate">{{ tenant.name }}</div>
                      <div class="text-sm text-gray-500">Identifiant: {{ tenant.id }}</div>
                    </div>
                  </div>
                </div>

                <span
                  class="shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                  [ngClass]="tenant.id === currentTenant?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'"
                >
                  {{ tenant.id === currentTenant?.id ? 'Actif' : 'Disponible' }}
                </span>
              </div>
            </button>
          </div>
        </app-card>

        <app-card>
          <h2 class="text-lg font-semibold text-gray-900">Contexte courant</h2>
          <div class="mt-5 space-y-4" *ngIf="currentTenant as tenant">
            <div class="rounded-xl bg-slate-900 text-white p-5">
              <div class="text-sm text-slate-300">Tenant sélectionné</div>
              <div class="mt-2 text-xl font-semibold">{{ tenant.name }}</div>
              <div class="mt-1 text-sm text-slate-300">ID: {{ tenant.id }}</div>
            </div>

            <div class="grid grid-cols-1 gap-3">
              <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div class="text-xs uppercase tracking-wide text-gray-500 font-semibold">Navigation par défaut</div>
                <div class="mt-2 text-sm text-gray-700">L'application démarre maintenant sur cette page.</div>
              </div>
              <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div class="text-xs uppercase tracking-wide text-gray-500 font-semibold">Datasources et SQL Views</div>
                <div class="mt-2 text-sm text-gray-700">Ces modules restent les seules entrées actives dans le sidebar.</div>
              </div>
            </div>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: []
})
export class TenantsComponent {
  private readonly tenantService = inject(TenantService);
  private readonly destroyRef = inject(DestroyRef);

  currentTenant: Tenant | null = this.tenantService.getCurrentTenant();
  tenants = this.tenantService.getTenants();

  headerActions: PageAction[] = [
    {
      label: 'Refresh',
      icon: '↻',
      action: () => {
        this.tenants = this.tenantService.getTenants();
        this.currentTenant = this.tenantService.getCurrentTenant();
      },
      variant: 'secondary'
    }
  ];

  constructor() {
    this.tenantService.currentTenant$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tenant) => {
        this.currentTenant = tenant;
      });

    this.tenantService.tenants$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tenants) => {
        this.tenants = tenants;
      });
  }

  selectTenant(tenant: Tenant): void {
    this.tenantService.setCurrentTenant(tenant);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }
}
