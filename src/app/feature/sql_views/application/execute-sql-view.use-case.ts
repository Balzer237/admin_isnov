import { inject, Injectable } from '@angular/core';
import { SqlViewRepository, SQL_VIEW_REPOSITORY } from '../domain/sql-view.repository';
import { ExecuteSqlViewDto, SqlViewExecutionResult } from '../domain/sql-view.model';

@Injectable({
  providedIn: 'root'
})
export class ExecuteSqlViewUseCase {
  private repository = inject(SQL_VIEW_REPOSITORY);

  async execute(id: string, dto: ExecuteSqlViewDto): Promise<SqlViewExecutionResult> {
    return this.repository.execute(id, dto);
  }
}