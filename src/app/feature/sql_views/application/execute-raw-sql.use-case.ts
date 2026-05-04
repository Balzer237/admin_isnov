import { SqlViewRepository } from '../domain/sql-view.repository';
import { QueryResult } from '../domain/sql-view.model';

export class ExecuteRawSqlUseCase {
  constructor(private readonly repository: SqlViewRepository) {}

  execute(
    sql: string,
    datasourceId: string,
    params: Record<string, any>,
    limit: number
  ): Promise<QueryResult> {
    return this.repository.executeRaw(sql, datasourceId, params, limit);
  }
}
