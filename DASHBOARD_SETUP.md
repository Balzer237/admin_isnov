# SaaS Admin Dashboard - Angular Implementation

A modern, production-ready SaaS admin dashboard built with Angular and Tailwind CSS, inspired by Stripe and Linear.

## 🎯 Features

- **Fixed Collapsible Sidebar** - Multi-level navigation with smooth collapse/expand transitions
- **Fixed Header** - Breadcrumb navigation, global search, tenant selector, quick actions, notifications, user menu
- **Responsive Layout** - Desktop-first, fully responsive design
- **Reusable Components** - Page header, toolbar, data table, pagination, empty states, skeleton loaders
- **Multi-Tenant Support** - Built-in tenant switching and awareness throughout the interface
- **Light Theme** - Clean, professional design with Tailwind CSS
- **Smooth Animations** - CSS transitions for collapsible elements and hover states

## 📁 Project Structure

```
src/app/
├── core/
│   ├── config/
│   │   └── sidebar-items.ts          # Sidebar navigation configuration
│   ├── models/
│   │   └── navigation.model.ts       # TypeScript interfaces for navigation
│   ├── services/
│   │   ├── sidebar.service.ts        # Sidebar state management
│   │   ├── tenant.service.ts         # Multi-tenant state management
│   │   └── user.service.ts           # Current user state
│   ├── guards/
│   ├── interceptors/
│   └── config/
├── layout/
│   ├── header/
│   │   ├── header.component.ts       # Main header with search, tenant selector, user menu
│   │   ├── header.component.html
│   │   └── header.component.css
│   ├── sidebar/
│   │   ├── sidebar.component.ts      # Collapsible sidebar navigation
│   │   ├── sidebar.component.html
│   │   └── sidebar.component.css
│   ├── layout.component.ts           # Main layout wrapper
│   ├── layout.component.html
│   └── layout.component.css
├── shared/
│   └── components/
│       ├── badge/                    # Status badge component
│       ├── card/                     # Reusable card container
│       ├── data-table/              # Data table with sorting/filtering
│       ├── empty-state/             # Empty state UI
│       ├── page-content/            # Content wrapper
│       ├── page-header/             # Page title and actions
│       ├── page-layout/             # Main page layout wrapper
│       ├── page-toolbar/            # Search, filters, tabs
│       ├── pagination/              # Pagination controls
│       └── skeleton-loader/         # Loading skeleton
├── feature/
│   ├── dashboards/
│   │   ├── presentation/
│   │   │   └── dashboard.component.ts
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   ├── users/
│   │   ├── presentation/
│   │   │   └── users.component.ts   # Users list example
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   └── [other features]...
├── app.ts                            # Root component
├── app.routes.ts                    # Application routes
└── app.html                         # Root template
```

## 🚀 Quick Start

### Installation

```bash
npm install
ng serve
```

Navigate to `http://localhost:4200/`

### Basic Usage

#### 1. Using the Layout

The `LayoutComponent` wraps your entire application:

```typescript
// app.html
<app-layout>
  <router-outlet></router-outlet>
</app-layout>
```

#### 2. Creating a Feature Page

```typescript
import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageToolbarComponent } from '../../../shared/components/page-toolbar/page-toolbar.component';
import { PageAction } from '../../../core/models/navigation.model';

@Component({
  selector: 'app-example-page',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    PageToolbarComponent,
    // Other components
  ],
  template: `
    <div class="p-8 bg-gray-50 min-h-screen">
      <app-page-header
        title="Example Page"
        subtitle="Description of the page"
        [actions]="actions"
      ></app-page-header>

      <app-page-toolbar
        searchPlaceholder="Search items..."
        [filters]="filters"
        [tabs]="tabs"
        (searchChange)="onSearch($event)"
      ></app-page-toolbar>

      <!-- Your content here -->
    </div>
  `
})
export class ExamplePageComponent {
  actions: PageAction[] = [
    {
      label: 'Add Item',
      icon: '➕',
      action: () => console.log('Add'),
      variant: 'primary'
    }
  ];

  filters = [
    { id: 'status', label: 'Status', value: '', options: ['Active', 'Inactive'] }
  ];

  tabs = [
    { id: 'all', label: 'All', count: 100, active: true },
    { id: 'active', label: 'Active', count: 80, active: false }
  ];

  onSearch(query: string): void {
    console.log('Search:', query);
  }
}
```

## 📦 Core Components

### PageHeaderComponent
Displays page title, subtitle, and action buttons.

```html
<app-page-header
  title="Users"
  subtitle="Manage user accounts"
  [actions]="headerActions"
></app-page-header>
```

### PageToolbarComponent
Provides search, filters, and tabs.

```html
<app-page-toolbar
  searchPlaceholder="Search..."
  [filters]="filters"
  [tabs]="tabs"
  (searchChange)="onSearch($event)"
  (filterChange)="onFilterChange($event)"
  (tabChange)="onTabChange($event)"
></app-page-toolbar>
```

### DataTableComponent
Renders tabular data with sorting and actions.

```typescript
@Input() columns: { key: string; label: string; type: 'text' | 'badge' | 'actions' }[] = [];
@Input() rows: any[] = [];
```

### PaginationComponent
Handles pagination controls.

```html
<app-pagination
  [currentPage]="currentPage"
  [pageSize]="pageSize"
  [totalItems]="totalItems"
></app-pagination>
```

### CardComponent
Reusable card container.

```html
<app-card>
  <h3 class="text-lg font-semibold">Card Content</h3>
</app-card>
```

### BadgeComponent
Status badges with variants.

```html
<app-badge label="Active" variant="success"></app-badge>
```

### EmptyStateComponent
Displays empty state UI.

```html
<app-empty-state
  icon="📭"
  title="No data found"
  description="Create your first item"
  actionLabel="Create"
></app-empty-state>
```

### SkeletonLoaderComponent
Loading skeleton UI.

```html
<app-skeleton-loader [count]="5"></app-skeleton-loader>
```

## 🎨 Tailwind CSS Configuration

The dashboard uses Tailwind CSS with a light theme:

- **Background**: `#f8fafc` (soft gray)
- **Cards**: White with subtle shadows
- **Primary Color**: Blue (#3b82f6)
- **Typography**: Gray scale hierarchy
- **Spacing**: 8px grid-based

## 🧭 Navigation & Routing

The sidebar navigation is automatically generated from the `SIDEBAR_SECTIONS` configuration in `core/config/sidebar-items.ts`:

```typescript
export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: 'Organization',
    section: 'organization',
    items: [
      {
        id: 'tenants',
        label: 'Tenants',
        icon: 'heroicons/outline/building-office-2',
        route: '/tenants',
        section: 'organization'
      },
      // ...
    ]
  },
  // ...
];
```

To add a new navigation item, simply add it to the corresponding section in this configuration.

## 📱 Responsive Behavior

The dashboard is desktop-first and fully responsive:

- **Mobile**: Sidebar collapses on small screens
- **Tablet**: Single column layout for content
- **Desktop**: Full sidebar + content view

## 🔐 Multi-Tenant Support

The dashboard includes built-in multi-tenant support:

```typescript
// TenantService
constructor(private tenantService: TenantService) {}

ngOnInit() {
  this.tenantService.currentTenant$.subscribe(tenant => {
    // Tenant changed
  });
}

switchTenant(tenant: Tenant): void {
  this.tenantService.setCurrentTenant(tenant);
}
```

## 🎯 Key Features Implementation

### 1. Collapsible Sidebar
- Managed by `SidebarService`
- State persisted in localStorage
- Smooth CSS transitions
- Icon-only mode when collapsed

### 2. Global Search
- Located in header center
- Accessible from any page
- Real-time search capability

### 3. Tenant Selector
- Dropdown in header right
- Multi-tenant support
- Quick tenant switching
- Current tenant always visible

### 4. Quick Actions
- "Create" dropdown button
- Contextual actions
- Consistent UI

### 5. Notifications
- Badge with unread count
- Notification panel
- Dismissable notifications

### 6. User Avatar
- Profile dropdown
- User details
- Settings link
- Logout action

## 🛠️ Services

### SidebarService
Manages sidebar state (collapsed/expanded, item expansion).

```typescript
this.sidebarService.toggleCollapse();
this.sidebarService.toggleItem(itemId);
this.sidebarService.isCollapsed$.subscribe(collapsed => { ... });
```

### TenantService
Manages current tenant and available tenants.

```typescript
this.tenantService.setCurrentTenant(tenant);
this.tenantService.getCurrentTenant();
this.tenantService.currentTenant$.subscribe(tenant => { ... });
```

### UserService
Manages current user information.

```typescript
this.userService.getCurrentUser();
this.userService.currentUser$.subscribe(user => { ... });
```

## 📝 Adding a New Feature Page

1. Create feature folder structure:
```
feature/my-feature/
├── presentation/
│   └── my-feature.component.ts
├── domain/
├── application/
└── infrastructure/
```

2. Create component:
```typescript
@Component({
  selector: 'app-my-feature',
  standalone: true,
  imports: [/* ... */],
  template: `...`
})
export class MyFeatureComponent {}
```

3. Add route in `app.routes.ts`:
```typescript
{
  path: 'my-feature',
  component: MyFeatureComponent
}
```

4. Add navigation item in `sidebar-items.ts`

## 🎨 Theme Customization

To customize colors, modify the Tailwind CSS classes in components or create custom CSS variables.

### Light Mode Colors
- Primary Blue: `#3b82f6`
- Soft Gray: `#f8fafc`
- Text Dark: `#111827`
- Border Gray: `#e5e7eb`

## 🚀 Performance Tips

1. Use `OnPush` change detection where possible
2. Lazy load feature modules
3. Implement virtual scrolling for large lists
4. Use skeleton loaders for async data
5. Memoize expensive computations

## 📚 Additional Resources

- [Angular Documentation](https://angular.io)
- [Tailwind CSS](https://tailwindcss.com)
- [RxJS Documentation](https://rxjs.dev)

## 📄 License

This dashboard template is provided as-is for development purposes.

## 💡 Next Steps

1. Implement real data loading in services
2. Add authentication/authorization
3. Create additional feature pages
4. Implement API integration
5. Add dark mode support
6. Set up CI/CD pipeline
