import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, CardComponent],
  template: `
    <div class="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <!-- Page Header -->
      <app-page-header
        title="Dashboard"
        subtitle="Welcome back! Here's your overview."
      ></app-page-header>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <app-card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Users</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">245</p>
            </div>
            <div class="text-4xl">👥</div>
          </div>
          <div class="mt-4 text-xs text-green-600 font-medium">+12% from last month</div>
        </app-card>

        <app-card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Reports</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">42</p>
            </div>
            <div class="text-4xl">📊</div>
          </div>
          <div class="mt-4 text-xs text-green-600 font-medium">+8% from last month</div>
        </app-card>

        <app-card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Datasources</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">18</p>
            </div>
            <div class="text-4xl">💾</div>
          </div>
          <div class="mt-4 text-xs text-green-600 font-medium">+2 added this week</div>
        </app-card>

        <app-card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">System Health</p>
              <p class="text-3xl font-bold text-green-600 mt-2">99.8%</p>
            </div>
            <div class="text-4xl">✅</div>
          </div>
          <div class="mt-4 text-xs text-gray-600">All systems operational</div>
        </app-card>
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="lg:col-span-2">
          <app-card>
            <h3 class="text-xl font-heading font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div class="space-y-4">
              <div class="flex items-start gap-4 pb-4 border-b border-gray-200">
                <div class="text-2xl">📝</div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">New report created</p>
                  <p class="text-sm text-gray-600 mt-0.5">By John Doe · 2 hours ago</p>
                </div>
              </div>
              <div class="flex items-start gap-4 pb-4 border-b border-gray-200">
                <div class="text-2xl">👤</div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">User added to system</p>
                  <p class="text-sm text-gray-600 mt-0.5">Jane Smith · 5 hours ago</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="text-2xl">🔧</div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">System update completed</p>
                  <p class="text-sm text-gray-600 mt-0.5">System · 1 day ago</p>
                </div>
              </div>
            </div>
          </app-card>
        </div>

        <app-card>
          <h3 class="text-xl font-heading font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div class="space-y-2">
            <a href="/users" class="block p-3 rounded-lg hover:bg-blue-50 text-blue-600 font-medium transition-colors">
              Manage Users →
            </a>
            <a href="/reports" class="block p-3 rounded-lg hover:bg-blue-50 text-blue-600 font-medium transition-colors">
              View Reports →
            </a>
            <a href="/datasources" class="block p-3 rounded-lg hover:bg-blue-50 text-blue-600 font-medium transition-colors">
              Add Datasource →
            </a>
            <a href="/dashboards" class="block p-3 rounded-lg hover:bg-blue-50 text-blue-600 font-medium transition-colors">
              Create Dashboard →
            </a>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {}
