import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { TenantService } from '../../core/services/tenant.service';
import { UserService } from '../../core/services/user.service';
import { Tenant, User, BreadcrumbItem } from '../../core/models/navigation.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentTenant: Tenant | null = null;
  currentUser: User | null = null;
  breadcrumbs: BreadcrumbItem[] = [];
  searchQuery: string = '';
  showTenantDropdown: boolean = false;
  showUserDropdown: boolean = false;
  showQuickActionsDropdown: boolean = false;
  showNotifications: boolean = false;
  unreadNotifications: number = 3;
  tenants: Tenant[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private tenantService: TenantService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to current tenant
    this.tenantService.currentTenant$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tenant: Tenant) => {
        this.currentTenant = tenant;
      });

    // Subscribe to all tenants
    this.tenantService.tenants$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tenants: Tenant[]) => {
        this.tenants = tenants;
      });

    // Subscribe to current user
    this.userService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User) => {
        this.currentUser = user;
      });

    // Update breadcrumbs on navigation
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateBreadcrumbs();
      });

    this.updateBreadcrumbs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateBreadcrumbs(): void {
    // Generate breadcrumbs from current route
    const urlSegments = this.router.url.split('/').filter(segment => segment);
    this.breadcrumbs = [{ label: 'Home', route: '/datasources' }];

    let route = '';
    for (const segment of urlSegments) {
      route += '/' + segment;
      this.breadcrumbs.push({
        label: this.formatLabel(segment),
        route: route
      });
    }
  }

  private formatLabel(label: string): string {
    return label
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  switchTenant(tenant: Tenant): void {
    this.tenantService.setCurrentTenant(tenant);
    this.showTenantDropdown = false;
  }

  onSearch(): void {
    console.log('Search query:', this.searchQuery);
    // Implement search functionality
  }

  openQuickAction(action: string): void {
    console.log('Quick action:', action);
    this.showQuickActionsDropdown = false;

    const quickActionRoutes: Record<string, string> = {
      user: '/users',
      report: '/reports',
      datasource: '/datasources',
      sqlView: '/sql-views'
    };

    const route = quickActionRoutes[action];
    if (route) {
      this.router.navigate([route]);
    }
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
    this.showUserDropdown = false;
  }

  toggleTenantDropdown(): void {
    this.showTenantDropdown = !this.showTenantDropdown;
    this.showUserDropdown = false;
    this.showQuickActionsDropdown = false;
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
    this.showTenantDropdown = false;
    this.showQuickActionsDropdown = false;
  }

  toggleQuickActionsDropdown(): void {
    this.showQuickActionsDropdown = !this.showQuickActionsDropdown;
    this.showUserDropdown = false;
    this.showTenantDropdown = false;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  closeDropdowns(): void {
    this.showTenantDropdown = false;
    this.showUserDropdown = false;
    this.showQuickActionsDropdown = false;
    this.showNotifications = false;
  }

  getUserFirstName(): string {
    if (!this.currentUser?.name) return 'User';
    return this.currentUser.name.split(' ')[0];
  }
}
