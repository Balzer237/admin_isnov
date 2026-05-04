import { InjectionToken } from '@angular/core';
import { SqlView, CreateSqlViewDto, UpdateSqlViewDto, ExecuteSqlViewDto, SqlViewExecutionResult } from './sql-view.model';

export interface SqlViewRepository {
  getAll(): Promise<SqlView[]>;
  getById(id: string): Promise<SqlView>;
  create(dto: CreateSqlViewDto): Promise<SqlView>;
  update(id: string, dto: UpdateSqlViewDto): Promise<SqlView>;
  delete(id: string): Promise<void>;
  execute(id: string, dto: ExecuteSqlViewDto): Promise<SqlViewExecutionResult>;
  getCompatibleDatasources(): Promise<{ id: string; name: string }[]>;
}

export const SQL_VIEW_REPOSITORY = new InjectionToken<SqlViewRepository>('SqlViewRepository');