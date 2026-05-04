import { Component, Input, Output, EventEmitter, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SqlView } from '../domain/sql-view.model';
import { SqlViewStore } from './sql-view.store';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { FormComponent } from '../../../shared/components/form/form.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-sql-view-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    FormComponent,
    ButtonComponent
  ],
  template: `
    <app-modal
      [isOpen]="isOpen"
      title="{{ isEditMode() ? 'Modifier' : 'Créer' }} une Vue SQL"
      (close)="onClose()">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <app-form>
          <div class="form-row">
            <div class="form-group">
              <label for="name">Nom *</label>
              <input
                id="name"
                type="text"
                formControlName="name"
                placeholder="Entrez le nom de la vue SQL">
              @if (form.get('name')?.invalid && form.get('name')?.touched) {
                <div class="error">Le nom est requis</div>
              }
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                id="description"
                formControlName="description"
                placeholder="Entrez une description (optionnel)"
                rows="3">
              </textarea>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="datasourceId">Datasource *</label>
              <select id="datasourceId" formControlName="datasourceId">
                <option value="">Sélectionnez une datasource</option>
                @for (ds of store.compatibleDatasources(); track ds.id) {
                  <option [value]="ds.id">{{ ds.name }}</option>
                }
              </select>
              @if (form.get('datasourceId')?.invalid && form.get('datasourceId')?.touched) {
                <div class="error">La datasource est requise</div>
              }
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="query">Requête SQL *</label>
              <textarea
                id="query"
                formControlName="query"
                placeholder="Entrez votre requête SQL"
                rows="8"
                class="code-textarea">
              </textarea>
              @if (form.get('query')?.invalid && form.get('query')?.touched) {
                <div class="error">La requête SQL est requise</div>
              }
            </div>
          </div>
        </app-form>

        <div class="modal-actions">
          <app-button
            type="button"
            label="Annuler"
            variant="secondary"
            (click)="onClose()">
          </app-button>
          <app-button
            type="submit"
            label="{{ isEditMode() ? 'Modifier' : 'Créer' }}"
            variant="primary"
            [disabled]="form.invalid || store.loading()">
          </app-button>
        </div>
      </form>
    </app-modal>
  `,
  styles: [`
    .form-row {
      margin-bottom: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 0.5rem;
      border: 1px solid #D1D5DB;
      border-radius: 0.375rem;
      font-size: 0.875rem;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .code-textarea {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.875rem;
      line-height: 1.25;
    }

    .error {
      margin-top: 0.25rem;
      color: #EF4444;
      font-size: 0.75rem;
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
export class SqlViewFormComponent implements OnInit {
  @Input() isOpen = false;
  @Input() sqlView: SqlView | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  store = new SqlViewStore();
  form!: FormGroup;

  isEditMode = computed(() => this.sqlView !== null);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      datasourceId: ['', [Validators.required]],
      query: ['', [Validators.required]]
    });
  }

  ngOnChanges(): void {
    if (this.sqlView) {
      this.form.patchValue({
        name: this.sqlView.name,
        description: this.sqlView.description || '',
        datasourceId: this.sqlView.datasourceId,
        query: this.sqlView.query
      });
    } else {
      this.form.reset();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }
}