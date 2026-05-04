import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-6">
      <div class="text-5xl mb-4">{{ icon }}</div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
      <p class="text-gray-600 text-center max-w-md">{{ description }}</p>
      <button
        *ngIf="actionLabel"
        (click)="onAction()"
        class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
      >
        {{ actionLabel }}
      </button>
    </div>
  `,
  styles: []
})
export class EmptyStateComponent {
  @Input() icon: string = '📭';
  @Input() title: string = 'No data found';
  @Input() description: string = 'There is no data to display at the moment.';
  @Input() actionLabel?: string;

  onAction(): void {
    // Emit event or call callback
  }
}
