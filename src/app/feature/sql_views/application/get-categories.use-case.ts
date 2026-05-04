import { SqlViewRepository } from '../domain/sql-view.repository';
import { SqlViewCategory } from '../domain/sql-view.model';

export class GetCategoriesUseCase {
  constructor(private readonly repository: SqlViewRepository) {}

  execute(): Promise<SqlViewCategory[]> {
    return this.repository.getCategories();
  }
}
