import { inject, Injectable } from '@angular/core';
import { SqlViewRepository, SQL_VIEW_REPOSITORY } from '../domain/sql-view.repository';
import { SqlView } from '../domain/sql-view.model';

@Injectable({
  providedIn: 'root'
})
export class GetAllSqlViewsUseCase {
  private repository = inject(SQL_VIEW_REPOSITORY);

  async execute(): Promise<SqlView[]> {
    return this.repository.getAll();
  }
}