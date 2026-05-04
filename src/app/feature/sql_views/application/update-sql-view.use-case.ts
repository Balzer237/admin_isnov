import { SqlViewRepository } from '../domain/sql-view.repository';
import { SqlView, UpdateSqlViewDto } from '../domain/sql-view.model';

export class UpdateSqlViewUseCase {
  constructor(private readonly repository: SqlViewRepository) {}

  execute(id: string, dto: UpdateSqlViewDto): Promise<SqlView> {
    return this.repository.update(id, dto);
  }
}
