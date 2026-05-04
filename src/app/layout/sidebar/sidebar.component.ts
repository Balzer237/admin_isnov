import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidebarService } from '../../core/services/sidebar.service';
import { SIDEBAR_SECTIONS } from '../../core/config/sidebar-items';
import { SidebarSection } from '../../core/models/navigation.model';
import { NavItemComponent } from './nav-item.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NavItemComponent, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('sidebarWidth', [
      state('expanded', style({ width: '16rem' })),
      state('collapsed', style({ width: '5rem' })),
      transition('expanded <=> collapsed', animate('240ms ease-in-out'))
    ])
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {
  sections: SidebarSection[] = SIDEBAR_SECTIONS;
  isCollapsed = false;
  expandedItems = new Set<string>();
  isMobile = false;
  faBars = faBars;
  faOpen = faChevronLeft;
  faClose = faChevronRight;
  private destroy$ = new Subject<void>();

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarService.isCollapsed$
      .pipe(takeUntil(this.destroy$))
      .subscribe((collapsed: boolean) => {
        this.isCollapsed = collapsed;
      });

    this.sidebarService.expandedItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items: Set<string>) => {
        this.expandedItems = items;
      });

    this.isCollapsed = this.sidebarService.getCollapsedState();
    this.checkMobile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkMobile();
  }

  private checkMobile(): void {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 768;
    }
  }

  toggleCollapse(): void {
    this.sidebarService.toggleCollapse();
  }

  toggleItem(itemId: string): void {
    this.sidebarService.toggleItem(itemId);
  }

   isItemExpanded(itemId: string): boolean {
     return this.expandedItems.has(itemId);
   }
 }
