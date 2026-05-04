import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tenant } from '../models/navigation.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private currentTenantSubject = new BehaviorSubject<Tenant>({
    id: '1',
    name: 'Acme Corporation',
    logo: 'https://via.placeholder.com/32x32?text=AC'
  });

  currentTenant$: Observable<Tenant> = this.currentTenantSubject.asObservable();

  private tenantsSubject = new BehaviorSubject<Tenant[]>([
    {
      id: '1',
      name: 'Acme Corporation',
      logo: 'https://via.placeholder.com/32x32?text=AC'
    },
    {
      id: '2',
      name: 'Tech Innovations Ltd',
      logo: 'https://via.placeholder.com/32x32?text=TI'
    },
    {
      id: '3',
      name: 'Global Services Inc',
      logo: 'https://via.placeholder.com/32x32?text=GS'
    }
  ]);

  tenants$: Observable<Tenant[]> = this.tenantsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    // Load from localStorage if available
    const saved = this.isBrowser() ? localStorage.getItem('current-tenant') : null;
    if (saved) {
      this.currentTenantSubject.next(JSON.parse(saved));
    }
  }

  getCurrentTenant(): Tenant {
    return this.currentTenantSubject.value;
  }

  setCurrentTenant(tenant: Tenant): void {
    this.currentTenantSubject.next(tenant);
    if (this.isBrowser()) {
      localStorage.setItem('current-tenant', JSON.stringify(tenant));
    }
  }

  getTenants(): Tenant[] {
    return this.tenantsSubject.value;
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
