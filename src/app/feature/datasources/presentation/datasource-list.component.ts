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
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Gestion des Datasources</h1>
        <button class="bg-blue-600 text-white px-4 py-2 rounded" (click)="openCreateForm()">Créer un Datasource</button>
      </div>

      <div class="mb-4">
        <input type="text" placeholder="Rechercher..." [(ngModel)]="searchTerm" class="border p-2 w-full">
      </div>

      <div *ngIf="store.error()" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ store.error() }}
        <button (click)="retryLoad()" class="ml-2 underline">Réessayer</button>
      </div>

      <div *ngIf="store.loading()" class="space-y-4">
        <div *ngFor="let i of [1,2,3]" class="animate-pulse">
          <div class="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>

      <table *ngIf="!store.loading() && filteredDatasources().length > 0" class="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2">Nom</th>
            <th class="border border-gray-300 px-4 py-2">Type</th>
            <th class="border border-gray-300 px-4 py-2">Hôte/Port</th>
            <th class="border border-gray-300 px-4 py-2">Statut</th>
            <th class="border border-gray-300 px-4 py-2">Dernière vérification</th>
            <th class="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let ds of paginatedDatasources()" class="hover:bg-gray-50">
            <td class="border border-gray-300 px-4 py-2">{{ ds.name }}</td>
            <td class="border border-gray-300 px-4 py-2">
              <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded">{{ getTypeLabel(ds.type) }}</span>
            </td>
            <td class="border border-gray-300 px-4 py-2">{{ ds.host }}:{{ ds.port }}</td>
            <td class="border border-gray-300 px-4 py-2">
              <app-datasource-test-badge [datasource]="ds" (test)="testConnection(ds.id)"></app-datasource-test-badge>
            </td>
            <td class="border border-gray-300 px-4 py-2">{{ ds.lastCheckedAt | date:'short' }}</td>
            <td class="border border-gray-300 px-4 py-2">
              <button (click)="testConnection(ds.id)" class="text-blue-600 mr-2 hover:underline">Tester</button>
              <button (click)="editDatasource(ds)" class="text-green-600 mr-2 hover:underline">Éditer</button>
              <button (click)="openDeleteModal(ds)" class="text-red-600 hover:underline">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!store.loading() && filteredDatasources().length === 0" class="text-center py-8">
        <p class="text-gray-500">Aucun datasource trouvé.</p>
      </div>

      <div *ngIf="totalPages() > 1" class="flex justify-center mt-4">
        <button [disabled]="currentPage === 1" (click)="previousPage()" class="px-3 py-1 border">Précédent</button>
        <span class="px-3 py-1">{{ currentPage }} / {{ totalPages() }}</span>
        <button [disabled]="currentPage === totalPages()" (click)="nextPage()" class="px-3 py-1 border">Suivant</button>
      </div>
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