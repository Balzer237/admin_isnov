import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 min-h-screen" style="background-color: #f8fafc;">
      <!-- Page Header -->
      <div *ngIf="title" class="mb-8">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
            <p *ngIf="subtitle" class="mt-2 text-lg text-gray-600">{{ subtitle }}</p>
          </div>
          <div *ngIf="showActions" class="flex-shrink-0">
            <ng-content select="[page-actions]"></ng-content>
          </div>
        </div>
      </div>

      <!-- Toolbar -->
      <div *ngIf="showToolbar" class="mb-6">
        <ng-content select="[page-toolbar]"></ng-content>
      </div>

      <!-- Main Content -->
      <div class="bg-white rounded-lg border border-gray-200">
        <ng-content select="[page-content]"></ng-content>
      </div>

      <!-- Footer with Pagination -->
      <div *ngIf="showFooter" class="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
        <div class="text-sm text-gray-600">
          <ng-content select="[page-footer-info]"></ng-content>
        </div>
        <div class="flex items-center gap-2">
          <ng-content select="[page-pagination]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PageLayoutComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() showActions: boolean = true;
  @Input() showToolbar: boolean = true;
  @Input() showFooter: boolean = false;
}
