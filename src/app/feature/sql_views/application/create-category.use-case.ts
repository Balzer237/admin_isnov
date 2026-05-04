import { SqlViewRepository } from '../domain/sql-view.repository';
import { SqlViewCategory } from '../domain/sql-view.model';

export class CreateCategoryUseCase {
  constructor(private readonly repository: SqlViewRepository) {}

  execute(label: string, color?: string): Promise<SqlViewCategory> {
    return this.repository.createCategory(label, color);
  }
}
