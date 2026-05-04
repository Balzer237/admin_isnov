import { Injectable } from '@angular/core';
import { SqlViewRepository } from '../domain/sql-view.repository';
import { SqlView, CreateSqlViewDto, UpdateSqlViewDto, ExecuteSqlViewDto, SqlViewExecutionResult, VisualizationType } from '../domain/sql-view.model';
import { SqlViewMapper } from './sql-view.mapper';
import { mockSqlViews } from './sql-view.mock';

@Injectable({
  providedIn: 'root'
})
export class SqlViewRepositoryImpl implements SqlViewRepository {
  private sqlViews = [...mockSqlViews];

  async getAll(): Promise<SqlView[]> {
    // TODO: Replace with actual API call
    await fetch('');
    return this.sqlViews.map(SqlViewMapper.fromApiToDomain);
  }

  async getById(id: string): Promise<SqlView> {
    // TODO: Replace with actual API call
    await fetch('');
    const sqlView = this.sqlViews.find(sv => sv.id === id);
    if (!sqlView) {
      throw new Error(`SQL View with id ${id} not found`);
    }
    return SqlViewMapper.fromApiToDomain(sqlView);
  }

  async create(dto: CreateSqlViewDto): Promise<SqlView> {
    // TODO: Replace with actual API call
    await fetch('');
    const newSqlView = {
      id: Date.now().toString(),
      ...dto,
      parameters: [],
      columns: [],
      visualization: { type: VisualizationType.TABLE, config: {} },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.sqlViews.push(newSqlView);
    return SqlViewMapper.fromApiToDomain(newSqlView);
  }

  async update(id: string, dto: UpdateSqlViewDto): Promise<SqlView> {
    // TODO: Replace with actual API call
    await fetch('');
    const index = this.sqlViews.findIndex(sv => sv.id === id);
    if (index === -1) {
      throw new Error(`SQL View with id ${id} not found`);
    }
    this.sqlViews[index] = {
      ...this.sqlViews[index],
      ...dto,
      updatedAt: new Date()
    };
    return SqlViewMapper.fromApiToDomain(this.sqlViews[index]);
  }

  async delete(id: string): Promise<void> {
    // TODO: Replace with actual API call
    await fetch('');
    const index = this.sqlViews.findIndex(sv => sv.id === id);
    if (index === -1) {
      throw new Error(`SQL View with id ${id} not found`);
    }
    this.sqlViews.splice(index, 1);
  }

  async execute(id: string, dto: ExecuteSqlViewDto): Promise<SqlViewExecutionResult> {
    // TODO: Replace with actual API call
    await fetch('');
    const sqlView = this.sqlViews.find(sv => sv.id === id);
    if (!sqlView) {
      throw new Error(`SQL View with id ${id} not found`);
    }

    // Mock execution result based on the SQL View
    const mockRows = this.generateMockRows(sqlView);

    return {
      columns: sqlView.columns,
      rows: mockRows,
      executionTime: Math.random() * 1000 + 100 // Random execution time between 100-1100ms
    };
  }

  async getCompatibleDatasources(): Promise<{ id: string; name: string }[]> {
    // TODO: Replace with actual API call
    await fetch('');
    // Mock datasources - in real app, this would come from the datasources module
    return [
      { id: '1', name: 'PostgreSQL Production' },
      { id: '2', name: 'MySQL Analytics' },
      { id: '3', name: 'SQL Server Reporting' },
      { id: '4', name: 'Oracle Data Warehouse' }
    ];
  }

  private generateMockRows(sqlView: SqlView): Record<string, any>[] {
    const rows: Record<string, any>[] = [];
    const rowCount = Math.floor(Math.random() * 20) + 5; // 5-25 rows

    for (let i = 0; i < rowCount; i++) {
      const row: Record<string, any> = {};
      sqlView.columns.forEach(column => {
        row[column.name] = this.generateMockValue(column.type);
      });
      rows.push(row);
    }

    return rows;
  }

  private generateMockValue(type: string): any {
    switch (type) {
      case 'string':
        return `Value ${Math.floor(Math.random() * 100)}`;
      case 'number':
        return Math.floor(Math.random() * 10000);
      case 'date':
        return new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
      case 'boolean':
        return Math.random() > 0.5;
      default:
        return null;
    }
  }
}