import { inject, Injectable } from '@angular/core';
import { SqlViewRepository, SQL_VIEW_REPOSITORY } from '../domain/sql-view.repository';
import { SqlView, CreateSqlViewDto } from '../domain/sql-view.model';

@Injectable({
  providedIn: 'root'
})
export class CreateSqlViewUseCase {
  private repository = inject(SQL_VIEW_REPOSITORY);

  async execute(dto: CreateSqlViewDto): Promise<SqlView> {
    return this.repository.create(dto);
  }
}