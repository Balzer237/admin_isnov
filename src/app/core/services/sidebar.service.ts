import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isCollapsedSubject = new BehaviorSubject<boolean>(false);
  isCollapsed$: Observable<boolean> = this.isCollapsedSubject.asObservable();

  private expandedItemsSubject = new BehaviorSubject<Set<string>>(new Set());
  expandedItems$: Observable<Set<string>> = this.expandedItemsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    // Load from localStorage if available
    const saved = this.isBrowser() ? localStorage.getItem('sidebar-collapsed') : null;
    if (saved !== null) {
      this.isCollapsedSubject.next(JSON.parse(saved));
    }
  }

  toggleCollapse(): void {
    const newState = !this.isCollapsedSubject.value;
    this.isCollapsedSubject.next(newState);
    if (this.isBrowser()) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
    }
  }

  setCollapsed(collapsed: boolean): void {
    this.isCollapsedSubject.next(collapsed);
    if (this.isBrowser()) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
    }
  }

  toggleItem(itemId: string): void {
    const current = new Set(this.expandedItemsSubject.value);
    if (current.has(itemId)) {
      current.delete(itemId);
    } else {
      current.add(itemId);
    }
    this.expandedItemsSubject.next(current);
  }

  isItemExpanded(itemId: string): boolean {
    return this.expandedItemsSubject.value.has(itemId);
  }

  getCollapsedState(): boolean {
    return this.isCollapsedSubject.value;
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
