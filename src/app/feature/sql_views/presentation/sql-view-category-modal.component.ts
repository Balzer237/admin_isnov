import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-sql-view-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal [isOpen]="isOpen" title="Créer une catégorie" (close)="close.emit()">
      <div class="grid gap-5">
        <label class="grid gap-2 text-sm">
          <span class="font-medium text-slate-700">Nom</span>
          <input
            class="rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            [(ngModel)]="label"
            placeholder="Ex. Performance Produit"
          />
        </label>

        <div class="grid gap-2">
          <span class="text-sm font-medium text-slate-700">Couleur</span>
          <div class="grid grid-cols-4 gap-3">
            @for (color of colors; track color) {
              <button
                type="button"
                class="h-11 rounded-2xl border-2 transition"
                [style.background]="color"
                [ngClass]="selectedColor === color ? 'border-slate-900 scale-[1.02]' : 'border-white hover:border-slate-200'"
                (click)="selectedColor = color"
              ></button>
            }
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            (click)="close.emit()"
          >
            Annuler
          </button>
          <button
            type="button"
            class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            [disabled]="!label.trim()"
            (click)="submit()"
          >
            Créer
          </button>
        </div>
      </div>
    </app-modal>
  `
})
export class SqlViewCategoryModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<{ label: string; color: string }>();

  label = '';
  selectedColor = '#2563EB';
  colors = ['#2563EB', '#0F766E', '#F59E0B', '#7C3AED', '#DC2626', '#0891B2', '#16A34A', '#EA580C'];

  submit(): void {
    if (!this.label.trim()) {
      return;
    }
    this.created.emit({ label: this.label.trim(), color: this.selectedColor });
    this.label = '';
    this.selectedColor = '#2563EB';
  }
}
