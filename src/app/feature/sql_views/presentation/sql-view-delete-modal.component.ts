import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { SqlView } from '../domain/sql-view.model';

@Component({
  selector: 'app-sql-view-delete-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <app-modal [isOpen]="isOpen" title="Supprimer la SQL View" (close)="close.emit()">
      <div class="grid gap-5">
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div class="text-sm text-slate-500">Vue concernée</div>
          <div class="mt-1 text-lg font-semibold text-slate-900">{{ sqlView?.name }}</div>
        </div>

        @if (dependencies.length > 0) {
          <div class="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div class="text-sm font-semibold text-amber-800">
              Attention : utilisée dans {{ dependencies.length }} dashboard(s)
            </div>
            <ul class="mt-3 grid gap-2 text-sm text-amber-900">
              @for (dependency of dependencies; track dependency) {
                <li class="rounded-xl bg-white/80 px-3 py-2">{{ dependency }}</li>
              }
            </ul>
          </div>
        }

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
            class="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            (click)="confirm.emit()"
          >
            Supprimer
          </button>
        </div>
      </div>
    </app-modal>
  `
})
export class SqlViewDeleteModalComponent {
  @Input() isOpen = false;
  @Input() sqlView: SqlView | null = null;
  @Input() dependencies: string[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}
