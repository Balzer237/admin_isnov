import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BarChartComponent } from '../../../feature/sql_views/presentation/bar-chart.component';
import { LineChartComponent } from '../../../feature/sql_views/presentation/line-chart.component';
import { PieChartComponent } from '../../../feature/sql_views/presentation/pie-chart.component';
import { ScatterPlotComponent } from '../../../feature/sql_views/presentation/scatter-plot.component';
import { QueryResult, VizConfig, VizType } from '../../../feature/sql_views/domain/sql-view.model';

@Component({
  selector: 'app-sql-view-chart-renderer',
  standalone: true,
  imports: [CommonModule, BarChartComponent, LineChartComponent, PieChartComponent, ScatterPlotComponent],
  template: `
    @if (queryResult && vizConfig) {
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        @switch (vizConfig.type) {
          @case (vizType.TABLE) {
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="border-b border-slate-200 text-left text-slate-500">
                    @for (column of queryResult.columns; track column.name) {
                      <th class="px-3 py-2 font-semibold">{{ column.name }}</th>
                    }
                  </tr>
                </thead>
                <tbody>
                  @for (row of queryResult.rows; track $index) {
                    <tr class="border-b border-slate-100">
                      @for (column of queryResult.columns; track column.name) {
                        <td class="px-3 py-2 text-slate-700">{{ row[column.name] }}</td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
          @case (vizType.KPI) {
            <div class="rounded-2xl bg-slate-950 p-8 text-white">
              <div class="text-sm uppercase tracking-[0.16em] text-slate-400">
                {{ vizConfig.title || vizConfig.mapping.label || 'Indicateur' }}
              </div>
              <div class="mt-4 text-5xl font-semibold">
                {{ queryResult.rows[0]?.[vizConfig.mapping.value || 'value'] ?? '—' }}
              </div>
            </div>
          }
          @case (vizType.PIE) {
            <app-pie-chart [data]="queryResult.rows" [config]="pieConfig"></app-pie-chart>
          }
          @case (vizType.DONUT) {
            <app-pie-chart [data]="queryResult.rows" [config]="pieConfig"></app-pie-chart>
          }
          @case (vizType.SCATTER) {
            <app-scatter-plot [data]="queryResult.rows" [config]="scatterConfig"></app-scatter-plot>
          }
          @case (vizType.LINE) {
            <app-line-chart [data]="queryResult.rows" [config]="cartesianConfig"></app-line-chart>
          }
          @case (vizType.AREA) {
            <app-line-chart [data]="queryResult.rows" [config]="cartesianConfig"></app-line-chart>
          }
          @default {
            <app-bar-chart [data]="queryResult.rows" [config]="cartesianConfig"></app-bar-chart>
          }
        }
      </div>
    }
  `
})
export class SqlViewChartRendererComponent {
  @Input() queryResult: QueryResult | null = null;
  @Input() vizConfig: VizConfig | null = null;

  vizType = VizType;

  get cartesianConfig() {
    return {
      title: this.vizConfig?.title,
      xAxis: this.vizConfig?.mapping.xAxis,
      yAxis: this.vizConfig?.mapping.yAxis?.[0],
      colors: this.vizConfig?.colors
    };
  }

  get pieConfig() {
    return {
      title: this.vizConfig?.title,
      xAxis: this.vizConfig?.mapping.label,
      yAxis: this.vizConfig?.mapping.value,
      showLegend: true,
      colors: this.vizConfig?.colors
    };
  }

  get scatterConfig() {
    return {
      title: this.vizConfig?.title,
      xAxis: this.vizConfig?.mapping.xAxis,
      yAxis: this.vizConfig?.mapping.yAxis?.[0],
      colors: this.vizConfig?.colors
    };
  }
}
