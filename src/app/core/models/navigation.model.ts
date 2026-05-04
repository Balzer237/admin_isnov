export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: SidebarItem[];
  section: 'organization' | 'access' | 'data' | 'analytics' | 'navigation' | 'configuration';
  isActive: boolean;
}

export interface SidebarSection {
  title: string;
  section: string;
  items: SidebarItem[];
}

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Tenant {
  id: string;
  name: string;
  logo?: string;
}

export interface PageHeader {
  title: string;
  subtitle?: string;
  actions?: PageAction[];
}

export interface PageAction {
  label: string;
  icon?: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}
