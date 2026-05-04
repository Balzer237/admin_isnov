import { SqlViewRepository } from '../domain/sql-view.repository';

export class DeleteSqlViewUseCase {
  constructor(private readonly repository: SqlViewRepository) {}

  execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
