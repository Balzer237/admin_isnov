export interface SqlView {
  id: string;
  name: string;
  description?: string;
  datasourceId: string;
  query: string;
  parameters: SqlViewParameter[];
  columns: SqlViewColumn[];
  visualization: SqlViewVisualization;
  createdAt: Date;
  updatedAt: Date;
}

export interface SqlViewParameter {
  name: string;
  type: ParameterType;
  required: boolean;
  defaultValue?: any;
  description?: string;
}

export interface SqlViewColumn {
  name: string;
  type: ColumnType;
  nullable: boolean;
  description?: string;
}

export interface SqlViewVisualization {
  type: VisualizationType;
  config: VisualizationConfig;
}

export type VisualizationConfig = {
  title?: string;
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
} & Record<string, any>;

export enum ParameterType {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
}

export enum ColumnType {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  JSON = 'json',
}

export enum VisualizationType {
  TABLE = 'table',
  BAR_CHART = 'bar_chart',
  LINE_CHART = 'line_chart',
  PIE_CHART = 'pie_chart',
  SCATTER_PLOT = 'scatter_plot',
}

// DTOs for API communication
export interface CreateSqlViewDto {
  name: string;
  description?: string;
  datasourceId: string;
  query: string;
}

export interface UpdateSqlViewDto {
  name?: string;
  description?: string;
  query?: string;
  visualization?: SqlViewVisualization;
}

export interface ExecuteSqlViewDto {
  parameters: Record<string, any>;
}

export interface SqlViewExecutionResult {
  columns: SqlViewColumn[];
  rows: Record<string, any>[];
  executionTime: number;
}