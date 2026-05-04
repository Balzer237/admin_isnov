import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageToolbarComponent } from '../../../shared/components/page-toolbar/page-toolbar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { PageAction } from '../../../core/models/navigation.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    PageToolbarComponent,
    PaginationComponent,
    EmptyStateComponent,
    BadgeComponent
  ],
  template: `
    <div class="p-8 bg-gray-50 min-h-screen">
      <!-- Page Header -->
      <app-page-header
        title="Users"
        subtitle="Manage user accounts and permissions"
        [actions]="headerActions"
      ></app-page-header>

      <!-- Toolbar -->
      <app-page-toolbar
        searchPlaceholder="Search users..."
        [filters]="filters"
        [tabs]="tabs"
        (searchChange)="onSearch($event)"
        (filterChange)="onFilterChange($event)"
        (tabChange)="onTabChange($event)"
      ></app-page-toolbar>

      <!-- Content -->
      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <ng-container *ngIf="users.length > 0">
          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Joined
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr *ngFor="let user of users" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ user.name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ user.role }}</td>
                  <td class="px-6 py-4 text-sm">
                    <app-badge [label]="user.status" [variant]="user.status === 'Active' ? 'success' : 'danger'"></app-badge>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ user.joined }}</td>
                  <td class="px-6 py-4 text-sm">
                    <div class="flex items-center gap-2">
                      <button class="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                      <button class="text-red-600 hover:text-red-900 font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <app-pagination
            [currentPage]="currentPage"
            [pageSize]="pageSize"
            [totalItems]="totalUsers"
          ></app-pagination>
        </ng-container>

        <!-- Empty State -->
        <ng-container *ngIf="users.length === 0">
          <app-empty-state
            icon="👥"
            title="No users found"
            description="Get started by creating your first user account"
            actionLabel="Create User"
          ></app-empty-state>
        </ng-container>
      </div>
    </div>
  `,
  styles: []
})
export class UsersComponent {
  currentPage: number = 1;
  pageSize: number = 10;
  totalUsers: number = 45;

  users = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@company.com',
      role: 'Admin',
      status: 'Active',
      joined: '2024-01-15'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@company.com',
      role: 'Editor',
      status: 'Active',
      joined: '2024-02-20'
    },
    {
      id: '3',
      name: 'Carol White',
      email: 'carol.white@company.com',
      role: 'Viewer',
      status: 'Active',
      joined: '2024-03-10'
    },
    {
      id: '4',
      name: 'David Brown',
      email: 'david.brown@company.com',
      role: 'Editor',
      status: 'Inactive',
      joined: '2024-01-25'
    },
    {
      id: '5',
      name: 'Emma Davis',
      email: 'emma.davis@company.com',
      role: 'Admin',
      status: 'Active',
      joined: '2024-04-05'
    }
  ];

  headerActions: PageAction[] = [
    {
      label: '+ Add User',
      icon: '👤',
      action: () => console.log('Add user'),
      variant: 'primary'
    },
    {
      label: 'Export',
      icon: '📥',
      action: () => console.log('Export users'),
      variant: 'secondary'
    }
  ];

  filters = [
    {
      id: 'role',
      label: 'Role',
      value: '',
      options: ['Admin', 'Editor', 'Viewer']
    },
    {
      id: 'status',
      label: 'Status',
      value: '',
      options: ['Active', 'Inactive']
    }
  ];

  tabs = [
    { id: 'all', label: 'All Users', count: 45, active: true },
    { id: 'active', label: 'Active', count: 38, active: false },
    { id: 'inactive', label: 'Inactive', count: 7, active: false }
  ];

  onSearch(query: string): void {
    console.log('Search:', query);
  }

  onFilterChange(event: { filterId: string; value: string }): void {
    console.log('Filter changed:', event);
  }

  onTabChange(tabId: string): void {
    console.log('Tab changed:', tabId);
  }
}
