import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SqlViewStatus, VizType } from '../domain/sql-view.model';
import { SqlViewRepositoryImpl } from '../infrastructure/sql-view.repository.impl';
import { SqlViewDeleteModalComponent } from './sql-view-delete-modal.component';
import { createSqlViewStore } from './sql-view.store';

@Component({
  selector: 'app-sql-view-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PageHeaderComponent, SqlViewDeleteModalComponent],
  template: `
    <div class="min-h-screen bg-slate-50 p-8">
      <app-page-header
        title="Gestion des SQL Views"
        subtitle="Créez, exécutez et préparez les vues réutilisables pour le portail BI."
      ></app-page-header>

      <div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div class="grid flex-1 gap-3 md:grid-cols-[minmax(0,1fr)_12rem_12rem]">
            <input
              [(ngModel)]="searchTerm"
              (ngModelChange)="page.set(1)"
              class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              placeholder="Rechercher par nom ou catégorie..."
            />

            <select
              [(ngModel)]="selectedCategoryId"
              (ngModelChange)="page.set(1)"
              class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Toutes les catégories</option>
              @for (category of store.categories(); track category.id) {
                <option [value]="category.id">{{ category.label }}</option>
              }
            </select>

            <select
              [(ngModel)]="selectedStatus"
              (ngModelChange)="page.set(1)"
              class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Tous les statuts</option>
              <option [value]="sqlViewStatus.READY">Prêtes</option>
              <option [value]="sqlViewStatus.DRAFT">Brouillons</option>
            </select>
          </div>

          <button
            type="button"
            routerLink="/sql-views/new"
            class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Créer une SQL View
          </button>
        </div>

        @if (store.error()) {
          <div class="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{{ store.error() }}</span>
            <button type="button" class="font-semibold underline" (click)="store.loadAll()">Réessayer</button>
          </div>
        }

        @if (store.loading()) {
          <div class="grid gap-3">
            @for (row of skeletonRows; track row) {
              <div class="grid grid-cols-[2fr_1fr_1fr_0.8fr_0.8fr_0.8fr_1fr_1.2fr] gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                @for (cell of skeletonCells; track cell) {
                  <div class="h-4 animate-pulse rounded-full bg-slate-200"></div>
                }
              </div>
            }
          </div>
        } @else if (filteredViews().length === 0) {
          <div class="grid place-items-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
            <div class="max-w-md">
              <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl text-blue-700">
                ▣
              </div>
              <h2 class="text-xl font-semibold text-slate-900">Aucune SQL View</h2>
              <p class="mt-2 text-sm text-slate-500">
                Ajustez vos filtres ou créez une nouvelle vue pour démarrer.
              </p>
              <button
                type="button"
                routerLink="/sql-views/new"
                class="mt-6 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Créer une SQL View
              </button>
            </div>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead>
                <tr class="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <th class="px-3">Nom</th>
                  <th class="px-3">Catégorie</th>
                  <th class="px-3">Datasource</th>
                  <th class="px-3">Statut</th>
                  <th class="px-3">Viz</th>
                  <th class="px-3">Params</th>
                  <th class="px-3">Dernière modif</th>
                  <th class="px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (view of pagedViews(); track view.id) {
                  <tr
                    class="rounded-2xl bg-slate-50 text-slate-700 transition"
                    [ngClass]="deletingId() === view.id ? 'opacity-0 translate-y-2' : ''"
                  >
                    <td class="rounded-l-2xl px-3 py-4">
                      <button
                        type="button"
                        class="font-semibold text-slate-900 transition hover:text-blue-700"
                        (click)="openEditor(view.id)"
                      >
                        {{ view.name }}
                      </button>
                    </td>
                    <td class="px-3 py-4">
                      @if (getCategory(view.categoryId); as category) {
                        <span
                          class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                          [style.background]="category.color + '18'"
                          [style.color]="category.color"
                        >
                          {{ category.label }}
                        </span>
                      } @else {
                        <span class="text-slate-400">—</span>
                      }
                    </td>
                    <td class="px-3 py-4">{{ getDatasourceName(view.datasourceId) }}</td>
                    <td class="px-3 py-4">
                      <span
                        class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                        [ngClass]="view.status === sqlViewStatus.READY ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
                      >
                        {{ view.status === sqlViewStatus.READY ? 'Prête' : 'Brouillon' }}
                      </span>
                    </td>
                    <td class="px-3 py-4">
                      <span
                        class="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium"
                        [ngClass]="view.status === sqlViewStatus.READY ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-400'"
                      >
                        <span>{{ getVizIcon(view.vizConfig?.type) }}</span>
                        <span>{{ getVizLabel(view.vizConfig?.type) }}</span>
                      </span>
                    </td>
                    <td class="px-3 py-4">{{ view.parameters.length ? view.parameters.length + ' params' : '—' }}</td>
                    <td class="px-3 py-4 text-slate-500">{{ relativeTime(view.updatedAt) }}</td>
                    <td class="rounded-r-2xl px-3 py-4">
                      <div class="flex flex-wrap gap-2">
                        <button
                          type="button"
                          class="rounded-xl border px-3 py-1.5 text-xs font-semibold transition"
                          [disabled]="view.status === sqlViewStatus.DRAFT"
                          [ngClass]="view.status === sqlViewStatus.DRAFT ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400' : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'"
                          (click)="runView(view.id)"
                        >
                          Exécuter
                        </button>
                        <button
                          type="button"
                          class="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-white"
                          (click)="openEditor(view.id)"
                        >
                          Éditer
                        </button>
                        <button
                          type="button"
                          class="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-white"
                          (click)="store.duplicate(view.id)"
                        >
                          Dupliquer
                        </button>
                        <button
                          type="button"
                          class="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          (click)="openDelete(view.id)"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          @if (totalPages() > 1) {
            <div class="mt-6 flex items-center justify-between">
              <div class="text-sm text-slate-500">
                Page {{ page() }} sur {{ totalPages() }}
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  [disabled]="page() === 1"
                  (click)="page.set(page() - 1)"
                >
                  Précédent
                </button>
                <button
                  type="button"
                  class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  [disabled]="page() === totalPages()"
                  (click)="page.set(page() + 1)"
                >
                  Suivant
                </button>
              </div>
            </div>
          }
        }
      </div>
    </div>

    <app-sql-view-delete-modal
      [isOpen]="!!pendingDeleteView()"
      [sqlView]="pendingDeleteView()"
      [dependencies]="pendingDependencies()"
      (close)="closeDelete()"
      (confirm)="confirmDelete()"
    ></app-sql-view-delete-modal>
  `
})
export class SqlViewListComponent {
  protected readonly store = createSqlViewStore();
  protected readonly sqlViewStatus = SqlViewStatus;
  protected readonly page = signal(1);
  protected readonly deletingId = signal<string | null>(null);
  protected readonly pendingDeleteId = signal<string | null>(null);
  protected readonly pendingDependencies = signal<string[]>([]);

  protected searchTerm = '';
  protected selectedCategoryId = '';
  protected selectedStatus = '';
  protected readonly pageSize = 10;
  protected readonly skeletonRows = [1, 2, 3, 4, 5];
  protected readonly skeletonCells = [1, 2, 3, 4, 5, 6, 7, 8];

  protected readonly filteredViews = computed(() => {
    const query = this.searchTerm.trim().toLowerCase();
    return this.store.sqlViews().filter((view) => {
      const category = this.getCategory(view.categoryId)?.label.toLowerCase() ?? '';
      const matchesSearch = !query || view.name.toLowerCase().includes(query) || category.includes(query);
      const matchesCategory = !this.selectedCategoryId || view.categoryId === this.selectedCategoryId;
      const matchesStatus = !this.selectedStatus || view.status === this.selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredViews().length / this.pageSize))
  );

  protected readonly pagedViews = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredViews().slice(start, start + this.pageSize);
  });

  protected readonly pendingDeleteView = computed(
    () => this.store.sqlViews().find((view) => view.id === this.pendingDeleteId()) ?? null
  );

  constructor(private readonly router: Router) {
    this.store.loadAll();
  }

  protected getCategory(categoryId?: string) {
    return this.store.categories().find((category) => category.id === categoryId) ?? null;
  }

  protected getDatasourceName(datasourceId: string): string {
    return this.store.datasources().find((datasource) => datasource.id === datasourceId)?.name ?? '—';
  }

  protected getVizIcon(type?: VizType | null): string {
    const icons: Partial<Record<VizType, string>> = {
      [VizType.TABLE]: '▦',
      [VizType.BAR]: '▇',
      [VizType.LINE]: '╱',
      [VizType.AREA]: '▃',
      [VizType.STACKED_BAR]: '▥',
      [VizType.PIE]: '◔',
      [VizType.DONUT]: '◑',
      [VizType.SCATTER]: '⋯',
      [VizType.KPI]: '◉'
    };
    return type ? icons[type] ?? '•' : '•';
  }

  protected getVizLabel(type?: VizType | null): string {
    if (!type) {
      return 'Aucune';
    }
    return {
      [VizType.TABLE]: 'Table',
      [VizType.BAR]: 'Barres',
      [VizType.LINE]: 'Lignes',
      [VizType.AREA]: 'Aires',
      [VizType.STACKED_BAR]: 'Empilées',
      [VizType.PIE]: 'Camembert',
      [VizType.DONUT]: 'Donut',
      [VizType.SCATTER]: 'Nuage',
      [VizType.KPI]: 'KPI'
    }[type];
  }

  protected relativeTime(value: Date): string {
    const diff = Date.now() - new Date(value).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) {
      return 'À l’instant';
    }
    if (hours < 24) {
      return `Il y a ${hours}h`;
    }
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `Il y a ${days}j`;
    }
    return new Date(value).toLocaleDateString('fr-FR');
  }

  protected openEditor(id: string): void {
    this.router.navigate(['/sql-views', id]);
  }

  protected runView(id: string): void {
    this.router.navigate(['/sql-views', id], { queryParams: { run: '1' } });
  }

  protected openDelete(id: string): void {
    this.pendingDeleteId.set(id);
    this.pendingDependencies.set(
      injectDeleteDependencies().getDashboardDependencies(id)
    );
  }

  protected closeDelete(): void {
    this.pendingDeleteId.set(null);
    this.pendingDependencies.set([]);
  }

  protected confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (!id) {
      return;
    }
    this.deletingId.set(id);
    setTimeout(async () => {
      await this.store.delete(id);
      this.deletingId.set(null);
      this.closeDelete();
    }, 220);
  }
}

const injectDeleteDependencies = () => new SqlViewRepositoryImpl();
