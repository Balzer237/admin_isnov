import { Routes } from '@angular/router';
import { DashboardComponent } from './feature/dashboards/presentation/dashboard.component';
import { UsersComponent } from './feature/users/presentation/users.component';
import { ReportsComponent } from './feature/reports/presentation/reports.component';
import { DatasourceListComponent } from './feature/datasources/presentation/datasource-list.component';
import { SqlViewListComponent } from './feature/sql_views/presentation/sql-view-list.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'tenants',
    component: DashboardComponent // Placeholder
  },
  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: 'dashboards',
    component: DashboardComponent // Placeholder
  },
  {
    path: 'datasources',
    component: DatasourceListComponent
  },
  {
    path: 'sql-views',
    component: SqlViewListComponent
  },
  {
    path: 'roles',
    component: DashboardComponent // Placeholder
  },
  {
    path: 'role-groups',
    component: DashboardComponent // Placeholder
  },
  {
    path: 'menus',
    component: DashboardComponent // Placeholder
  },
  {
    path: 'settings',
    children: [
      {
        path: 'global',
        component: DashboardComponent // Placeholder
      },
      {
        path: 'tenant',
        component: DashboardComponent // Placeholder
      }
    ]
  }
];
