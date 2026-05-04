import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-page-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6 flex items-center justify-between gap-4">
      <div class="flex-1 flex items-center gap-3">
        <!-- Search Input -->
        <div class="relative flex-1 max-w-xs">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</div>
          <input
            type="text"
            [(ngModel)]="searchValue"
            (keyup.enter)="onSearch()"
            [placeholder]="searchPlaceholder"
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Filters -->
        <div *ngFor="let filter of filters" class="relative">
          <button
            (click)="toggleFilterDropdown(filter.id)"
            class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            {{ filter.label }}
            <span class="text-gray-400">▼</span>
          </button>
          <div
            *ngIf="activeFilterDropdown === filter.id"
            class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-30"
          >
            <button
              *ngFor="let option of filter.options"
              (click)="selectFilterOption(filter.id, option); toggleFilterDropdown(filter.id)"
              class="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              {{ option }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div *ngIf="tabs && tabs.length > 0" class="flex items-center gap-2 border-b border-gray-200">
        <button
          *ngFor="let tab of tabs"
          (click)="selectTab(tab.id)"
          [class.border-b-2]="activeTab === tab.id"
          [class.border-blue-600]="activeTab === tab.id"
          [class.text-blue-600]="activeTab === tab.id"
          class="px-4 py-2 text-sm font-medium text-gray-700 transition-colors"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <button
          *ngIf="showViewToggle"
          (click)="toggleView()"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          [title]="viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'"
        >
          {{ viewMode === 'grid' ? '≡' : '⊞' }}
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class PageToolbarComponent {
  @Input() searchPlaceholder: string = 'Search...';
  @Input() filters: any[] = [];
  @Input() tabs: any[] = [];
  @Input() showViewToggle: boolean = false;

  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<{ filterId: string; value: string }>();
  @Output() tabChange = new EventEmitter<string>();
  @Output() viewChange = new EventEmitter<string>();

  searchValue: string = '';
  activeFilterDropdown: string | null = null;
  activeTab: string = '';
  viewMode: string = 'grid';

  ngOnInit(): void {
    if (this.tabs && this.tabs.length > 0) {
      this.activeTab = this.tabs[0].id;
    }
  }

  onSearch(): void {
    this.searchChange.emit(this.searchValue);
  }

  toggleFilterDropdown(filterId: string): void {
    this.activeFilterDropdown = this.activeFilterDropdown === filterId ? null : filterId;
  }

  selectFilterOption(filterId: string, value: string): void {
    this.filterChange.emit({ filterId, value });
  }

  selectTab(tabId: string): void {
    this.activeTab = tabId;
    this.tabChange.emit(tabId);
  }

  toggleView(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    this.viewChange.emit(this.viewMode);
  }
}
