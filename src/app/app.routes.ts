import { Routes } from '@angular/router';
import { UsersComponent } from './feature/users/presentation/users.component';
import { ReportsComponent } from './feature/reports/presentation/reports.component';
import { DatasourceListComponent } from './feature/datasources/presentation/datasource-list.component';
import { SqlViewEditorComponent } from './feature/sql_views/presentation/sql-view-editor.component';
import { canDeactivateSqlViewEditor } from './feature/sql_views/presentation/sql-view-editor.guard';
import { SqlViewListComponent } from './feature/sql_views/presentation/sql-view-list.component';
import { TenantsComponent } from './feature/tenants/presentation/tenants.component';
import { PlaceholderPageComponent } from './shared/components/placeholder-page/placeholder-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tenants'
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'tenants',
    component: TenantsComponent
  },
  {
    path: 'reports',
    component: ReportsComponent
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
    path: 'sql-views/new',
    component: SqlViewEditorComponent,
    canDeactivate: [canDeactivateSqlViewEditor]
  },
  {
    path: 'sql-views/:id',
    component: SqlViewEditorComponent,
    canDeactivate: [canDeactivateSqlViewEditor]
  },
  {
    path: 'roles',
    component: PlaceholderPageComponent,
    data: {
      title: 'Roles',
      subtitle: 'Définissez et structurez les rôles de sécurité.'
    }
  },
  {
    path: 'role-groups',
    component: PlaceholderPageComponent,
    data: {
      title: 'Role Groups',
      subtitle: 'Organisez les groupes de rôles pour les accès avancés.'
    }
  },
  {
    path: 'menus',
    component: PlaceholderPageComponent,
    data: {
      title: 'Menus',
      subtitle: 'Administrez les structures de navigation disponibles.'
    }
  },
  {
    path: 'settings',
    children: [
      {
        path: 'global',
        component: PlaceholderPageComponent,
        data: {
          title: 'Global Settings',
          subtitle: 'Paramètres globaux de l\'application.'
        }
      },
      {
        path: 'tenant',
        component: PlaceholderPageComponent,
        data: {
          title: 'Tenant Settings',
          subtitle: 'Paramètres spécifiques au tenant courant.'
        }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'tenants'
  }
];
