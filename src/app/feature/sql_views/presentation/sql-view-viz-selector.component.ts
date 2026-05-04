import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VizCompatibilityResult, VizType } from '../domain/sql-view.model';

@Component({
  selector: 'app-sql-view-viz-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      @for (viz of sortedViz; track viz.type) {
        <button
          type="button"
          class="rounded-2xl border p-4 text-left transition"
          [disabled]="!viz.compatible"
          [title]="!viz.compatible ? viz.reason || 'Incompatible' : 'Sélectionner'"
          [ngClass]="
            selectedViz?.type === viz.type
              ? 'border-blue-300 bg-blue-50 shadow-sm'
              : viz.compatible
                ? 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
                : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 opacity-70'
          "
          (click)="viz.compatible && vizSelected.emit(viz)"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-2xl">{{ getIcon(viz.type) }}</div>
              <div class="mt-3 font-semibold text-slate-900">{{ getLabel(viz.type) }}</div>
            </div>
            <span
              class="rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide"
              [ngClass]="getConfidenceClass(viz.confidence)"
            >
              {{ viz.confidence }}
            </span>
          </div>
          @if (!viz.compatible && viz.reason) {
            <div class="mt-3 text-xs text-slate-500">{{ viz.reason }}</div>
          }
        </button>
      }
    </div>
  `
})
export class SqlViewVizSelectorComponent {
  @Input() compatibleViz: VizCompatibilityResult[] = [];
  @Input() selectedViz: VizCompatibilityResult | null = null;
  @Output() vizSelected = new EventEmitter<VizCompatibilityResult>();

  get sortedViz(): VizCompatibilityResult[] {
    const weight = { high: 3, medium: 2, low: 1 };
    return [...this.compatibleViz].sort((left, right) => {
      if (left.compatible !== right.compatible) {
        return left.compatible ? -1 : 1;
      }
      return weight[right.confidence] - weight[left.confidence];
    });
  }

  getIcon(type: VizType): string {
    const icons: Record<VizType, string> = {
      [VizType.TABLE]: '▦',
      [VizType.BAR]: '▇',
      [VizType.LINE]: '╱',
      [VizType.AREA]: '▃',
      [VizType.STACKED_BAR]: '▥',
      [VizType.PIE]: '◔',
      [VizType.DONUT]: '◑',
      [VizType.SCATTER]: '⋯',
      [VizType.KPI]: '◉'
    };
    return icons[type];
  }

  getLabel(type: VizType): string {
    return {
      [VizType.TABLE]: 'Table',
      [VizType.BAR]: 'Barres',
      [VizType.LINE]: 'Lignes',
      [VizType.AREA]: 'Aires',
      [VizType.STACKED_BAR]: 'Barres empilées',
      [VizType.PIE]: 'Camembert',
      [VizType.DONUT]: 'Donut',
      [VizType.SCATTER]: 'Nuage',
      [VizType.KPI]: 'KPI'
    }[type];
  }

  getConfidenceClass(confidence: VizCompatibilityResult['confidence']): string {
    return {
      high: 'bg-emerald-100 text-emerald-700',
      medium: 'bg-amber-100 text-amber-700',
      low: 'bg-slate-100 text-slate-600'
    }[confidence];
  }
}
