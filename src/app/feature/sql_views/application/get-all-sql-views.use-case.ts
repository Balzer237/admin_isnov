import { SqlViewRepository } from '../domain/sql-view.repository';
import { SqlView } from '../domain/sql-view.model';

export class GetAllSqlViewsUseCase {
  constructor(private readonly repository: SqlViewRepository) {}

  execute(): Promise<SqlView[]> {
    return this.repository.getAll();
  }
}
