import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SqlViewChartRendererComponent } from '../../../shared/components/sql-view-chart-renderer/sql-view-chart-renderer.component';
import {
  ColumnMeta,
  ColumnType,
  ParamType,
  SqlViewParameter,
  SqlViewStatus,
  VizCompatibilityResult,
  VizType
} from '../domain/sql-view.model';
import { SqlViewCategoryModalComponent } from './sql-view-category-modal.component';
import { SqlViewParamCardComponent } from './sql-view-param-card.component';
import { SqlViewVizSelectorComponent } from './sql-view-viz-selector.component';
import { createSqlViewStore } from './sql-view.store';

@Component({
  selector: 'app-sql-view-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SqlViewCategoryModalComponent,
    SqlViewParamCardComponent,
    SqlViewVizSelectorComponent,
    SqlViewChartRendererComponent
  ],
  template: `
    <div class="min-h-screen bg-slate-50 p-8">
      <div class="mx-auto max-w-[1680px]">
        <div class="mb-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div class="grid flex-1 gap-4">
              <div class="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  class="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  (click)="goBack()"
                >
                  ← Retour
                </button>
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
                  [ngClass]="editorStatus() === sqlViewStatus.READY ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
                >
                  {{ editorStatus() === sqlViewStatus.READY ? 'READY' : 'DRAFT' }}
                </span>
              </div>

              <input
                class="rounded-2xl border border-transparent bg-transparent px-1 py-1 text-3xl font-semibold tracking-tight text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-200 focus:bg-blue-50/60"
                [ngModel]="view()?.name || ''"
                (ngModelChange)="store.updateMetadata({ name: $event })"
                placeholder="Nom de la vue..."
              />

              <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <div class="flex items-center gap-2">
                  <select
                    class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    [ngModel]="view()?.categoryId || ''"
                    (ngModelChange)="store.updateMetadata({ categoryId: $event || undefined })"
                  >
                    <option value="">Catégorie</option>
                    @for (category of store.categories(); track category.id) {
                      <option [value]="category.id">{{ category.label }}</option>
                    }
                  </select>
                  <button
                    type="button"
                    class="h-11 w-11 rounded-2xl border border-slate-200 text-lg text-slate-600 transition hover:border-blue-200 hover:text-blue-700"
                    (click)="showCategoryModal.set(true)"
                  >
                    +
                  </button>
                </div>

                <select
                  class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  [ngModel]="view()?.datasourceId || ''"
                  (ngModelChange)="store.updateMetadata({ datasourceId: $event })"
                >
                  <option value="">Datasource</option>
                  @for (datasource of store.datasources(); track datasource.id) {
                    <option [value]="datasource.id">{{ datasource.name }}</option>
                  }
                </select>

                <button
                  type="button"
                  class="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  [disabled]="!!saveDisabledReason() || store.loading()"
                  [title]="saveDisabledReason() || ''"
                  (click)="save()"
                >
                  {{ store.currentVizConfig() ? 'Sauvegarder' : 'Sauvegarder (Brouillon)' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        @if (store.error()) {
          <div class="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ store.error() }}
          </div>
        }

        <div class="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_27rem]">
          <section class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Éditeur SQL</h2>
                <p class="text-sm text-slate-500">Ctrl+Entrée pour exécuter rapidement.</p>
              </div>
            </div>

            <div class="relative overflow-hidden rounded-[24px] border border-slate-200 bg-slate-950">
              <div class="grid grid-cols-[auto_minmax(0,1fr)]">
                <div class="bg-slate-900 px-4 py-4 text-right text-xs leading-6 text-slate-500">
                  @for (line of lineNumbers(); track line) {
                    <div>{{ line }}</div>
                  }
                </div>

                <div class="relative min-h-[520px]">
                  <pre
                    class="pointer-events-none absolute inset-0 overflow-auto px-4 py-4 font-mono text-sm leading-6 text-slate-100"
                    [innerHTML]="highlightedSql()"
                  ></pre>
                  <textarea
                    class="relative z-10 min-h-[520px] w-full resize-none bg-transparent px-4 py-4 font-mono text-sm leading-6 text-transparent caret-white outline-none"
                    spellcheck="false"
                    [ngModel]="view()?.sql || ''"
                    (ngModelChange)="store.updateSql($event)"
                    (keydown)="onSqlKeydown($event)"
                  ></textarea>
                </div>
              </div>
            </div>
          </section>

          <aside class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <button
              type="button"
              class="mb-4 flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-left"
              (click)="paramPanelOpen.set(!paramPanelOpen())"
            >
              <span class="font-semibold text-slate-900">Paramètres ({{ parameters().length }})</span>
              <span class="text-slate-400">{{ paramPanelOpen() ? '−' : '+' }}</span>
            </button>

            @if (paramPanelOpen()) {
              @if (parameters().length === 0) {
                <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-slate-500">
                  Aucun paramètre détecté. Utilisez <span class="font-mono text-amber-600">:nom_parametre</span> dans votre SQL.
                </div>
              } @else {
                <div class="grid gap-4">
                  @for (parameter of parameters(); track parameter.name; let index = $index) {
                    <div
                      draggable="true"
                      (dragstart)="dragIndex = index"
                      (dragover)="$event.preventDefault()"
                      (drop)="onParamDrop(index)"
                    >
                      <app-sql-view-param-card
                        [parameter]="parameter"
                        [isObsolete]="store.obsoleteParams().includes(parameter.name)"
                        (paramConfigChange)="onParamConfigChange($event)"
                        (paramDelete)="store.removeParameter($event)"
                      ></app-sql-view-param-card>
                    </div>
                  }
                </div>
              }
            }
          </aside>
        </div>

        <section class="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div class="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 class="text-lg font-semibold text-slate-900">Exécution</h2>
              <p class="text-sm text-slate-500">Formulaire dynamique basé sur les paramètres détectés.</p>
            </div>
            <div class="text-sm text-slate-500">{{ store.lastExecutionSummary() || 'Aucune exécution pour le moment.' }}</div>
          </div>

          <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_13rem_auto_auto]">
            <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              @for (parameter of activeParameters(); track parameter.name) {
                <div class="grid gap-2">
                  <label class="text-sm font-medium text-slate-700">{{ parameter.label }}</label>
                  @switch (parameter.type) {
                    @case (paramType.NUMBER) {
                      <input
                        type="number"
                        class="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        [ngModel]="store.paramValues()[parameter.name]"
                        (ngModelChange)="store.updateParam(parameter.name, $event)"
                      />
                    }
                    @case (paramType.DATE) {
                      <input
                        type="date"
                        class="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        [ngModel]="store.paramValues()[parameter.name]"
                        (ngModelChange)="store.updateParam(parameter.name, $event)"
                      />
                    }
                    @case (paramType.DATETIME) {
                      <input
                        type="datetime-local"
                        class="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        [ngModel]="store.paramValues()[parameter.name]"
                        (ngModelChange)="store.updateParam(parameter.name, $event)"
                      />
                    }
                    @case (paramType.BOOLEAN) {
                      <label class="flex h-[52px] items-center justify-between rounded-2xl border border-slate-200 px-4">
                        <span class="text-sm text-slate-600">Activer</span>
                        <input
                          type="checkbox"
                          class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          [ngModel]="store.paramValues()[parameter.name]"
                          (ngModelChange)="store.updateParam(parameter.name, $event)"
                        />
                      </label>
                    }
                    @case (paramType.LIST_STATIC) {
                      <select
                        class="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        [ngModel]="store.paramValues()[parameter.name]"
                        (ngModelChange)="store.updateParam(parameter.name, $event)"
                      >
                        <option value="">Sélectionner</option>
                        @for (option of store.getParameterOptions(parameter); track option.value) {
                          <option [ngValue]="option.value">{{ option.label }}</option>
                        }
                      </select>
                    }
                    @case (paramType.LIST_SQL) {
                      <select
                        class="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        [ngModel]="store.paramValues()[parameter.name]"
                        (ngModelChange)="store.updateParam(parameter.name, $event)"
                      >
                        <option value="">Sélectionner</option>
                        @for (option of store.getParameterOptions(parameter); track option.value) {
                          <option [ngValue]="option.value">{{ option.label }}</option>
                        }
                      </select>
                    }
                    @default {
                      <input
                        class="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        [ngModel]="store.paramValues()[parameter.name]"
                        (ngModelChange)="store.updateParam(parameter.name, $event)"
                      />
                    }
                  }
                </div>
              }
            </div>

            <select
              [(ngModel)]="limit"
              class="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              @for (option of limitOptions; track option.value) {
                <option [ngValue]="option.value">{{ option.label }}</option>
              }
            </select>

            <button
              type="button"
              class="rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition"
              [disabled]="!!missingRequiredParams() || (!store.executionLoading() && !view()?.datasourceId)"
              [ngClass]="store.executionLoading() ? 'bg-slate-700 hover:bg-slate-800' : 'bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300'"
              [title]="missingRequiredParams() || ''"
              (click)="store.executionLoading() ? store.stopExecution() : store.execute(limit)"
            >
              {{ store.executionLoading() ? '⏹ Arrêter' : '▶ Exécuter' }}
            </button>

            <button
              type="button"
              class="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              (click)="resetRunParameters()"
            >
              ⟳ Réinitialiser
            </button>
          </div>
        </section>

        @if (store.queryResult()) {
          <section class="mt-6 grid gap-6">
            <div class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 class="mb-4 text-lg font-semibold text-slate-900">Visualisations compatibles</h2>
              <app-sql-view-viz-selector
                [compatibleViz]="store.queryResult()!.compatibleViz"
                [selectedViz]="store.selectedViz()"
                (vizSelected)="store.selectViz($event)"
              ></app-sql-view-viz-selector>
            </div>

            @if (store.selectedViz() && store.selectedViz()!.compatible && store.currentVizConfig()) {
              <div class="grid gap-6 xl:grid-cols-[26rem_minmax(0,1fr)]">
                <section class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 class="mb-4 text-lg font-semibold text-slate-900">Mapping</h2>
                  <div class="grid gap-4">
                    @if (needsXAxis()) {
                      <label class="grid gap-2 text-sm">
                        <span class="font-medium text-slate-700">Axe X</span>
                        <select
                          class="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                          [ngModel]="store.currentVizConfig()!.mapping.xAxis || ''"
                          (ngModelChange)="store.updateVizMapping({ xAxis: $event || undefined })"
                        >
                          <option value="">Sélectionner</option>
                          @for (column of xAxisColumns(); track column.name) {
                            <option [value]="column.name">{{ column.name }}</option>
                          }
                        </select>
                      </label>
                    }

                    @if (needsSeries()) {
                      <div class="grid gap-2 text-sm">
                        <span class="font-medium text-slate-700">Séries</span>
                        <div class="flex flex-wrap gap-2">
                          @for (series of selectedSeries(); track series; let index = $index) {
                            <span class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                              {{ series }}
                              <button type="button" (click)="removeSeries(index)">×</button>
                            </span>
                          }
                        </div>
                        @if (selectedSeries().length < maxSeries()) {
                          <div class="flex gap-2">
                            <select
                              [(ngModel)]="pendingSeries"
                              class="flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                            >
                              <option value="">Ajouter une série</option>
                              @for (column of availableSeriesColumns(); track column.name) {
                                <option [value]="column.name">{{ column.name }}</option>
                              }
                            </select>
                            <button
                              type="button"
                              class="rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                              (click)="addSeries()"
                            >
                              + Ajouter
                            </button>
                          </div>
                        }
                      </div>
                    }

                    @if (needsLabel()) {
                      <label class="grid gap-2 text-sm">
                        <span class="font-medium text-slate-700">Label</span>
                        @if (store.selectedViz()!.type === vizType.KPI) {
                          <input
                            class="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                            [ngModel]="store.currentVizConfig()!.mapping.label || ''"
                            (ngModelChange)="store.updateVizMapping({ label: $event || undefined })"
                          />
                        } @else {
                          <select
                            class="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                            [ngModel]="store.currentVizConfig()!.mapping.label || ''"
                            (ngModelChange)="store.updateVizMapping({ label: $event || undefined })"
                          >
                            <option value="">Sélectionner</option>
                            @for (column of textColumns(); track column.name) {
                              <option [value]="column.name">{{ column.name }}</option>
                            }
                          </select>
                        }
                      </label>
                    }

                    @if (needsValue()) {
                      <label class="grid gap-2 text-sm">
                        <span class="font-medium text-slate-700">Valeur</span>
                        <select
                          class="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                          [ngModel]="store.currentVizConfig()!.mapping.value || ''"
                          (ngModelChange)="store.updateVizMapping({ value: $event || undefined })"
                        >
                          <option value="">Sélectionner</option>
                          @for (column of numericColumns(); track column.name) {
                            <option [value]="column.name">{{ column.name }}</option>
                          }
                        </select>
                      </label>
                    }

                    @if (store.selectedViz()!.type === vizType.TABLE) {
                      <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                        Toutes les colonnes seront affichées.
                      </div>
                    }

                    @if (store.selectedViz()!.type !== vizType.TABLE) {
                      <label class="grid gap-2 text-sm">
                        <span class="font-medium text-slate-700">Titre du graphique</span>
                        <input
                          class="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                          [ngModel]="store.currentVizConfig()!.title"
                          (ngModelChange)="store.updateVizTitle($event)"
                        />
                      </label>

                      <div class="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <label class="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
                          <span>Couleurs personnalisées</span>
                          <input
                            type="checkbox"
                            class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            [ngModel]="store.currentVizConfig()!.useCustomColors"
                            (ngModelChange)="store.toggleCustomColors()"
                          />
                        </label>

                        @if (store.currentVizConfig()!.useCustomColors) {
                          <div class="grid gap-2">
                            @for (color of vizColors(); track $index; let index = $index) {
                              <label class="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm">
                                <span>Série {{ index + 1 }}</span>
                                <input type="color" [value]="color" (input)="updateColor(index, $any($event.target).value)" />
                              </label>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                </section>

                <section class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 class="mb-4 text-lg font-semibold text-slate-900">Rendu</h2>
                  <app-sql-view-chart-renderer
                    [queryResult]="store.queryResult()"
                    [vizConfig]="store.currentVizConfig()"
                  ></app-sql-view-chart-renderer>
                </section>
              </div>
            }
          </section>
        }
      </div>
    </div>

    <app-sql-view-category-modal
      [isOpen]="showCategoryModal()"
      (close)="showCategoryModal.set(false)"
      (created)="onCategoryCreated($event)"
    ></app-sql-view-category-modal>
  `
})
export class SqlViewEditorComponent {
  protected readonly store = createSqlViewStore();
  protected readonly paramType = ParamType;
  protected readonly sqlViewStatus = SqlViewStatus;
  protected readonly vizType = VizType;
  protected readonly paramPanelOpen = signal(true);
  protected readonly showCategoryModal = signal(false);
  protected readonly view = this.store.currentView;
  protected readonly limitOptions = [
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: '500', value: 500 },
    { label: '1000', value: 1000 },
    { label: 'Aucune', value: 10000 }
  ];
  protected readonly lineNumbers = computed(() =>
    Array.from({ length: Math.max(1, (this.view()?.sql || '').split('\n').length) }, (_, index) => index + 1)
  );
  protected readonly highlightedSql = computed(() => this.highlightSql(this.view()?.sql || ''));
  protected readonly parameters = computed(() => this.view()?.parameters ?? []);
  protected readonly activeParameters = computed(() =>
    this.parameters().filter((parameter) => !this.store.obsoleteParams().includes(parameter.name))
  );
  protected readonly numericColumns = computed(() => this.columnsByType([ColumnType.NUMBER]));
  protected readonly textColumns = computed(() => this.columnsByType([ColumnType.TEXT]));
  protected readonly dateColumns = computed(() => this.columnsByType([ColumnType.DATE, ColumnType.DATETIME]));
  protected readonly xAxisColumns = computed(() =>
    this.columnsByType([ColumnType.TEXT, ColumnType.DATE, ColumnType.DATETIME, ColumnType.NUMBER])
  );
  protected readonly editorStatus = computed(() =>
    this.store.currentVizConfig() ? SqlViewStatus.READY : SqlViewStatus.DRAFT
  );
  protected readonly saveDisabledReason = computed(() => {
    const current = this.view();
    if (!current?.name.trim()) {
      return 'Le nom est requis.';
    }
    if (!current.datasourceId) {
      return 'La datasource doit être sélectionnée.';
    }
    return null;
  });
  protected readonly missingRequiredParams = computed(() => {
    const missing = this.activeParameters()
      .filter((parameter) => parameter.required && !this.store.paramValues()[parameter.name])
      .map((parameter) => parameter.label);
    return missing.length ? `Renseignez : ${missing.join(', ')}.` : null;
  });
  protected readonly selectedSeries = computed(() => this.store.currentVizConfig()?.mapping.yAxis ?? []);
  protected readonly availableSeriesColumns = computed(() =>
    this.numericColumns().filter((column) => !this.selectedSeries().includes(column.name))
  );
  protected readonly vizColors = computed(() => {
    const config = this.store.currentVizConfig();
    const count = Math.max(1, this.selectedSeries().length || (this.needsValue() ? 1 : 0));
    const colors = config?.colors ? [...config.colors] : ['#2563EB'];
    while (colors.length < count) {
      colors.push(['#2563EB', '#38BDF8', '#0F766E', '#F59E0B', '#7C3AED'][colors.length % 5]);
    }
    return colors.slice(0, count);
  });

  protected limit = 100;
  protected pendingSeries = '';
  protected dragIndex = -1;

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.store.openEditor(id).then(() => {
          if (this.route.snapshot.queryParamMap.get('run') === '1') {
            this.store.execute(this.limit);
          }
        });
      } else {
        this.store.openNewEditor();
      }
    });
  }

  canDeactivate(): boolean {
    return !this.store.isDirty() || window.confirm('Des modifications non sauvegardées seront perdues. Continuer ?');
  }

  protected goBack(): void {
    if (!this.canDeactivate()) {
      return;
    }
    this.store.resetEditor();
    this.router.navigate(['/sql-views']);
  }

  protected save(): void {
    this.store.saveView().then((saved) => {
      if (saved?.id) {
        this.router.navigate(['/sql-views', saved.id]);
      }
    });
  }

  protected resetRunParameters(): void {
    this.activeParameters().forEach((parameter) =>
      this.store.updateParam(parameter.name, parameter.defaultValue ?? '')
    );
  }

  protected onCategoryCreated(event: { label: string; color: string }): void {
    this.store.createCategory(event.label, event.color).then(() => {
      this.showCategoryModal.set(false);
    });
  }

  protected onParamConfigChange(event: Partial<SqlViewParameter> & { name: string }): void {
    const { name, ...config } = event;
    this.store.updateParamConfig(name, config);
  }

  protected onParamDrop(index: number): void {
    if (this.dragIndex < 0) {
      return;
    }
    this.store.reorderParameters(this.dragIndex, index);
    this.dragIndex = -1;
  }

  protected onSqlKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      this.store.execute(this.limit);
    }
  }

  protected needsXAxis(): boolean {
    const type = this.store.selectedViz()?.type;
    return [VizType.BAR, VizType.LINE, VizType.AREA, VizType.STACKED_BAR, VizType.SCATTER].includes(type!);
  }

  protected needsSeries(): boolean {
    const type = this.store.selectedViz()?.type;
    return [VizType.BAR, VizType.LINE, VizType.AREA, VizType.STACKED_BAR, VizType.SCATTER].includes(type!);
  }

  protected needsLabel(): boolean {
    const type = this.store.selectedViz()?.type;
    return [VizType.PIE, VizType.DONUT, VizType.SCATTER, VizType.KPI].includes(type!);
  }

  protected needsValue(): boolean {
    const type = this.store.selectedViz()?.type;
    return [VizType.PIE, VizType.DONUT, VizType.KPI].includes(type!);
  }

  protected maxSeries(): number {
    return this.store.selectedViz()?.type === VizType.STACKED_BAR ? 5 : this.store.selectedViz()?.type === VizType.SCATTER ? 1 : 5;
  }

  protected addSeries(): void {
    if (!this.pendingSeries) {
      return;
    }
    this.store.updateVizMapping({
      yAxis: [...this.selectedSeries(), this.pendingSeries].slice(0, this.maxSeries())
    });
    this.pendingSeries = '';
  }

  protected removeSeries(index: number): void {
    const next = [...this.selectedSeries()];
    next.splice(index, 1);
    this.store.updateVizMapping({ yAxis: next });
  }

  protected updateColor(index: number, color: string): void {
    const colors = [...this.vizColors()];
    colors[index] = color;
    this.store.updateVizColors(colors);
  }

  private columnsByType(types: ColumnType[]): ColumnMeta[] {
    return (this.store.queryResult()?.columns ?? []).filter((column) => types.includes(column.type));
  }

  private highlightSql(sql: string): string {
    const escape = (value: string) =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const keywords = /\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|GROUP|ORDER|BY|LIMIT|HAVING|UNION|INSERT|UPDATE|DELETE|AS|AND|OR|ON)\b/gi;
    return escape(sql)
      .replace(/(--.*)$/gm, '<span class="text-slate-500">$1</span>')
      .replace(/('[^']*')/g, '<span class="text-emerald-400">$1</span>')
      .replace(/(:[a-zA-Z_][\w]*)/g, '<span class="rounded bg-amber-500/15 px-1 text-amber-300">$1</span>')
      .replace(keywords, '<span class="font-semibold text-sky-400">$1</span>')
      .replace(/\n/g, '<br/>');
  }
}
