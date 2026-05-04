# SaaS Admin Dashboard - Component Usage Guide

This guide provides examples and best practices for using the dashboard components.

## 📋 Table of Contents
- [Page Header](#page-header)
- [Page Toolbar](#page-toolbar)
- [Data Table](#data-table)
- [Pagination](#pagination)
- [Cards](#cards)
- [Badges](#badges)
- [Empty States](#empty-states)
- [Skeleton Loaders](#skeleton-loaders)
- [Common Patterns](#common-patterns)

## Page Header

The `PageHeaderComponent` displays a page title, subtitle, and action buttons.

### Basic Usage
```typescript
import { PageHeaderComponent } from '@shared/components';

@Component({
  imports: [PageHeaderComponent, CommonModule],
  template: `
    <app-page-header
      title="Users"
      subtitle="Manage your users"
      [actions]="actions"
    ></app-page-header>
  `
})
export class UsersComponent {
  actions = [
    {
      label: 'Add User',
      icon: '👤',
      action: () => this.createUser(),
      variant: 'primary'
    },
    {
      label: 'Export',
      icon: '📥',
      action: () => this.exportUsers(),
      variant: 'secondary'
    }
  ];

  createUser() { /* ... */ }
  exportUsers() { /* ... */ }
}
```

### Variants
- `'primary'` - Blue button (default)
- `'secondary'` - Gray button
- `'danger'` - Red button

## Page Toolbar

The `PageToolbarComponent` provides search, filters, and tabs.

### Basic Usage
```typescript
import { PageToolbarComponent } from '@shared/components';

@Component({
  imports: [PageToolbarComponent, CommonModule],
  template: `
    <app-page-toolbar
      searchPlaceholder="Search users..."
      [filters]="filters"
      [tabs]="tabs"
      (searchChange)="onSearch($event)"
      (filterChange)="onFilterChange($event)"
      (tabChange)="onTabChange($event)"
    ></app-page-toolbar>
  `
})
export class UsersComponent {
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
    { id: 'all', label: 'All Users', count: 100, active: true },
    { id: 'active', label: 'Active', count: 80, active: false },
    { id: 'inactive', label: 'Inactive', count: 20, active: false }
  ];

  onSearch(query: string) {
    console.log('Search:', query);
    // Load filtered data
  }

  onFilterChange(event: { filterId: string; value: string }) {
    console.log('Filter changed:', event.filterId, event.value);
    // Update filter state and reload data
  }

  onTabChange(tabId: string) {
    console.log('Tab changed:', tabId);
    // Load data for the selected tab
  }
}
```

## Data Table

The `DataTableComponent` renders tabular data with support for different column types.

### Basic Usage
```typescript
import { DataTableComponent } from '@shared/components';

@Component({
  imports: [DataTableComponent, CommonModule],
  template: `
    <app-data-table [columns]="columns" [rows]="users"></app-data-table>
  `
})
export class UsersComponent {
  columns = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'role', label: 'Role', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge' },
    { 
      key: 'actions', 
      label: 'Actions', 
      type: 'actions',
      actions: [
        { label: 'Edit', callback: (row) => this.editUser(row) },
        { label: 'Delete', callback: (row) => this.deleteUser(row) }
      ]
    }
  ];

  users = [
    { name: 'Alice', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { name: 'Bob', email: 'bob@example.com', role: 'Editor', status: 'Active' }
  ];

  editUser(user: any) { /* ... */ }
  deleteUser(user: any) { /* ... */ }
}
```

## Pagination

The `PaginationComponent` handles pagination controls.

### Basic Usage
```typescript
import { PaginationComponent } from '@shared/components';

@Component({
  imports: [PaginationComponent],
  template: `
    <app-pagination
      [currentPage]="currentPage"
      [pageSize]="pageSize"
      [totalItems]="totalItems"
    ></app-pagination>
  `
})
export class UsersComponent {
  currentPage = 1;
  pageSize = 10;
  totalItems = 245;
}
```

## Cards

The `CardComponent` is a reusable container for content.

### Basic Usage
```typescript
import { CardComponent } from '@shared/components';

@Component({
  imports: [CardComponent, CommonModule],
  template: `
    <app-card>
      <h3 class="text-lg font-semibold mb-4">Card Title</h3>
      <p>Card content goes here</p>
    </app-card>
  `
})
export class ExampleComponent {}
```

### Multiple Cards in Grid
```typescript
@Component({
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <app-card *ngFor="let item of items">
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </app-card>
    </div>
  `
})
export class ExampleComponent {
  items = [
    { title: 'Item 1', description: 'Description 1' },
    { title: 'Item 2', description: 'Description 2' },
    { title: 'Item 3', description: 'Description 3' }
  ];
}
```

## Badges

The `BadgeComponent` displays status badges with different variants.

### Basic Usage
```typescript
import { BadgeComponent } from '@shared/components';

@Component({
  imports: [BadgeComponent],
  template: `
    <app-badge label="Active" variant="success"></app-badge>
    <app-badge label="Pending" variant="warning"></app-badge>
    <app-badge label="Inactive" variant="danger"></app-badge>
  `
})
export class ExampleComponent {}
```

### Variants
- `'default'` - Blue badge
- `'success'` - Green badge
- `'warning'` - Yellow badge
- `'danger'` - Red badge
- `'info'` - Gray badge

## Empty States

The `EmptyStateComponent` displays an empty state UI.

### Basic Usage
```typescript
import { EmptyStateComponent } from '@shared/components';

@Component({
  imports: [EmptyStateComponent],
  template: `
    <app-empty-state
      icon="📭"
      title="No users found"
      description="Get started by creating your first user account"
      actionLabel="Create User"
    ></app-empty-state>
  `
})
export class UsersComponent {}
```

## Skeleton Loaders

The `SkeletonLoaderComponent` shows a loading skeleton.

### Basic Usage
```typescript
import { SkeletonLoaderComponent } from '@shared/components';

@Component({
  imports: [SkeletonLoaderComponent],
  template: `
    <app-skeleton-loader [count]="5"></app-skeleton-loader>
  `
})
export class ExampleComponent {}
```

## Common Patterns

### List Page with Search, Filters, and Pagination

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  PageHeaderComponent,
  PageToolbarComponent,
  DataTableComponent,
  PaginationComponent,
  EmptyStateComponent,
  SkeletonLoaderComponent
} from '@shared/components';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    PageToolbarComponent,
    DataTableComponent,
    PaginationComponent,
    EmptyStateComponent,
    SkeletonLoaderComponent
  ],
  template: `
    <div class="p-8 bg-gray-50 min-h-screen">
      <!-- Page Header -->
      <app-page-header
        title="Users"
        subtitle="Manage user accounts"
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
      <div class="bg-white rounded-lg border border-gray-200">
        <!-- Loading State -->
        <ng-container *ngIf="loading">
          <app-skeleton-loader [count]="5"></app-skeleton-loader>
        </ng-container>

        <!-- Data Table -->
        <ng-container *ngIf="!loading && users.length > 0">
          <app-data-table [columns]="columns" [rows]="users"></app-data-table>
          <app-pagination
            [currentPage]="currentPage"
            [pageSize]="pageSize"
            [totalItems]="totalUsers"
          ></app-pagination>
        </ng-container>

        <!-- Empty State -->
        <ng-container *ngIf="!loading && users.length === 0">
          <app-empty-state
            icon="👥"
            title="No users found"
            description="Create your first user account"
            actionLabel="Create User"
          ></app-empty-state>
        </ng-container>
      </div>
    </div>
  `
})
export class UsersComponent implements OnInit {
  loading = false;
  currentPage = 1;
  pageSize = 10;
  totalUsers = 0;
  users: any[] = [];

  headerActions = [
    {
      label: 'Add User',
      icon: '➕',
      action: () => this.createUser(),
      variant: 'primary'
    }
  ];

  filters = [
    { id: 'role', label: 'Role', value: '', options: ['Admin', 'Editor', 'Viewer'] },
    { id: 'status', label: 'Status', value: '', options: ['Active', 'Inactive'] }
  ];

  tabs = [
    { id: 'all', label: 'All', count: 100, active: true },
    { id: 'active', label: 'Active', count: 80, active: false }
  ];

  columns = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'role', label: 'Role', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge' }
  ];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.users = [
        { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Bob', email: 'bob@example.com', role: 'Editor', status: 'Active' }
      ];
      this.totalUsers = 2;
      this.loading = false;
    }, 1000);
  }

  onSearch(query: string) {
    this.currentPage = 1;
    this.loadUsers();
  }

  onFilterChange(event: { filterId: string; value: string }) {
    this.currentPage = 1;
    this.loadUsers();
  }

  onTabChange(tabId: string) {
    this.currentPage = 1;
    this.loadUsers();
  }

  createUser() {
    // Open create user dialog/modal
  }
}
```

### Dashboard Page with Stats

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent, CardComponent } from '@shared/components';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, CardComponent],
  template: `
    <div class="p-8 bg-gray-50 min-h-screen">
      <app-page-header title="Dashboard" subtitle="Overview"></app-page-header>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-card *ngFor="let stat of stats">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stat.value }}</p>
            </div>
            <div class="text-4xl">{{ stat.icon }}</div>
          </div>
          <div class="mt-4 text-xs" [class]="stat.trend > 0 ? 'text-green-600' : 'text-red-600'">
            {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}% from last month
          </div>
        </app-card>
      </div>
    </div>
  `
})
export class DashboardComponent {
  stats = [
    { label: 'Total Users', value: '245', icon: '👥', trend: 12 },
    { label: 'Active Reports', value: '42', icon: '📊', trend: 8 },
    { label: 'Datasources', value: '18', icon: '💾', trend: 2 },
    { label: 'System Health', value: '99.8%', icon: '✅', trend: 0 }
  ];
}
```

## Tips & Best Practices

1. **Always use loading states** - Show skeleton loaders while fetching data
2. **Handle empty states** - Provide clear guidance when no data is available
3. **Use consistent spacing** - Follow the 8px grid system
4. **Group related actions** - Place contextual actions near relevant elements
5. **Provide feedback** - Show success/error messages after user actions
6. **Keep tables readable** - Use pagination for large datasets
7. **Use proper icons** - Use emoji or Heroicons for visual clarity
8. **Test responsiveness** - Ensure components work on all screen sizes
9. **Optimize performance** - Use change detection OnPush when possible
10. **Document complex pages** - Add comments explaining the data flow
