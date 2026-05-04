import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scatter-plot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-wrapper">
      <h4 class="chart-title">{{ config.title || 'Nuage de Points' }}</h4>
      <svg
        [attr.width]="width"
        [attr.height]="height"
        class="chart-svg">
        <!-- Grid lines -->
        <g class="grid">
          @for (x of xGridLines; track $index) {
            <line
              [attr.x1]="x"
              [attr.y1]="margin.top"
              [attr.x2]="x"
              [attr.y2]="height - margin.bottom"
              stroke="#E5E7EB"
              stroke-width="1">
            </line>
          }
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

        <!-- Data points -->
        <g class="points">
          @for (point of points; track $index) {
            <circle
              [attr.cx]="point.x"
              [attr.cy]="point.y"
              r="6"
              [attr.fill]="point.color"
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
              X: {{ tooltip.xValue }}
            </text>
            <text
              [attr.x]="tooltip.x + 10"
              [attr.y]="tooltip.y + 35"
              fill="white"
              font-size="12"
              font-weight="bold">
              Y: {{ tooltip.yValue }}
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

    .point {
      cursor: pointer;
      transition: r 0.2s;
    }

    .point:hover {
      r: 8;
    }

    .axis-label {
      font-size: 12px;
      fill: #6B7280;
    }
  `]
})
export class ScatterPlotComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() config: any = {};

  width = 600;
  height = 400;
  margin = { top: 20, right: 20, bottom: 60, left: 60 };

  points: any[] = [];
  xLabels: any[] = [];
  yLabels: any[] = [];
  xGridLines: number[] = [];
  yGridLines: number[] = [];
  tooltip = { visible: false, x: 0, y: 0, xValue: '', yValue: '' };

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

    const xValues = this.data.map(d => Number(d[xAxis]));
    const yValues = this.data.map(d => Number(d[yAxis]));

    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    this.points = this.data.map((d, i) => {
      const xValue = Number(d[xAxis]);
      const yValue = Number(d[yAxis]);

      const x = this.margin.left + ((xValue - xMin) / (xMax - xMin)) * chartWidth;
      const y = this.height - this.margin.bottom - ((yValue - yMin) / (yMax - yMin)) * chartHeight;

      return {
        x,
        y,
        xValue,
        yValue,
        color: colors[i % colors.length]
      };
    });

    // X-axis labels and grid
    const xSteps = 5;
    this.xLabels = [];
    this.xGridLines = [];
    for (let i = 0; i <= xSteps; i++) {
      const value = xMin + ((xMax - xMin) / xSteps) * i;
      const x = this.margin.left + (i / xSteps) * chartWidth;
      this.xLabels.push({
        x,
        y: this.height - this.margin.bottom + 20,
        text: value.toFixed(1)
      });
      this.xGridLines.push(x);
    }

    // Y-axis labels and grid
    const ySteps = 5;
    this.yLabels = [];
    this.yGridLines = [];
    for (let i = 0; i <= ySteps; i++) {
      const value = yMin + ((yMax - yMin) / ySteps) * i;
      const y = this.height - this.margin.bottom - (i / ySteps) * chartHeight;
      this.yLabels.push({
        x: this.margin.left - 10,
        y: y + 4,
        text: value.toFixed(1)
      });
      this.yGridLines.push(y);
    }
  }

  showTooltip(event: MouseEvent, point: any): void {
    this.tooltip = {
      visible: true,
      x: point.x - 60,
      y: point.y - 50,
      xValue: point.xValue.toFixed(2),
      yValue: point.yValue.toFixed(2)
    };
  }

  hideTooltip(): void {
    this.tooltip.visible = false;
  }
}