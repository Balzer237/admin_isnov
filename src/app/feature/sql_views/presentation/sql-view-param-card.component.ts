import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParamType, SqlViewParameter } from '../domain/sql-view.model';

@Component({
  selector: 'app-sql-view-param-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="rounded-2xl border p-4 transition-all"
      [ngClass]="
        isObsolete
          ? 'border-red-200 bg-red-50/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]'
          : 'border-slate-200 bg-white hover:border-blue-200'
      "
    >
      <div class="mb-4 flex items-center justify-between gap-3">
        <div>
          <div class="text-sm font-semibold text-slate-900">{{ parameter.label || parameter.name }}</div>
          <div class="text-xs text-slate-500">:{{ parameter.name }}</div>
        </div>
        <div class="flex items-center gap-2">
          @if (isObsolete) {
            <span class="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-700">
              Obsolète
            </span>
          }
          <button
            type="button"
            class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 hover:border-red-200 hover:text-red-600"
            (click)="paramDelete.emit(parameter.name)"
          >
            Retirer
          </button>
        </div>
      </div>

      <div class="grid gap-3">
        <label class="grid gap-1 text-sm">
          <span class="font-medium text-slate-700">Libellé</span>
          <input
            class="rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            [ngModel]="parameter.label"
            (ngModelChange)="patch({ label: $event })"
          />
        </label>

        <label class="grid gap-1 text-sm">
          <span class="font-medium text-slate-700">Type</span>
          <select
            class="rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            [ngModel]="parameter.type"
            (ngModelChange)="patch({ type: $event })"
          >
            @for (type of paramTypes; track type.value) {
              <option [ngValue]="type.value">{{ type.label }}</option>
            }
          </select>
        </label>

        <label class="grid gap-1 text-sm">
          <span class="font-medium text-slate-700">Valeur par défaut</span>
          <input
            class="rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            [ngModel]="parameter.defaultValue"
            (ngModelChange)="patch({ defaultValue: $event })"
          />
        </label>

        <label class="grid gap-1 text-sm">
          <span class="font-medium text-slate-700">Dépend de</span>
          <input
            class="rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            [ngModel]="parameter.dependsOn || ''"
            (ngModelChange)="patch({ dependsOn: $event || undefined })"
            placeholder="Nom d’un autre paramètre"
          />
        </label>

        <label class="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            [ngModel]="parameter.required"
            (ngModelChange)="patch({ required: $event })"
          />
          Champ obligatoire
        </label>

        @if (parameter.type === paramType.LIST_SQL) {
          <label class="grid gap-1 text-sm">
            <span class="font-medium text-slate-700">SQL de liste</span>
            <textarea
              rows="4"
              class="rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              [ngModel]="parameter.listQuery || ''"
              (ngModelChange)="patch({ listQuery: $event })"
              placeholder="SELECT label, value FROM ..."
            ></textarea>
          </label>
        }
      </div>
    </div>
  `
})
export class SqlViewParamCardComponent {
  @Input({ required: true }) parameter!: SqlViewParameter;
  @Input() isObsolete = false;

  @Output() paramConfigChange = new EventEmitter<Partial<SqlViewParameter> & { name: string }>();
  @Output() paramDelete = new EventEmitter<string>();

  paramType = ParamType;
  paramTypes = [
    { value: ParamType.TEXT, label: 'Texte' },
    { value: ParamType.NUMBER, label: 'Nombre' },
    { value: ParamType.DATE, label: 'Date' },
    { value: ParamType.DATETIME, label: 'Date et heure' },
    { value: ParamType.BOOLEAN, label: 'Booléen' },
    { value: ParamType.LIST_STATIC, label: 'Liste fixe' },
    { value: ParamType.LIST_SQL, label: 'Liste SQL' }
  ];

  patch(config: Partial<SqlViewParameter>): void {
    this.paramConfigChange.emit({
      name: this.parameter.name,
      ...config
    });
  }
}
