import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SqlView } from '../domain/sql-view.model';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-sql-view-delete-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      title="Confirmer la suppression"
      (close)="onClose()">
      <div class="delete-content">
        <div class="warning-icon">⚠️</div>
        <p class="message">
          Êtes-vous sûr de vouloir supprimer la vue SQL <strong>{{ sqlView?.name }}</strong> ?
        </p>
        <p class="warning">
          Cette action est irréversible et supprimera également toutes les visualisations associées.
        </p>
      </div>

      <div class="modal-actions">
        <app-button
          type="button"
          label="Annuler"
          variant="secondary"
          (click)="onClose()">
        </app-button>
        <app-button
          type="button"
          label="Supprimer"
          variant="danger"
          (click)="onConfirm()">
        </app-button>
      </div>
    </app-modal>
  `,
  styles: [`
    .delete-content {
      text-align: center;
      padding: 1rem 0;
    }

    .warning-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .message {
      margin-bottom: 1rem;
      color: #374151;
    }

    .warning {
      color: #EF4444;
      font-size: 0.875rem;
      background-color: #FEF2F2;
      padding: 0.75rem;
      border-radius: 0.375rem;
      border: 1px solid #FECACA;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #E5E7EB;
    }
  `]
})
export class SqlViewDeleteModalComponent {
  @Input() isOpen = false;
  @Input() sqlView: SqlView | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}