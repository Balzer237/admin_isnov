import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { PageAction } from '../../../core/models/navigation.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, CardComponent],
  template: `
    <div class="p-8 bg-gray-50 min-h-screen">
      <app-page-header
        title="Reports"
        subtitle="View and manage analytics reports"
        [actions]="headerActions"
      ></app-page-header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">User Activity</h3>
            <span class="text-2xl">📊</span>
          </div>
          <div class="h-48 bg-gray-100 rounded flex items-center justify-center">
            <p class="text-gray-600">Chart placeholder</p>
          </div>
        </app-card>

        <app-card>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Performance</h3>
            <span class="text-2xl">📈</span>
          </div>
          <div class="h-48 bg-gray-100 rounded flex items-center justify-center">
            <p class="text-gray-600">Chart placeholder</p>
          </div>
        </app-card>

        <app-card>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Data Usage</h3>
            <span class="text-2xl">💾</span>
          </div>
          <div class="h-48 bg-gray-100 rounded flex items-center justify-center">
            <p class="text-gray-600">Chart placeholder</p>
          </div>
        </app-card>

        <app-card>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">System Health</h3>
            <span class="text-2xl">🏥</span>
          </div>
          <div class="h-48 bg-gray-100 rounded flex items-center justify-center">
            <p class="text-gray-600">Chart placeholder</p>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: []
})
export class ReportsComponent {
  headerActions: PageAction[] = [
    {
      label: '+ New Report',
      icon: '➕',
      action: () => console.log('Create report'),
      variant: 'primary'
    },
    {
      label: 'Export',
      icon: '📥',
      action: () => console.log('Export'),
      variant: 'secondary'
    }
  ];
}
