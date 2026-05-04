import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Datasource, ConnectionStatus } from '../domain/datasource.model';

@Component({
  selector: 'app-datasource-test-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2">
      <span
        [ngClass]="getStatusClass(datasource().status)"
        class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
      >
        {{ getStatusLabel(datasource().status) }}
      </span>
      <button
        *ngIf="!isTesting()"
        (click)="test.emit()"
        class="text-xs font-semibold text-blue-700 hover:text-blue-800 transition"
      >
        Tester
      </button>
      <div
        *ngIf="isTesting()"
        class="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"
      ></div>
    </div>
  `,
  styles: []
})
export class DatasourceTestBadgeComponent {
  datasource = input.required<Datasource>();
  test = output<void>();
  isTesting = input<boolean>(false);

  getStatusClass(status: ConnectionStatus): string {
    switch (status) {
      case ConnectionStatus.CONNECTED: return 'bg-emerald-100 text-emerald-700';
      case ConnectionStatus.ERROR: return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }

  getStatusLabel(status: ConnectionStatus): string {
    switch (status) {
      case ConnectionStatus.CONNECTED: return 'Connecté';
      case ConnectionStatus.ERROR: return 'Erreur';
      default: return 'Non testé';
    }
  }
}