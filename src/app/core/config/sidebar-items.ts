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
        section: 'organization',
        isActive: false
      },
      {
        id: 'global-settings',
        label: 'Global Settings',
        icon: 'cog',
        route: '/settings/global',
        section: 'organization',
        isActive: false
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
        section: 'access',
        isActive: false
      },
      {
        id: 'roles',
        label: 'Roles',
        icon: 'shield',
        route: '/roles',
        section: 'access',
        isActive: false
      },
      {
        id: 'role-groups',
        label: 'Role Groups',
        icon: 'userGroup',
        route: '/role-groups',
        section: 'access',
        isActive: false
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
        section: 'data',
        isActive: true
      },
      {
        id: 'sql-views',
        label: 'SQL Views',
        icon: 'table',
        route: '/sql-views',
        section: 'data',
        isActive: true
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
        section: 'analytics',
        isActive: false
      }
      // Dashboards removed as per requirement
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
        section: 'navigation',
        isActive: false
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
        section: 'configuration',
        isActive: false
      }
    ]
  }
];
