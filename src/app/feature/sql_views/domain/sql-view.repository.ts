import {
  CreateSqlViewDto,
  QueryResult,
  SqlView,
  SqlViewCategory,
  UpdateSqlViewDto
} from './sql-view.model';

export interface SqlViewRepository {
  getAll(): Promise<SqlView[]>;
  getById(id: string): Promise<SqlView>;
  create(dto: CreateSqlViewDto): Promise<SqlView>;
  update(id: string, dto: UpdateSqlViewDto): Promise<SqlView>;
  delete(id: string): Promise<void>;
  execute(id: string, params: Record<string, any>, limit: number): Promise<QueryResult>;
  executeRaw(
    sql: string,
    datasourceId: string,
    params: Record<string, any>,
    limit: number
  ): Promise<QueryResult>;
  duplicate(id: string): Promise<SqlView>;
  getCategories(): Promise<SqlViewCategory[]>;
  createCategory(label: string, color?: string): Promise<SqlViewCategory>;
}
