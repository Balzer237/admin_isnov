export enum VizType {
  TABLE = 'table',
  BAR = 'bar',
  LINE = 'line',
  AREA = 'area',
  STACKED_BAR = 'stacked_bar',
  PIE = 'pie',
  DONUT = 'donut',
  SCATTER = 'scatter',
  KPI = 'kpi'
}

export enum ColumnType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  DATETIME = 'datetime',
  BOOLEAN = 'boolean',
  JSON = 'json'
}

export enum ParamType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  DATETIME = 'datetime',
  BOOLEAN = 'boolean',
  LIST_STATIC = 'list_static',
  LIST_SQL = 'list_sql'
}

export enum SqlViewStatus {
  DRAFT = 'draft',
  READY = 'ready'
}

export interface ColumnMeta {
  name: string;
  type: ColumnType;
}

export interface VizCompatibilityResult {
  type: VizType;
  compatible: boolean;
  confidence: 'high' | 'medium' | 'low';
  reason?: string;
  suggestedMapping: {
    xAxis?: string;
    yAxis?: string[];
    label?: string;
    value?: string;
  };
}

export interface QueryResult {
  columns: ColumnMeta[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTimeMs: number;
  compatibleViz: VizCompatibilityResult[];
}

export interface VizMapping {
  xAxis?: string;
  yAxis?: string[];
  label?: string;
  value?: string;
}

export interface VizConfig {
  type: VizType;
  mapping: VizMapping;
  title: string;
  useCustomColors: boolean;
  colors?: string[];
}

export interface SqlViewParameter {
  name: string;
  label: string;
  type: ParamType;
  defaultValue?: any;
  required: boolean;
  dependsOn?: string;
  listQuery?: string;
  staticOptions?: Array<{ label: string; value: any }>;
}

export interface SqlViewCategory {
  id: string;
  label: string;
  color: string;
}

export interface SqlView {
  id: string;
  name: string;
  datasourceId: string;
  sql: string;
  parameters: SqlViewParameter[];
  status: SqlViewStatus;
  categoryId?: string;
  vizConfig?: VizConfig | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSqlViewDto {
  name: string;
  datasourceId: string;
  sql: string;
  parameters: SqlViewParameter[];
  categoryId?: string;
  vizConfig?: VizConfig | null;
  status?: SqlViewStatus;
}

export interface UpdateSqlViewDto {
  name?: string;
  datasourceId?: string;
  sql?: string;
  parameters?: SqlViewParameter[];
  categoryId?: string;
  vizConfig?: VizConfig | null;
  status?: SqlViewStatus;
}

export { VizType as VisualizationType, ParamType as ParameterType };
