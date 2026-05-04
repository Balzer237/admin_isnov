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
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" (click)="close.emit()"></div>
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-slate-900">Confirmer la suppression</h3>
              <button
                (click)="close.emit()"
                class="rounded-xl p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mb-6">
              <p class="text-sm text-slate-600 mb-4">
                Êtes-vous sûr de vouloir supprimer le datasource <strong class="text-slate-900">"{{ datasource()?.name }}"</strong> ?
              </p>
              <p class="text-xs text-slate-500">
                Cette action est irréversible et supprimera définitivement la configuration de connexion.
              </p>
            </div>

            @if (hasDependencies()) {
              <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-6">
                <div class="flex items-start gap-3">
                  <svg class="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 class="text-sm font-semibold text-amber-800 mb-2">Suppression impossible</h4>
                    <p class="text-sm text-amber-700 mb-3">
                      Ce datasource est utilisé par les éléments suivants :
                    </p>
                    <ul class="text-sm text-amber-700 space-y-1">
                      <li *ngIf="dependencies().reports > 0" class="flex items-center gap-2">
                        <span>•</span>
                        <span>{{ dependencies().reports }} rapport(s)</span>
                      </li>
                      <li *ngIf="dependencies().sqlViews > 0" class="flex items-center gap-2">
                        <span>•</span>
                        <span>{{ dependencies().sqlViews }} vue(s) SQL</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            }

            <div class="flex justify-end gap-3">
              <button
                (click)="close.emit()"
                class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                (click)="confirmDelete()"
                [disabled]="hasDependencies()"
                class="rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                [ngClass]="hasDependencies() ? 'bg-slate-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'"
              >
                Supprimer
              </button>
            </div>
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