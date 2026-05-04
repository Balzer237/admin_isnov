import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-wrapper">
      <h4 class="chart-title">{{ config.title || 'Graphique en Lignes' }}</h4>
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

        <!-- Line -->
        <path
          [attr.d]="linePath"
          fill="none"
          stroke="#3B82F6"
          stroke-width="3"
          class="line">
        </path>

        <!-- Data points -->
        <g class="points">
          @for (point of points; track $index) {
            <circle
              [attr.cx]="point.x"
              [attr.cy]="point.y"
              r="5"
              fill="#3B82F6"
              stroke="white"
              stroke-width="2"
              class="point"
              (mouseover)="showTooltip($event, point)"
              (mouseout)="hideTooltip()">
            </circle>
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

    .line {
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .point {
      cursor: pointer;
      transition: r 0.2s;
    }

    .point:hover {
      r: 7;
    }

    .axis-label {
      font-size: 12px;
      fill: #6B7280;
    }
  `]
})
export class LineChartComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() config: any = {};

  width = 600;
  height = 400;
  margin = { top: 20, right: 20, bottom: 60, left: 60 };

  points: any[] = [];
  xLabels: any[] = [];
  yLabels: any[] = [];
  yGridLines: number[] = [];
  linePath = '';
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

    const chartWidth = this.width - this.margin.left - this.margin.right;
    const chartHeight = this.height - this.margin.top - this.margin.bottom;

    const maxValue = Math.max(...this.data.map(d => Number(d[yAxis])));
    const minValue = Math.min(...this.data.map(d => Number(d[yAxis])));

    this.points = this.data.map((d, i) => {
      const x = this.margin.left + (i / (this.data.length - 1)) * chartWidth;
      const value = Number(d[yAxis]);
      const y = this.height - this.margin.bottom - ((value - minValue) / (maxValue - minValue)) * chartHeight;
      return {
        x,
        y,
        label: d[xAxis],
        value: value
      };
    });

    // Generate line path
    this.linePath = this.points.reduce((path, point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${path} ${command} ${point.x} ${point.y}`;
    }, '');

    // X-axis labels
    this.xLabels = this.data.map((d, i) => ({
      x: this.margin.left + (i / (this.data.length - 1)) * chartWidth,
      y: this.height - this.margin.bottom + 20,
      text: String(d[xAxis])
    }));

    // Y-axis labels
    const ySteps = 5;
    this.yLabels = [];
    this.yGridLines = [];
    for (let i = 0; i <= ySteps; i++) {
      const value = minValue + ((maxValue - minValue) / ySteps) * i;
      const y = this.height - this.margin.bottom - (i / ySteps) * chartHeight;
      this.yLabels.push({
        x: this.margin.left - 10,
        y: y + 4,
        text: value.toFixed(0)
      });
      this.yGridLines.push(y);
    }
  }

  showTooltip(event: MouseEvent, point: any): void {
    this.tooltip = {
      visible: true,
      x: point.x - 60,
      y: point.y - 50,
      label: point.label,
      value: point.value
    };
  }

  hideTooltip(): void {
    this.tooltip.visible = false;
  }
}