import { Component, Input, Output, EventEmitter, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SqlView, ExecuteSqlViewDto, VisualizationType } from '../domain/sql-view.model';
import { SqlViewStore } from './sql-view.store';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { BarChartComponent } from './bar-chart.component';
import { LineChartComponent } from './line-chart.component';
import { PieChartComponent } from './pie-chart.component';
import { ScatterPlotComponent } from './scatter-plot.component';

@Component({
  selector: 'app-sql-view-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    ButtonComponent,
    TableComponent,
    BarChartComponent,
    LineChartComponent,
    PieChartComponent,
    ScatterPlotComponent
  ],
  template: `
    <app-modal
      [isOpen]="isOpen"
      title="Visualisation: {{ sqlView?.name }}"
      size="large"
      (close)="onClose()">
      <div class="editor-content">
        @if (sqlView) {
          <!-- Parameters Section -->
          @if (sqlView.parameters.length > 0) {
            <div class="parameters-section">
              <h3>Paramètres</h3>
              <form [formGroup]="paramsForm" class="params-form">
                @for (param of sqlView.parameters; track param.name) {
                  <div class="param-group">
                    <label [for]="param.name">{{ param.name }}</label>
                    @if (param.type === 'date') {
                      <input
                        [id]="param.name"
                        type="date"
                        [formControlName]="param.name">
                    } @else if (param.type === 'number') {
                      <input
                        [id]="param.name"
                        type="number"
                        [formControlName]="param.name">
                    } @else if (param.type === 'boolean') {
                      <input
                        [id]="param.name"
                        type="checkbox"
                        [formControlName]="param.name">
                    } @else {
                      <input
                        [id]="param.name"
                        type="text"
                        [formControlName]="param.name"
                        [placeholder]="param.description">
                    }
                  </div>
                }
                <app-button
                  type="button"
                  label="Exécuter"
                  variant="primary"
                  [disabled]="paramsForm.invalid || store.loading()"
                  (click)="executeQuery()">
                </app-button>
              </form>
            </div>
          } @else {
            <div class="no-params">
              <app-button
                type="button"
                label="Exécuter la requête"
                variant="primary"
                [disabled]="store.loading()"
                (click)="executeQuery()">
              </app-button>
            </div>
          }

          <!-- Results Section -->
          @if (store.executionResult()) {
            <div class="results-section">
              <h3>Résultats ({{ store.executionResult()!.executionTime.toFixed(0) }}ms)</h3>

              @if (sqlView.visualization.type === 'table') {
                <app-table
                  [columns]="resultColumns()"
                  [data]="store.executionResult()!.rows">
                </app-table>
              } @else {
                <div class="chart-container">
                  @switch (sqlView.visualization.type) {
                    @case ('line_chart') {
                      <app-line-chart
                        [data]="store.executionResult()!.rows"
                        [config]="sqlView.visualization.config">
                      </app-line-chart>
                    }
                    @case ('bar_chart') {
                      <app-bar-chart
                        [data]="store.executionResult()!.rows"
                        [config]="sqlView.visualization.config">
                      </app-bar-chart>
                    }
                    @case ('pie_chart') {
                      <app-pie-chart
                        [data]="store.executionResult()!.rows"
                        [config]="sqlView.visualization.config">
                      </app-pie-chart>
                    }
                    @case ('scatter_plot') {
                      <app-scatter-plot
                        [data]="store.executionResult()!.rows"
                        [config]="sqlView.visualization.config">
                      </app-scatter-plot>
                    }
                  }
                </div>
              }
            </div>
          }
        }
      </div>

      <div class="modal-actions">
        <app-button
          type="button"
          label="Fermer"
          variant="secondary"
          (click)="onClose()">
        </app-button>
      </div>
    </app-modal>
  `,
  styles: [`
    .editor-content {
      max-height: 80vh;
      overflow-y: auto;
    }

    .parameters-section,
    .results-section {
      margin-bottom: 2rem;
    }

    .parameters-section h3,
    .results-section h3 {
      margin-bottom: 1rem;
      color: #374151;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .params-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .param-group {
      display: flex;
      flex-direction: column;
    }

    .param-group label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    .param-group input {
      padding: 0.5rem;
      border: 1px solid #D1D5DB;
      border-radius: 0.375rem;
    }

    .param-group input:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .no-params {
      text-align: center;
      margin-bottom: 2rem;
    }

    .chart-container {
      min-height: 400px;
      border: 1px solid #E5E7EB;
      border-radius: 0.5rem;
      padding: 1rem;
      background-color: #FFFFFF;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #E5E7EB;
    }
  `]
})
export class SqlViewEditorComponent implements OnInit {
  @Input() isOpen = false;
  @Input() sqlView: SqlView | null = null;
  @Output() close = new EventEmitter<void>();

  store = new SqlViewStore();
  paramsForm!: FormGroup;

  resultColumns = computed(() => {
    const result = this.store.executionResult();
    if (!result) return [];
    return result.columns.map(col => ({
      key: col.name,
      label: col.description || col.name,
      sortable: false
    }));
  });

  constructor(private fb: FormBuilder) {
    effect(() => {
      if (this.sqlView) {
        this.initParamsForm();
      }
    });
  }

  ngOnInit(): void {
    if (this.sqlView) {
      this.initParamsForm();
    }
  }

  private initParamsForm(): void {
    if (!this.sqlView) return;

    const formControls: any = {};
    this.sqlView.parameters.forEach(param => {
      const validators = param.required ? [Validators.required] : [];
      formControls[param.name] = ['', validators];
    });

    this.paramsForm = this.fb.group(formControls);
  }

  onClose(): void {
    this.store.clearExecutionResult();
    this.close.emit();
  }

  async executeQuery(): Promise<void> {
    if (!this.sqlView) return;

    const params: Record<string, any> = {};
    if (this.paramsForm) {
      Object.keys(this.paramsForm.controls).forEach(key => {
        params[key] = this.paramsForm.get(key)?.value;
      });
    }

    try {
      await this.store.executeSqlView(this.sqlView.id, { parameters: params });
    } catch (error) {
      // Error handled by store
    }
  }
}