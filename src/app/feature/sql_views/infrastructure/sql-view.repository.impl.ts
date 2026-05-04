import {
  ColumnMeta,
  ColumnType,
  CreateSqlViewDto,
  ParamType,
  QueryResult,
  SqlView,
  SqlViewCategory,
  SqlViewStatus,
  UpdateSqlViewDto,
  VizCompatibilityResult,
  VizType
} from '../domain/sql-view.model';
import { SqlViewRepository } from '../domain/sql-view.repository';
import {
  mockDashboardUsage,
  mockListSqlValues,
  mockRawResults,
  mockSqlViewCategories,
  mockSqlViews
} from './sql-view.mock';
import { SqlViewMapper } from './sql-view.mapper';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class SqlViewRepositoryImpl implements SqlViewRepository {
  private sqlViews = mockSqlViews.map(SqlViewMapper.cloneView);
  private categories = mockSqlViewCategories.map(SqlViewMapper.cloneCategory);

  async getAll(): Promise<SqlView[]> {
    // const response = await fetch('', { method: 'GET' });
    // return await response.json();
    await wait(240);
    return this.sqlViews.map(SqlViewMapper.cloneView);
  }

  async getById(id: string): Promise<SqlView> {
    // const response = await fetch('', { method: 'GET' });
    // return await response.json();
    await wait(180);
    const sqlView = this.sqlViews.find((item) => item.id === id);
    if (!sqlView) {
      throw new Error('Vue SQL introuvable.');
    }

    return SqlViewMapper.cloneView(sqlView);
  }

  async create(dto: CreateSqlViewDto): Promise<SqlView> {
    // const response = await fetch('', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dto)
    // });
    // return await response.json();
    await wait(220);
    const created: SqlView = {
      id: `sqlv-${Date.now()}`,
      name: dto.name,
      datasourceId: dto.datasourceId,
      sql: dto.sql,
      parameters: dto.parameters.map((parameter) => ({ ...parameter })),
      categoryId: dto.categoryId,
      vizConfig: dto.vizConfig ?? null,
      status: dto.vizConfig ? SqlViewStatus.READY : SqlViewStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.sqlViews.unshift(created);
    return SqlViewMapper.cloneView(created);
  }

  async update(id: string, dto: UpdateSqlViewDto): Promise<SqlView> {
    // await fetch('', {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dto)
    // });
    await wait(220);
    const index = this.sqlViews.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('Vue SQL introuvable.');
    }

    this.sqlViews[index] = {
      ...this.sqlViews[index],
      ...dto,
      parameters: dto.parameters
        ? dto.parameters.map((parameter) => ({ ...parameter }))
        : this.sqlViews[index].parameters,
      vizConfig:
        dto.vizConfig === undefined
          ? this.sqlViews[index].vizConfig
          : dto.vizConfig
            ? {
                ...dto.vizConfig,
                mapping: {
                  ...dto.vizConfig.mapping,
                  yAxis: dto.vizConfig.mapping.yAxis ? [...dto.vizConfig.mapping.yAxis] : undefined
                },
                colors: dto.vizConfig.colors ? [...dto.vizConfig.colors] : undefined
              }
            : null,
      status: dto.vizConfig ? SqlViewStatus.READY : dto.status ?? SqlViewStatus.DRAFT,
      updatedAt: new Date()
    };

    return SqlViewMapper.cloneView(this.sqlViews[index]);
  }

  async delete(id: string): Promise<void> {
    // await fetch('', { method: 'DELETE' });
    await wait(180);
    this.sqlViews = this.sqlViews.filter((item) => item.id !== id);
  }

  async execute(id: string, params: Record<string, any>, limit: number): Promise<QueryResult> {
    // const response = await fetch('', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ params, limit })
    // });
    // return await response.json();
    await wait(420);
    const sqlView = this.sqlViews.find((item) => item.id === id);
    if (!sqlView) {
      throw new Error('Vue SQL introuvable.');
    }

    return this.buildResultForSql(sqlView.sql, params, limit, sqlView.vizConfig?.type);
  }

  async executeRaw(
    sql: string,
    datasourceId: string,
    params: Record<string, any>,
    limit: number
  ): Promise<QueryResult> {
    // const response = await fetch('', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ sql, datasourceId, params, limit })
    // });
    // return await response.json();
    await wait(420);
    return this.buildResultForSql(sql, params, limit);
  }

  async duplicate(id: string): Promise<SqlView> {
    await wait(180);
    const original = await this.getById(id);
    const duplicate: SqlView = {
      ...original,
      id: `sqlv-${Date.now()}`,
      name: `${original.name} (copie)`,
      status: original.vizConfig ? SqlViewStatus.READY : SqlViewStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.sqlViews.unshift(duplicate);
    return SqlViewMapper.cloneView(duplicate);
  }

  async getCategories(): Promise<SqlViewCategory[]> {
    // const response = await fetch('', { method: 'GET' });
    // return await response.json();
    await wait(120);
    return this.categories.map(SqlViewMapper.cloneCategory);
  }

  async createCategory(label: string, color = '#2563EB'): Promise<SqlViewCategory> {
    // const response = await fetch('', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ label, color })
    // });
    // return await response.json();
    await wait(120);
    const category: SqlViewCategory = {
      id: `cat-${Date.now()}`,
      label,
      color
    };
    this.categories.unshift(category);
    return SqlViewMapper.cloneCategory(category);
  }

  getDashboardDependencies(id: string): string[] {
    return [...(mockDashboardUsage[id] ?? [])];
  }

  getMockListValues(parameterName: string): Array<{ label: string; value: any }> {
    return [...(mockListSqlValues[parameterName] ?? [])];
  }

  private buildResultForSql(
    sql: string,
    params: Record<string, any>,
    limit: number,
    preferredViz?: VizType | null
  ): QueryResult {
    const normalized = sql.toLowerCase();
    const preset =
      normalized.includes('sales_channel') || normalized.includes('canal')
        ? mockRawResults['pie']
        : normalized.includes('sessions') || normalized.includes('conversion')
          ? mockRawResults['scatter']
          : normalized.includes('date_trunc') || normalized.includes('month') || normalized.includes('mois')
            ? mockRawResults['revenue']
            : mockRawResults['table'];

    const result: QueryResult = {
      columns: preset.columns.map((column) => ({ ...column })),
      rows: preset.rows.slice(0, limit).map((row) => ({ ...row })),
      rowCount: Math.min(preset.rowCount, limit),
      executionTimeMs: preset.executionTimeMs + Math.round(Object.keys(params).length * 12),
      compatibleViz: this.injectPreferredViz(preset.compatibleViz, preferredViz)
    };

    return result;
  }

  private injectPreferredViz(
    compatibleViz: VizCompatibilityResult[],
    preferredViz?: VizType | null
  ): VizCompatibilityResult[] {
    if (!preferredViz) {
      return compatibleViz.map((item) => ({ ...item, suggestedMapping: { ...item.suggestedMapping } }));
    }

    const existing = compatibleViz.find((item) => item.type === preferredViz);
    if (existing) {
      return compatibleViz.map((item) => ({
        ...item,
        confidence: item.type === preferredViz && item.compatible ? 'high' : item.confidence,
        suggestedMapping: { ...item.suggestedMapping }
      }));
    }

    return [
      {
        type: preferredViz,
        compatible: false,
        confidence: 'low',
        reason: 'Le backend indique que cette visualisation n’est pas compatible avec ce résultat.',
        suggestedMapping: {}
      },
      ...compatibleViz.map((item) => ({ ...item, suggestedMapping: { ...item.suggestedMapping } }))
    ];
  }
}
