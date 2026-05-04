import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatasourceStore } from './datasource.store';
import { Datasource } from '../domain/datasource.model';

@Component({
  selector: 'app-datasource-delete-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen()" class="fixed inset-0 z-50 overflow-hidden">
      <div class="absolute inset-0 bg-gray-600 bg-opacity-75" (click)="close.emit()"></div>
      <div class="w-full max-w-md mx-auto mt-20 bg-white rounded-lg shadow-xl">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
          <p class="text-sm text-gray-500 mb-4">
            Êtes-vous sûr de vouloir supprimer le datasource "{{ datasource()?.name }}" ?
          </p>

          <div *ngIf="dependencies().reports > 0 || dependencies().sqlViews > 0" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <strong>Attention :</strong> Ce datasource est utilisé par :
            <ul class="list-disc list-inside mt-2">
              <li *ngIf="dependencies().reports > 0">{{ dependencies().reports }} rapport(s)</li>
              <li *ngIf="dependencies().sqlViews > 0">{{ dependencies().sqlViews }} vue(s) SQL</li>
            </ul>
            La suppression est bloquée tant qu'il y a des dépendances.
          </div>

          <div class="flex justify-end space-x-2">
            <button (click)="close.emit()" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">
              Annuler
            </button>
            <button
              (click)="confirmDelete()"
              [disabled]="hasDependencies()"
              class="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DatasourceDeleteModalComponent {
  store = inject(DatasourceStore);

  datasource = input<Datasource | null>(null);
  isOpen = input<boolean>(false);
  dependencies = input<{ reports: number; sqlViews: number }>({ reports: 0, sqlViews: 0 });
  close = output<void>();
  deleted = output<void>();

  hasDependencies() {
    return this.dependencies().reports > 0 || this.dependencies().sqlViews > 0;
  }

  confirmDelete() {
    if (!this.hasDependencies() && this.datasource()) {
      this.store.deleteDatasource(this.datasource()!.id);
      this.deleted.emit();
      this.close.emit();
    }
  }
}