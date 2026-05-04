import { SqlViewRepository } from '../domain/sql-view.repository';
import { SqlView } from '../domain/sql-view.model';

export class DuplicateSqlViewUseCase {
  constructor(private readonly repository: SqlViewRepository) {}

  execute(id: string): Promise<SqlView> {
    return this.repository.duplicate(id);
  }
}
