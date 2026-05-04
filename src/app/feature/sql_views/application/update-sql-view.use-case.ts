import { inject, Injectable } from '@angular/core';
import { SqlViewRepository, SQL_VIEW_REPOSITORY } from '../domain/sql-view.repository';
import { SqlView, UpdateSqlViewDto } from '../domain/sql-view.model';

@Injectable({
  providedIn: 'root'
})
export class UpdateSqlViewUseCase {
  private repository = inject(SQL_VIEW_REPOSITORY);

  async execute(id: string, dto: UpdateSqlViewDto): Promise<SqlView> {
    return this.repository.update(id, dto);
  }
}