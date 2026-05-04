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
      <div class="absolute inset-0 bg-gray-600 bg-opacity-75" (click)="close.emit()"></div>
      <div class="absolute inset-y-0 right-0 max-w-full flex">
        <div class="w-screen max-w-md">
          <div class="h-full flex flex-col bg-white shadow-xl">
            <div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-medium text-gray-900">{{ isEdit() ? 'Éditer' : 'Créer' }} un Datasource</h2>
                <button (click)="close.emit()" class="text-gray-400 hover:text-gray-500">
                  <span class="sr-only">Fermer</span>
                  ×
                </button>
              </div>

              <form [formGroup]="form" (ngSubmit)="onSubmit()" class="mt-6 space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nom</label>
                  <input type="text" formControlName="name" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Type</label>
                  <select formControlName="type" (change)="onTypeChange()" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                    <option *ngFor="let type of datasourceTypes" [value]="type.value">{{ type.label }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Hôte</label>
                  <input type="text" formControlName="host" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Port</label>
                  <input type="number" formControlName="port" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Base de données</label>
                  <input type="text" formControlName="database" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Schéma</label>
                  <input type="text" formControlName="schema" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Utilisateur</label>
                  <input type="text" formControlName="username" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
                  <div class="relative">
                    <input [type]="showPassword ? 'text' : 'password'" formControlName="password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm pr-10">
                    <button type="button" (click)="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <span class="text-gray-400">{{ showPassword ? 'Masquer' : 'Afficher' }}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Timeout (ms)</label>
                  <input type="number" formControlName="timeoutMs" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                </div>

                <div *ngIf="store.testResult()" class="p-4 border rounded">
                  <p [ngClass]="store.testResult()!.success ? 'text-green-600' : 'text-red-600'">
                    {{ store.testResult()!.message }}
                  </p>
                  <p *ngIf="store.testResult()!.dbVersion" class="text-sm text-gray-600">
                    Version DB: {{ store.testResult()!.dbVersion }}
                  </p>
                </div>
              </form>
            </div>

            <div class="flex-shrink-0 px-4 py-4 flex justify-end space-x-2">
              <button (click)="onTestConnection()" [disabled]="form.invalid || store.loading()" class="bg-gray-600 text-white px-4 py-2 rounded">
                Tester la connexion
              </button>
              <button (click)="close.emit()" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">
                Annuler
              </button>
              <button (click)="onSubmit()" [disabled]="form.invalid || store.loading()" class="bg-blue-600 text-white px-4 py-2 rounded">
                Enregistrer
              </button>
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