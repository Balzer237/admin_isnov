import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatasourceStore } from './datasource.store';
import { Datasource, DatasourceType, ConnectionStatus } from '../domain/datasource.model';
import { DatasourceTestBadgeComponent } from './datasource-test-badge.component';
import { DatasourceFormComponent } from './datasource-form.component';
import { DatasourceDeleteModalComponent } from './datasource-delete-modal.component';

@Component({
  selector: 'app-datasource-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatasourceTestBadgeComponent, DatasourceFormComponent, DatasourceDeleteModalComponent],
  template: `
    <div class="min-h-screen bg-slate-50 p-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900">Gestion des Datasources</h1>
        <p class="mt-2 text-slate-600">Configurez et gérez vos connexions aux bases de données.</p>
      </div>

      <div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div class="flex-1">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              placeholder="Rechercher par nom, type ou hôte..."
            />
          </div>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            (click)="openCreateForm()"
          >
            Créer un Datasource
          </button>
        </div>

        @if (store.error()) {
          <div class="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{{ store.error() }}</span>
            <button type="button" class="font-semibold underline" (click)="retryLoad()">Réessayer</button>
          </div>
        }

        @if (store.loading()) {
          <div class="grid gap-3">
            @for (row of [1,2,3,4,5]; track row) {
              <div class="grid grid-cols-[2fr_1fr_1.5fr_1fr_1.5fr_1.2fr] gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                @for (cell of [1,2,3,4,5,6]; track cell) {
                  <div class="h-4 animate-pulse rounded-full bg-slate-200"></div>
                }
              </div>
            }
          </div>
        } @else if (filteredDatasources().length === 0) {
          <div class="grid place-items-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
            <div class="max-w-md">
              <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl text-blue-700">
                🗄️
              </div>
              <h2 class="text-xl font-semibold text-slate-900">Aucune datasource</h2>
              <p class="mt-2 text-sm text-slate-500">
                Créez votre première connexion à une base de données pour commencer.
              </p>
              <button
                type="button"
                class="mt-6 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                (click)="openCreateForm()"
              >
                Créer un Datasource
              </button>
            </div>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead>
                <tr class="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <th class="px-3">Nom</th>
                  <th class="px-3">Type</th>
                  <th class="px-3">Connexion</th>
                  <th class="px-3">Statut</th>
                  <th class="px-3">Dernière vérification</th>
                  <th class="px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (ds of paginatedDatasources(); track ds.id) {
                  <tr class="rounded-2xl bg-slate-50 text-slate-700 transition hover:bg-slate-100">
                    <td class="rounded-l-2xl px-3 py-4">
                      <div class="font-semibold text-slate-900">{{ ds.name }}</div>
                      <div class="text-xs text-slate-500">{{ ds.database }}</div>
                    </td>
                    <td class="px-3 py-4">
                      <span
                        class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                        [ngClass]="getTypeBadgeClass(ds.type)"
                      >
                        {{ getTypeLabel(ds.type) }}
                      </span>
                    </td>
                    <td class="px-3 py-4">
                      <div class="text-slate-900">{{ ds.host }}:{{ ds.port }}</div>
                      <div class="text-xs text-slate-500">{{ ds.username }}</div>
                    </td>
                    <td class="px-3 py-4">
                      <app-datasource-test-badge [datasource]="ds" (test)="testConnection(ds.id)"></app-datasource-test-badge>
                    </td>
                    <td class="px-3 py-4 text-slate-500">{{ ds.lastCheckedAt | date:'short' }}</td>
                    <td class="rounded-r-2xl px-3 py-4">
                      <div class="flex flex-wrap gap-2">
                        <button
                          type="button"
                          class="rounded-xl border px-3 py-1.5 text-xs font-semibold transition border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                          (click)="testConnection(ds.id)"
                        >
                          Tester
                        </button>
                        <button
                          type="button"
                          class="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-white"
                          (click)="editDatasource(ds)"
                        >
                          Éditer
                        </button>
                        <button
                          type="button"
                          class="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          (click)="openDeleteModal(ds)"
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
                Page {{ currentPage }} sur {{ totalPages() }}
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  [disabled]="currentPage === 1"
                  (click)="previousPage()"
                >
                  Précédent
                </button>
                <button
                  type="button"
                  class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  [disabled]="currentPage === totalPages()"
                  (click)="nextPage()"
                >
                  Suivant
                </button>
              </div>
            </div>
          }
        }
      </div>

      <!-- Modals -->
      <app-datasource-form
        [isOpen]="isCreateOpen() || isEditOpen()"
        [isEdit]="isEditOpen()"
        [datasource]="selectedDatasource()"
        (close)="closeForm()"
        (saved)="onFormSaved()"
      ></app-datasource-form>

      <app-datasource-delete-modal
        [isOpen]="isDeleteOpen()"
        [datasource]="selectedDatasource()"
        [dependencies]="dependencies()"
        (close)="closeDeleteModal()"
        (deleted)="onDatasourceDeleted()"
      ></app-datasource-delete-modal>
    </div>
  `,
  styles: []
})
export class DatasourceListComponent implements OnInit {
  store = inject(DatasourceStore);
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;

  isCreateOpen = signal(false);
  isEditOpen = signal(false);
  isDeleteOpen = signal(false);
  selectedDatasource = signal<Datasource | null>(null);
  dependencies = signal<{ reports: number; sqlViews: number }>({ reports: 0, sqlViews: 0 });

  ngOnInit() {
    this.store.loadDatasources();
  }

  filteredDatasources() {
    return this.store.datasources().filter(ds =>
      ds.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  paginatedDatasources() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredDatasources().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredDatasources().length / this.pageSize);
  }

  getTypeLabel(type: DatasourceType): string {
    const labels = {
      [DatasourceType.POSTGRESQL]: 'PostgreSQL',
      [DatasourceType.MYSQL]: 'MySQL',
      [DatasourceType.ORACLE]: 'Oracle',
      [DatasourceType.SQLSERVER]: 'SQL Server',
      [DatasourceType.H2]: 'H2'
    };
    return labels[type] || type;
  }

  getTypeBadgeClass(type: DatasourceType): string {
    const classes = {
      [DatasourceType.POSTGRESQL]: 'bg-blue-100 text-blue-700',
      [DatasourceType.MYSQL]: 'bg-orange-100 text-orange-700',
      [DatasourceType.ORACLE]: 'bg-red-100 text-red-700',
      [DatasourceType.SQLSERVER]: 'bg-purple-100 text-purple-700',
      [DatasourceType.H2]: 'bg-green-100 text-green-700'
    };
    return classes[type] || 'bg-slate-100 text-slate-700';
  }

  testConnection(id: string) {
    this.store.testConnection(id);
  }

  openCreateForm() {
    this.isCreateOpen.set(true);
    this.isEditOpen.set(false);
    this.selectedDatasource.set(null);
  }

  editDatasource(ds: Datasource) {
    this.isEditOpen.set(true);
    this.isCreateOpen.set(false);
    this.selectedDatasource.set(ds);
  }

  openDeleteModal(ds: Datasource) {
    this.isDeleteOpen.set(true);
    this.selectedDatasource.set(ds);
    // Mock dependencies - à remplacer par des vraies données
    this.dependencies.set({
      reports: Math.floor(Math.random() * 3),
      sqlViews: Math.floor(Math.random() * 2)
    });
  }

  closeForm() {
    this.isCreateOpen.set(false);
    this.isEditOpen.set(false);
    this.selectedDatasource.set(null);
  }

  closeDeleteModal() {
    this.isDeleteOpen.set(false);
    this.selectedDatasource.set(null);
  }

  onFormSaved() {
    this.closeForm();
    this.store.loadDatasources();
  }

  onDatasourceDeleted() {
    this.closeDeleteModal();
    this.store.loadDatasources();
  }

  retryLoad() {
    this.store.clearError();
    this.store.loadDatasources();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }
}