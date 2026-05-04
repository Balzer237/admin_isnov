import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <div *ngFor="let i of [1, 2, 3, 4, 5]" class="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  `,
  styles: []
})
export class SkeletonLoaderComponent {
  @Input() count: number = 5;
}
