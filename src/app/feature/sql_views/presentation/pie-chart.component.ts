import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-wrapper">
      <h4 class="chart-title">{{ config.title || 'Graphique Circulaire' }}</h4>
      <svg
        [attr.width]="width"
        [attr.height]="height"
        class="chart-svg"
        [attr.viewBox]="'0 0 ' + width + ' ' + height">
        <g [attr.transform]="'translate(' + (width / 2) + ', ' + (height / 2) + ')'">
          @for (slice of slices; track $index) {
            <path
              [attr.d]="slice.path"
              [attr.fill]="slice.color"
              class="slice"
              (mouseover)="showTooltip($event, slice)"
              (mouseout)="hideTooltip()">
            </path>
          }
        </g>

        <!-- Legend -->
        @if (config.showLegend) {
          <g class="legend" transform="translate(20, 20)">
            @for (slice of slices; track $index) {
              <rect
                [attr.x]="0"
                [attr.y]="$index * 20"
                width="15"
                height="15"
                [attr.fill]="slice.color">
              </rect>
              <text
                x="20"
                [attr.y]="$index * 20 + 12"
                font-size="12"
                fill="#374151">
                {{ slice.label }} ({{ slice.percentage.toFixed(1) }}%)
              </text>
            }
          </g>
        }

        <!-- Tooltip -->
        @if (tooltip.visible) {
          <g class="tooltip">
            <rect
              [attr.x]="tooltip.x"
              [attr.y]="tooltip.y"
              width="140"
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
              {{ tooltip.value }} ({{ tooltip.percentage.toFixed(1) }}%)
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
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .chart-title {
      text-align: center;
      margin-bottom: 1rem;
      color: #374151;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .chart-svg {
      max-width: 100%;
      height: auto;
    }

    .slice {
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .slice:hover {
      opacity: 0.8;
    }
  `]
})
export class PieChartComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() config: any = {};

  width = 400;
  height = 400;
  radius = 120;

  slices: any[] = [];
  tooltip = { visible: false, x: 0, y: 0, label: '', value: 0, percentage: 0 };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['config']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    if (!this.data.length) return;

    const valueKey = this.config.yAxis || Object.keys(this.data[0])[1];
    const labelKey = this.config.xAxis || Object.keys(this.data[0])[0];
    const colors = this.config.colors || ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'];

    const total = this.data.reduce((sum, d) => sum + Number(d[valueKey]), 0);

    let currentAngle = 0;
    this.slices = this.data.map((d, i) => {
      const value = Number(d[valueKey]);
      const percentage = (value / total) * 100;
      const angle = (value / total) * 2 * Math.PI;

      const x1 = Math.cos(currentAngle) * this.radius;
      const y1 = Math.sin(currentAngle) * this.radius;
      const x2 = Math.cos(currentAngle + angle) * this.radius;
      const y2 = Math.sin(currentAngle + angle) * this.radius;

      const largeArcFlag = angle > Math.PI ? 1 : 0;

      const path = `M 0 0 L ${x1} ${y1} A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      const slice = {
        path,
        color: colors[i % colors.length],
        label: d[labelKey],
        value,
        percentage,
        angle: currentAngle + angle / 2
      };

      currentAngle += angle;
      return slice;
    });
  }

  showTooltip(event: MouseEvent, slice: any): void {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const tooltipX = centerX + Math.cos(slice.angle) * (this.radius + 20) - 70;
    const tooltipY = centerY + Math.sin(slice.angle) * (this.radius + 20) - 50;

    this.tooltip = {
      visible: true,
      x: tooltipX,
      y: tooltipY,
      label: slice.label,
      value: slice.value,
      percentage: slice.percentage
    };
  }

  hideTooltip(): void {
    this.tooltip.visible = false;
  }
}