import { SqlViewRepository } from '../domain/sql-view.repository';
import { CreateSqlViewDto, SqlView } from '../domain/sql-view.model';

export class CreateSqlViewUseCase {
  constructor(private readonly repository: SqlViewRepository) {}

  execute(dto: CreateSqlViewDto): Promise<SqlView> {
    return this.repository.create(dto);
  }
}
