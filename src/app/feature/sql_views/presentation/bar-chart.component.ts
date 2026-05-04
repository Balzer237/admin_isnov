import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-wrapper">
      <h4 class="chart-title">{{ config.title || 'Graphique en Barres' }}</h4>
      <svg
        [attr.width]="width"
        [attr.height]="height"
        class="chart-svg">
        <!-- Grid lines -->
        <g class="grid">
          @for (y of yGridLines; track $index) {
            <line
              [attr.x1]="margin.left"
              [attr.y1]="y"
              [attr.x2]="width - margin.right"
              [attr.y2]="y"
              stroke="#E5E7EB"
              stroke-width="1">
            </line>
          }
        </g>

        <!-- Bars -->
        <g class="bars">
          @for (bar of bars; track $index) {
            <rect
              [attr.x]="bar.x"
              [attr.y]="bar.y"
              [attr.width]="bar.width"
              [attr.height]="bar.height"
              [attr.fill]="bar.color"
              class="bar"
              (mouseover)="showTooltip($event, bar)"
              (mouseout)="hideTooltip()">
            </rect>
          }
        </g>

        <!-- X-axis labels -->
        <g class="x-axis">
          @for (label of xLabels; track $index) {
            <text
              [attr.x]="label.x"
              [attr.y]="label.y"
              text-anchor="middle"
              class="axis-label">
              {{ label.text }}
            </text>
          }
        </g>

        <!-- Y-axis labels -->
        <g class="y-axis">
          @for (label of yLabels; track $index) {
            <text
              [attr.x]="label.x"
              [attr.y]="label.y"
              text-anchor="end"
              class="axis-label">
              {{ label.text }}
            </text>
          }
        </g>

        <!-- Tooltip -->
        @if (tooltip.visible) {
          <g class="tooltip">
            <rect
              [attr.x]="tooltip.x"
              [attr.y]="tooltip.y"
              width="120"
              height="40"
              fill="#374151"
              rx="4">
            </rect>
            <text
              [attr.x]="tooltip.x + 10"
              [attr.y]="tooltip.y + 20"
              fill="white"
              font-size="12">
              {{ tooltip.label }}
            </text>
            <text
              [attr.x]="tooltip.x + 10"
              [attr.y]="tooltip.y + 35"
              fill="white"
              font-size="12"
              font-weight="bold">
              {{ tooltip.value }}
            </text>
          </g>
        }
      </svg>
    </div>
  `,
  styles: [`
    .chart-wrapper {
      width: 100%;
      height: 100%;
    }

    .chart-title {
      text-align: center;
      margin-bottom: 1rem;
      color: #374151;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .chart-svg {
      width: 100%;
      height: 100%;
    }

    .bar {
      transition: fill-opacity 0.2s;
    }

    .bar:hover {
      fill-opacity: 0.8;
    }

    .axis-label {
      font-size: 12px;
      fill: #6B7280;
    }
  `]
})
export class BarChartComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() config: any = {};

  width = 600;
  height = 400;
  margin = { top: 20, right: 20, bottom: 60, left: 60 };

  bars: any[] = [];
  xLabels: any[] = [];
  yLabels: any[] = [];
  yGridLines: number[] = [];
  tooltip = { visible: false, x: 0, y: 0, label: '', value: '' };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['config']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    if (!this.data.length) return;

    const xAxis = this.config.xAxis || Object.keys(this.data[0])[0];
    const yAxis = this.config.yAxis || Object.keys(this.data[0])[1];
    const colors = this.config.colors || ['#3B82F6'];

    const chartWidth = this.width - this.margin.left - this.margin.right;
    const chartHeight = this.height - this.margin.top - this.margin.bottom;

    const maxValue = Math.max(...this.data.map(d => Number(d[yAxis])));
    const barWidth = chartWidth / this.data.length;

    this.bars = this.data.map((d, i) => {
      const value = Number(d[yAxis]);
      const barHeight = (value / maxValue) * chartHeight;
      return {
        x: this.margin.left + i * barWidth + 5,
        y: this.height - this.margin.bottom - barHeight,
        width: barWidth - 10,
        height: barHeight,
        color: colors[i % colors.length],
        label: d[xAxis],
        value: value
      };
    });

    // X-axis labels
    this.xLabels = this.data.map((d, i) => ({
      x: this.margin.left + i * barWidth + barWidth / 2,
      y: this.height - this.margin.bottom + 20,
      text: String(d[xAxis])
    }));

    // Y-axis labels
    const ySteps = 5;
    this.yLabels = [];
    this.yGridLines = [];
    for (let i = 0; i <= ySteps; i++) {
      const value = (maxValue / ySteps) * i;
      const y = this.height - this.margin.bottom - (value / maxValue) * chartHeight;
      this.yLabels.push({
        x: this.margin.left - 10,
        y: y + 4,
        text: value.toFixed(0)
      });
      this.yGridLines.push(y);
    }
  }

  showTooltip(event: MouseEvent, bar: any): void {
    this.tooltip = {
      visible: true,
      x: bar.x + bar.width / 2 - 60,
      y: bar.y - 50,
      label: bar.label,
      value: bar.value
    };
  }

  hideTooltip(): void {
    this.tooltip.visible = false;
  }
}