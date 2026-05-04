import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class CardComponent {}
