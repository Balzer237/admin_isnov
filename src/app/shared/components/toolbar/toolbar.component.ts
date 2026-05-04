import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ToolbarFilter {
  id: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
}

export interface ToolbarTab {
  id: string;
  label: string;
  count?: number;
  active?: boolean;
}

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6 space-y-4">
      <!-- Search and Filters Row -->
      <div class="flex items-center gap-4">
        <!-- Search Input -->
        <div class="flex-1" *ngIf="showSearch">
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              [(ngModel)]="searchValue"
              (keyup.enter)="onSearch()"
              [placeholder]="searchPlaceholder"
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Filters -->
        <div class="flex items-center gap-3" *ngIf="filters.length > 0">
          <select
            *ngFor="let filter of filters"
            [(ngModel)]="filter.value"
            (change)="filter.onChange?.(filter.value)"
            class="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{{ filter.label }}</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>

        <!-- Action Buttons -->
        <ng-content select="[toolbar-actions]"></ng-content>
      </div>

      <!-- Tabs -->
      <div *ngIf="tabs.length > 0" class="flex items-center gap-6 border-b border-gray-200">
        <button
          *ngFor="let tab of tabs"
          (click)="selectTab(tab)"
          [class.border-b-2]="tab.active"
          [class.border-blue-600]="tab.active"
          [class.text-blue-600]="tab.active"
          [class.text-gray-600]="!tab.active"
          class="pb-3 font-medium text-sm transition-colors hover:text-gray-900"
        >
          {{ tab.label }}
          <span *ngIf="tab.count" class="ml-2 text-gray-500">({{ tab.count }})</span>
        </button>
      </div>
    </div>
  `,
  styles: [':host { @apply block; }']
})
export class ToolbarComponent {
  @Input() showSearch: boolean = true;
  @Input() searchPlaceholder: string = 'Search...';
  @Input() filters: ToolbarFilter[] = [];
  @Input() tabs: ToolbarTab[] = [];

  searchValue: string = '';

  onSearch(): void {
    console.log('Search:', this.searchValue);
  }

  selectTab(tab: ToolbarTab): void {
    this.tabs.forEach(t => (t.active = false));
    tab.active = true;
    console.log('Selected tab:', tab.id);
  }
}
