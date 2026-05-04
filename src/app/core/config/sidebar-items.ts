import { SidebarSection } from '../models/navigation.model';

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: 'Organization',
    section: 'organization',
    items: [
      {
        id: 'tenants',
        label: 'Tenants',
        icon: 'building',
        route: '/tenants',
        section: 'organization'
      },
      {
        id: 'global-settings',
        label: 'Global Settings',
        icon: 'cog',
        route: '/settings/global',
        section: 'organization'
      }
    ]
  },
  {
    title: 'Access & Security',
    section: 'access',
    items: [
      {
        id: 'users',
        label: 'Users',
        icon: 'users',
        route: '/users',
        section: 'access'
      },
      {
        id: 'roles',
        label: 'Roles',
        icon: 'shield',
        route: '/roles',
        section: 'access'
      },
      {
        id: 'role-groups',
        label: 'Role Groups',
        icon: 'userGroup',
        route: '/role-groups',
        section: 'access'
      }
    ]
  },
  {
    title: 'Data',
    section: 'data',
    items: [
      {
        id: 'datasources',
        label: 'Datasources',
        icon: 'database',
        route: '/datasources',
        section: 'data'
      },
      {
        id: 'sql-views',
        label: 'SQL Views',
        icon: 'table',
        route: '/sql-views',
        section: 'data'
      }
    ]
  },
  {
    title: 'Analytics',
    section: 'analytics',
    items: [
      {
        id: 'reports',
        label: 'Reports',
        icon: 'chartBar',
        route: '/reports',
        section: 'analytics'
      },
      {
        id: 'dashboards',
        label: 'Dashboards',
        icon: 'dashboard',
        route: '/dashboards',
        section: 'analytics'
      }
    ]
  },
  {
    title: 'Navigation',
    section: 'navigation',
    items: [
      {
        id: 'menus',
        label: 'Menus',
        icon: 'bars',
        route: '/menus',
        section: 'navigation'
      }
    ]
  },
  {
    title: 'Configuration',
    section: 'configuration',
    items: [
      {
        id: 'tenant-settings',
        label: 'Tenant Settings',
        icon: 'sliders',
        route: '/settings/tenant',
        section: 'configuration'
      }
    ]
  }
];
