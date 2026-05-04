import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faBars,
  faBuilding,
  faChartBar,
  faChevronDown,
  faChevronRight,
  faCog,
  faDatabase,
  faGaugeHigh,
  faShieldAlt,
  faSliders,
  faTable,
  faUserGroup,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { SidebarItem } from '../../core/models/navigation.model';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FontAwesomeModule],
  template: `
    <div>
      <!-- Simple navigation link (no children) -->
      <a
        *ngIf="!item.children || item.children.length === 0"
        [routerLink]="item.route"
        routerLinkActive="active-nav-item"
        [routerLinkActiveOptions]="{ exact: false }"
        class="nav-item group"
        [title]="isCollapsed ? item.label : ''"
        [class.collapsed]="isCollapsed"
      >
        <fa-icon [icon]="icon" class="nav-icon"></fa-icon>
        <span *ngIf="!isCollapsed" class="nav-text">{{ item.label }}</span>
      </a>

      <!-- Navigation with children (expandable) -->
      <div *ngIf="item.children && item.children.length > 0">
        <button
          type="button"
          (click)="toggle.emit(item.id)"
          class="w-full nav-item group"
          [ngClass]="{
            'active-nav-item': expanded
          }"
          [title]="isCollapsed ? item.label : ''"
          [class.collapsed]="isCollapsed"
        >
          <fa-icon [icon]="icon" class="nav-icon"></fa-icon>
          <span *ngIf="!isCollapsed" class="nav-text flex-1 text-left">{{ item.label }}</span>
          <fa-icon
            *ngIf="!isCollapsed"
            [icon]="toggleIcon"
            class="nav-chevron"
            [class.expanded]="expanded"
          ></fa-icon>
        </button>

        <!-- Children submenu -->
        <div
          *ngIf="!isCollapsed"
          [@expandCollapse]="expanded ? 'expanded' : 'collapsed'"
          class="expanded-items"
          [class.open]="expanded"
        >
          <a
            *ngFor="let child of item.children"
            [routerLink]="child.route"
            routerLinkActive="active-sub-item"
            [routerLinkActiveOptions]="{ exact: false }"
            class="nav-item group text-sm"
            [class.active-sub-item]="isActive(child.route)"
          >
            {{ child.label }}
          </a>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', opacity: 0, transform: 'scaleY(0.95)' })),
      state('expanded', style({ height: '*', opacity: 1, transform: 'scaleY(1)' })),
      transition('collapsed <=> expanded', animate('180ms ease-in-out'))
    ])
  ]
})
export class NavItemComponent implements OnChanges {
  @Input() item!: SidebarItem;
  @Input() isCollapsed = false;
  @Input() expanded = false;
  @Output() toggle = new EventEmitter<string>();

  faChevronDown = faChevronDown;
  faChevronRight = faChevronRight;

  icon: IconDefinition = faBars;

  private readonly iconMap: Record<string, IconDefinition> = {
    building: faBuilding,
    cog: faCog,
    users: faUsers,
    shield: faShieldAlt,
    userGroup: faUserGroup,
    database: faDatabase,
    table: faTable,
    chartBar: faChartBar,
    dashboard: faGaugeHigh,
    bars: faBars,
    sliders: faSliders
  };

  get toggleIcon(): IconDefinition {
    return this.expanded ? this.faChevronDown : this.faChevronRight;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.item) {
      this.icon = this.iconMap[this.item.icon] || faBars;
    }
  }

   isActive(route: string | undefined): boolean {
     if (!route) return false;
     return false; // Router will handle this via routerLinkActive
   }
 }
