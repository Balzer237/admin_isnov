import { SqlViewRepository } from '../domain/sql-view.repository';
import { QueryResult } from '../domain/sql-view.model';

export class ExecuteSqlViewUseCase {
  constructor(private readonly repository: SqlViewRepository) {}

  execute(id: string, params: Record<string, any>, limit: number): Promise<QueryResult> {
    return this.repository.execute(id, params, limit);
  }
}
