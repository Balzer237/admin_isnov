import { inject, Injectable } from '@angular/core';
import { SqlViewRepository, SQL_VIEW_REPOSITORY } from '../domain/sql-view.repository';
import { SqlView } from '../domain/sql-view.model';

@Injectable({
  providedIn: 'root'
})
export class GetSqlViewByIdUseCase {
  private repository = inject(SQL_VIEW_REPOSITORY);

  async execute(id: string): Promise<SqlView> {
    return this.repository.getById(id);
  }
}