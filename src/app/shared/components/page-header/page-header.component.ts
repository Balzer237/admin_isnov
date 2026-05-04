import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageAction } from '../../../core/models/navigation.model';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
          <p *ngIf="subtitle" class="mt-1 text-gray-600">{{ subtitle }}</p>
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
          <ng-container *ngFor="let action of actions">
            <button
              (click)="action.action()"
              [ngClass]="getActionClass(action.variant)"
              class="px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
              <span *ngIf="action.icon">{{ action.icon }}</span>
              {{ action.label }}
            </button>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() actions: PageAction[] = [];

  getActionClass(variant?: string): string {
    switch (variant) {
      case 'primary':
        return 'bg-secondary-600 hover:bg-secondary-700 text-white';
      case 'secondary':
        return 'bg-primary-100 hover:bg-primary-200 text-primary-700';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-secondary-600 hover:bg-secondary-700 text-white';
    }
  }
}
