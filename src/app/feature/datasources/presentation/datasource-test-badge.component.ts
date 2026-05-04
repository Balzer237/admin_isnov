import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Datasource, ConnectionStatus } from '../domain/datasource.model';

@Component({
  selector: 'app-datasource-test-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center">
      <span [ngClass]="getStatusClass(datasource().status)" class="px-2 py-1 rounded text-sm">
        {{ getStatusLabel(datasource().status) }}
      </span>
      <button *ngIf="!isTesting()" (click)="test.emit()" class="ml-2 text-blue-600 text-sm">Tester</button>
      <div *ngIf="isTesting()" class="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
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
      case ConnectionStatus.CONNECTED: return 'bg-green-100 text-green-800';
      case ConnectionStatus.ERROR: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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