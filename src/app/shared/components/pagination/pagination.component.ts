import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
      <div class="text-sm text-gray-600">
        Showing <span class="font-medium">{{ pageSize }}</span> of
        <span class="font-medium">{{ totalItems }}</span> items
      </div>

      <div class="flex items-center gap-2">
        <button
          (click)="previousPage()"
          [disabled]="currentPage === 1"
          class="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>

        <div class="flex items-center gap-1">
          <span *ngFor="let page of getPages()" class="text-sm">
            <button
              *ngIf="page !== '...'"
              (click)="goToPageClick(page)"
              [class.bg-blue-600]="page === currentPage"
              [class.text-white]="page === currentPage"
              [class.text-gray-700]="page !== currentPage"
              class="w-8 h-8 rounded-lg border transition-colors"
              [class.border-blue-600]="page === currentPage"
              [class.border-gray-300]="page !== currentPage"
            >
              {{ page }}
            </button>
            <span *ngIf="page === '...'" class="text-gray-400">{{ page }}</span>
          </span>
        </div>

        <button
          (click)="nextPage()"
          [disabled]="currentPage === totalPages"
          class="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  @Input() totalItems: number = 100;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPageClick(page: any): void {
    if (typeof page === 'number') {
      this.currentPage = page;
    }
  }

  getPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (this.currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (this.currentPage < this.totalPages - 2) {
        pages.push('...');
      }

      pages.push(this.totalPages);
    }

    return pages;
  }
}
