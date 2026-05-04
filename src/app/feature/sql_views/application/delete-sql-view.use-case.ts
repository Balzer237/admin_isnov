import { inject, Injectable } from '@angular/core';
import { SqlViewRepository, SQL_VIEW_REPOSITORY } from '../domain/sql-view.repository';

@Injectable({
  providedIn: 'root'
})
export class DeleteSqlViewUseCase {
  private repository = inject(SQL_VIEW_REPOSITORY);

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}