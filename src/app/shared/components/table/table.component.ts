import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'date' | 'number' | 'string';
}

interface TableAction {
  label: string;
  action: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            @for (column of columns; track column.key) {
              <th
                [ngClass]="{ 'sortable': column.sortable }"
                (click)="column.sortable && onSort(column.key)">
                {{ column.label }}
                @if (column.sortable) {
                  <span class="sort-icon">
                    @if (sortColumn === column.key) {
                      <span [ngClass]="sortDirection === 'asc' ? 'asc' : 'desc'">↑</span>
                    } @else {
                      <span class="neutral">↕</span>
                    }
                  </span>
                }
              </th>
            }
            @if (actions.length > 0) {
              <th>Actions</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (item of sortedData(); track item.id || $index) {
            <tr>
              @for (column of columns; track column.key) {
                <td>{{ formatCellValue(item[column.key], column.type) }}</td>
              }
              @if (actions.length > 0) {
                <td class="actions-cell">
                  @for (action of actions; track action.action) {
                    <button
                      type="button"
                      class="action-btn"
                      [ngClass]="action.variant || 'secondary'"
                      (click)="onAction(action.action, item)"
                      [title]="action.label">
                      @if (action.icon) {
                        <span class="action-icon">{{ getIconSymbol(action.icon) }}</span>
                      }
                      {{ action.label }}
                    </button>
                  }
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
      @if (data.length === 0) {
        <div class="empty-state">
          Aucune donnée disponible
        </div>
      }
    </div>
  `,
  styles: [`
    .table-container {
      overflow-x: auto;
      border: 1px solid #E5E7EB;
      border-radius: 0.5rem;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    .data-table th {
      background-color: #F9FAFB;
      padding: 0.75rem 1rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #E5E7EB;
    }

    .data-table th.sortable {
      cursor: pointer;
      user-select: none;
    }

    .data-table th.sortable:hover {
      background-color: #F3F4F6;
    }

    .sort-icon {
      margin-left: 0.5rem;
      font-size: 0.75rem;
      color: #6B7280;
    }

    .data-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #E5E7EB;
      color: #374151;
    }

    .data-table tbody tr:hover {
      background-color: #F9FAFB;
    }

    .actions-cell {
      white-space: nowrap;
    }

    .action-btn {
      padding: 0.25rem 0.5rem;
      margin-right: 0.5rem;
      border: 1px solid #D1D5DB;
      border-radius: 0.25rem;
      background: white;
      color: #374151;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background-color: #F3F4F6;
    }

    .action-btn.primary {
      background-color: #3B82F6;
      color: white;
      border-color: #3B82F6;
    }

    .action-btn.primary:hover {
      background-color: #2563EB;
    }

    .action-btn.danger {
      background-color: #EF4444;
      color: white;
      border-color: #EF4444;
    }

    .action-btn.danger:hover {
      background-color: #DC2626;
    }

    .action-icon {
      margin-right: 0.25rem;
    }

    .empty-state {
      padding: 2rem;
      text-align: center;
      color: #6B7280;
    }
  `]
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Output() action = new EventEmitter<{ action: string; item: any }>();

  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  sortedData() {
    if (!this.sortColumn) return this.data;

    return [...this.data].sort((a, b) => {
      const aVal = a[this.sortColumn];
      const bVal = b[this.sortColumn];

      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  onSort(columnKey: string): void {
    if (this.sortColumn === columnKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnKey;
      this.sortDirection = 'asc';
    }
  }

  formatCellValue(value: any, type?: string): string {
    if (value == null) return '';

    switch (type) {
      case 'date':
        return new Date(value).toLocaleDateString('fr-FR');
      case 'number':
        return Number(value).toLocaleString('fr-FR');
      default:
        return String(value);
    }
  }

  onAction(action: string, item: any): void {
    this.action.emit({ action, item });
  }

  getIconSymbol(icon: string): string {
    const icons: { [key: string]: string } = {
      edit: '✏',
      eye: '👁',
      trash: '🗑',
      plus: '+',
      database: '🗃'
    };
    return icons[icon] || '';
  }
}