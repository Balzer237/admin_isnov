import {
  ColumnType,
  ParamType,
  QueryResult,
  SqlView,
  SqlViewCategory,
  SqlViewStatus,
  VizType
} from '../domain/sql-view.model';
import { mockDatasources } from '../../datasources/infrastructure/datasource.mock';

export const mockSqlViewCategories: SqlViewCategory[] = [
  { id: 'cat-sales', label: 'Ventes', color: '#2563EB' },
  { id: 'cat-finance', label: 'Finance', color: '#0F766E' },
  { id: 'cat-ops', label: 'Opérations', color: '#D97706' },
  { id: 'cat-growth', label: 'Growth', color: '#7C3AED' }
];

export const mockSqlViews: SqlView[] = [
  {
    id: 'sqlv-1',
    name: 'Chiffre d’affaires mensuel',
    datasourceId: '1',
    sql: `SELECT DATE_TRUNC('month', created_at) AS mois,
SUM(amount) AS revenu
FROM orders
WHERE created_at BETWEEN :date_debut AND :date_fin
GROUP BY mois
ORDER BY mois`,
    parameters: [
      {
        name: 'date_debut',
        label: 'Date de début',
        type: ParamType.DATE,
        required: true
      },
      {
        name: 'date_fin',
        label: 'Date de fin',
        type: ParamType.DATE,
        required: true
      }
    ],
    categoryId: 'cat-sales',
    vizConfig: {
      type: VizType.LINE,
      title: 'Évolution du chiffre d’affaires',
      mapping: {
        xAxis: 'mois',
        yAxis: ['revenu']
      },
      useCustomColors: false
    },
    status: SqlViewStatus.READY,
    createdAt: new Date('2026-03-12T09:30:00Z'),
    updatedAt: new Date('2026-05-03T13:10:00Z')
  },
  {
    id: 'sqlv-2',
    name: 'Répartition des ventes par canal',
    datasourceId: '4',
    sql: `SELECT sales_channel AS canal,
SUM(amount) AS total
FROM orders
GROUP BY canal
ORDER BY total DESC`,
    parameters: [],
    categoryId: 'cat-sales',
    vizConfig: {
      type: VizType.DONUT,
      title: 'Ventes par canal',
      mapping: {
        label: 'canal',
        value: 'total'
      },
      useCustomColors: true,
      colors: ['#2563EB', '#38BDF8', '#0F766E', '#F59E0B']
    },
    status: SqlViewStatus.READY,
    createdAt: new Date('2026-03-18T10:20:00Z'),
    updatedAt: new Date('2026-05-02T16:45:00Z')
  },
  {
    id: 'sqlv-3',
    name: 'Top clients encore à qualifier',
    datasourceId: '1',
    sql: `-- Vue encore en construction
SELECT customer_name,
SUM(amount) AS total_spend
FROM orders
WHERE segment = :segment
GROUP BY customer_name`,
    parameters: [
      {
        name: 'segment',
        label: 'Segment',
        type: ParamType.LIST_STATIC,
        required: true,
        staticOptions: [
          { label: 'Enterprise', value: 'enterprise' },
          { label: 'SMB', value: 'smb' },
          { label: 'Retail', value: 'retail' }
        ]
      }
    ],
    categoryId: 'cat-growth',
    vizConfig: null,
    status: SqlViewStatus.DRAFT,
    createdAt: new Date('2026-04-11T08:00:00Z'),
    updatedAt: new Date('2026-05-01T11:00:00Z')
  }
];

export const mockDashboardUsage: Record<string, string[]> = {
  'sqlv-1': ['Dashboard Finance Global', 'Dashboard Direction'],
  'sqlv-2': ['Dashboard Revenus'],
  'sqlv-3': []
};

export const mockListSqlValues: Record<string, Array<{ label: string; value: any }>> = {
  region: [
    { label: 'EMEA', value: 'emea' },
    { label: 'APAC', value: 'apac' },
    { label: 'Amériques', value: 'americas' }
  ],
  pays: [
    { label: 'France', value: 'fr' },
    { label: 'Cameroun', value: 'cm' },
    { label: 'Canada', value: 'ca' }
  ]
};

export const mockSqlViewDatasourceOptions = mockDatasources.map((datasource) => ({
  id: datasource.id,
  name: datasource.name
}));

export const mockRawResults: Record<string, QueryResult> = {
  revenue: {
    columns: [
      { name: 'mois', type: ColumnType.DATE },
      { name: 'revenu', type: ColumnType.NUMBER }
    ],
    rows: [
      { mois: '2026-01-01', revenu: 15200 },
      { mois: '2026-02-01', revenu: 18420 },
      { mois: '2026-03-01', revenu: 17110 },
      { mois: '2026-04-01', revenu: 22490 }
    ],
    rowCount: 4,
    executionTimeMs: 184,
    compatibleViz: [
      {
        type: VizType.LINE,
        compatible: true,
        confidence: 'high',
        suggestedMapping: { xAxis: 'mois', yAxis: ['revenu'] }
      },
      {
        type: VizType.AREA,
        compatible: true,
        confidence: 'medium',
        suggestedMapping: { xAxis: 'mois', yAxis: ['revenu'] }
      },
      {
        type: VizType.BAR,
        compatible: true,
        confidence: 'medium',
        suggestedMapping: { xAxis: 'mois', yAxis: ['revenu'] }
      },
      {
        type: VizType.TABLE,
        compatible: true,
        confidence: 'high',
        suggestedMapping: {}
      }
    ]
  },
  pie: {
    columns: [
      { name: 'canal', type: ColumnType.TEXT },
      { name: 'total', type: ColumnType.NUMBER }
    ],
    rows: [
      { canal: 'Direct', total: 42800 },
      { canal: 'Partner', total: 21900 },
      { canal: 'Online', total: 30100 }
    ],
    rowCount: 3,
    executionTimeMs: 142,
    compatibleViz: [
      {
        type: VizType.PIE,
        compatible: true,
        confidence: 'high',
        suggestedMapping: { label: 'canal', value: 'total' }
      },
      {
        type: VizType.DONUT,
        compatible: true,
        confidence: 'high',
        suggestedMapping: { label: 'canal', value: 'total' }
      },
      {
        type: VizType.BAR,
        compatible: true,
        confidence: 'medium',
        suggestedMapping: { xAxis: 'canal', yAxis: ['total'] }
      },
      {
        type: VizType.TABLE,
        compatible: true,
        confidence: 'high',
        suggestedMapping: {}
      }
    ]
  },
  scatter: {
    columns: [
      { name: 'sessions', type: ColumnType.NUMBER },
      { name: 'conversion_rate', type: ColumnType.NUMBER },
      { name: 'campaign', type: ColumnType.TEXT }
    ],
    rows: [
      { sessions: 2200, conversion_rate: 2.1, campaign: 'Brand' },
      { sessions: 1580, conversion_rate: 3.6, campaign: 'SEM' },
      { sessions: 990, conversion_rate: 4.4, campaign: 'Retargeting' },
      { sessions: 4200, conversion_rate: 1.7, campaign: 'SEO' }
    ],
    rowCount: 4,
    executionTimeMs: 228,
    compatibleViz: [
      {
        type: VizType.SCATTER,
        compatible: true,
        confidence: 'high',
        suggestedMapping: { xAxis: 'sessions', yAxis: ['conversion_rate'], label: 'campaign' }
      },
      {
        type: VizType.KPI,
        compatible: true,
        confidence: 'low',
        suggestedMapping: { value: 'conversion_rate' }
      },
      {
        type: VizType.TABLE,
        compatible: true,
        confidence: 'high',
        suggestedMapping: {}
      }
    ]
  },
  table: {
    columns: [
      { name: 'customer_name', type: ColumnType.TEXT },
      { name: 'total_spend', type: ColumnType.NUMBER }
    ],
    rows: [
      { customer_name: 'Acme Corp', total_spend: 11000 },
      { customer_name: 'Globex', total_spend: 9400 },
      { customer_name: 'Wayne Enterprises', total_spend: 8800 }
    ],
    rowCount: 3,
    executionTimeMs: 119,
    compatibleViz: [
      {
        type: VizType.TABLE,
        compatible: true,
        confidence: 'high',
        suggestedMapping: {}
      },
      {
        type: VizType.BAR,
        compatible: true,
        confidence: 'medium',
        suggestedMapping: { xAxis: 'customer_name', yAxis: ['total_spend'] }
      }
    ]
  }
};
