import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              *ngFor="let column of columns"
              class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            *ngFor="let row of rows; let last = last"
            class="hover:bg-gray-50 transition-colors"
            [class.border-b]="!last"
          >
            <td
              *ngFor="let column of columns"
              class="px-6 py-4 text-sm text-gray-900"
            >
              <ng-container *ngIf="column.type === 'text'">
                {{ row[column.key] }}
              </ng-container>
              <ng-container *ngIf="column.type === 'badge'">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  [ngClass]="getBadgeClass(row[column.key])"
                >
                  {{ row[column.key] }}
                </span>
              </ng-container>
              <ng-container *ngIf="column.type === 'actions'">
                <div class="flex items-center gap-2">
                  <button
                    *ngFor="let action of column.actions"
                    (click)="action.callback(row)"
                    class="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    {{ action.label }}
                  </button>
                </div>
              </ng-container>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: []
})
export class DataTableComponent {
  @Input() columns: any[] = [];
  @Input() rows: any[] = [];

  getBadgeClass(value: string): string {
    const classes: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      default: 'bg-blue-100 text-blue-800'
    };
    return classes[value] || classes['default'];
  }
}
