import { Component, input, output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatasourceStore } from './datasource.store';
import { Datasource, DatasourceType, CreateDatasourceDto } from '../domain/datasource.model';

@Component({
  selector: 'app-datasource-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="isOpen()" class="fixed inset-0 z-50 overflow-hidden">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" (click)="close.emit()"></div>
      <div class="absolute inset-y-0 right-0 max-w-full flex">
        <div class="w-screen max-w-lg">
          <div class="h-full flex flex-col bg-white shadow-2xl">
            <div class="flex-1 py-6 overflow-y-auto px-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-slate-900">
                  {{ isEdit() ? 'Éditer' : 'Créer' }} un Datasource
                </h2>
                <button
                  (click)="close.emit()"
                  class="rounded-xl p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <span class="sr-only">Fermer</span>
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Nom du datasource</label>
                    <input
                      type="text"
                      formControlName="name"
                      class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      placeholder="Mon datasource"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Type de base de données</label>
                    <select
                      formControlName="type"
                      (change)="onTypeChange()"
                      class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                      <option *ngFor="let type of datasourceTypes" [value]="type.value">{{ type.label }}</option>
                    </select>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Hôte</label>
                      <input
                        type="text"
                        formControlName="host"
                        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        placeholder="localhost"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Port</label>
                      <input
                        type="number"
                        formControlName="port"
                        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        placeholder="5432"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Base de données</label>
                      <input
                        type="text"
                        formControlName="database"
                        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        placeholder="mydb"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Schéma</label>
                      <input
                        type="text"
                        formControlName="schema"
                        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        placeholder="public"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Utilisateur</label>
                      <input
                        type="text"
                        formControlName="username"
                        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        placeholder="postgres"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Timeout (ms)</label>
                      <input
                        type="number"
                        formControlName="timeoutMs"
                        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        placeholder="30000"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Mot de passe</label>
                    <div class="relative">
                      <input
                        [type]="showPassword ? 'text' : 'password'"
                        formControlName="password"
                        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        (click)="showPassword = !showPassword"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                      >
                        <svg *ngIf="!showPassword" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <svg *ngIf="showPassword" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                @if (store.testResult()) {
                  <div
                    class="rounded-xl border p-4"
                    [ngClass]="store.testResult()!.success ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'"
                  >
                    <div class="flex items-center gap-2">
                      <svg
                        class="h-4 w-4"
                        [ngClass]="store.testResult()!.success ? 'text-emerald-600' : 'text-red-600'"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          *ngIf="store.testResult()!.success"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                        <path
                          *ngIf="!store.testResult()!.success"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <p
                        class="text-sm font-medium"
                        [ngClass]="store.testResult()!.success ? 'text-emerald-700' : 'text-red-700'"
                      >
                        {{ store.testResult()!.message }}
                      </p>
                    </div>
                    @if (store.testResult()!.dbVersion) {
                      <p class="text-xs text-slate-500 mt-1">
                        Version DB: {{ store.testResult()!.dbVersion }}
                      </p>
                    }
                  </div>
                }
              </form>
            </div>

            <div class="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <div class="flex justify-end gap-3">
                <button
                  (click)="onTestConnection()"
                  [disabled]="form.invalid || store.loading()"
                  class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tester la connexion
                </button>
                <button
                  (click)="close.emit()"
                  class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-white transition"
                >
                  Annuler
                </button>
                <button
                  (click)="onSubmit()"
                  [disabled]="form.invalid || store.loading()"
                  class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isEdit() ? 'Mettre à jour' : 'Créer' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DatasourceFormComponent implements OnInit {
  store = inject(DatasourceStore);
  fb = inject(FormBuilder);

  datasource = input<Datasource | null>(null);
  isOpen = input<boolean>(false);
  isEdit = input<boolean>(false);
  close = output<void>();
  saved = output<void>();

  form!: FormGroup;
  showPassword = false;

  datasourceTypes = [
    { value: DatasourceType.POSTGRESQL, label: 'PostgreSQL', defaultPort: 5432 },
    { value: DatasourceType.MYSQL, label: 'MySQL', defaultPort: 3306 },
    { value: DatasourceType.ORACLE, label: 'Oracle', defaultPort: 1521 },
    { value: DatasourceType.SQLSERVER, label: 'SQL Server', defaultPort: 1433 },
    { value: DatasourceType.H2, label: 'H2', defaultPort: 9092 }
  ];

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, this.uniqueNameValidator.bind(this)]],
      type: [DatasourceType.POSTGRESQL, Validators.required],
      host: ['', Validators.required],
      port: [5432, Validators.required],
      database: ['', Validators.required],
      schema: [''],
      username: ['', Validators.required],
      password: ['', Validators.required],
      timeoutMs: [30000, Validators.required]
    });

    if (this.isEdit() && this.datasource()) {
      this.form.patchValue(this.datasource()!);
    }

    this.form.get('type')!.valueChanges.subscribe(() => this.onTypeChange());
  }

  onTypeChange() {
    const type = this.form.get('type')!.value;
    const defaultPort = this.datasourceTypes.find(t => t.value === type)?.defaultPort || 5432;
    this.form.get('port')!.setValue(defaultPort);
  }

  uniqueNameValidator(control: any) {
    const name = control.value;
    const existingNames = this.store.datasources().map(d => d.name);
    if (this.isEdit() && this.datasource()) {
      existingNames.splice(existingNames.indexOf(this.datasource()!.name), 1);
    }
    return existingNames.includes(name) ? { uniqueName: true } : null;
  }

  onTestConnection() {
    if (this.isEdit() && this.datasource()) {
      this.store.testConnection(this.datasource()!.id);
    } else {
      // For new, test with temp data
      // TODO: implement temp test
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const dto: CreateDatasourceDto = this.form.value;
      if (this.isEdit() && this.datasource()) {
        this.store.updateDatasource(this.datasource()!.id, dto);
      } else {
        this.store.createDatasource(dto);
      }
      this.saved.emit();
      this.close.emit();
    }
  }
}