import { inject, Injectable } from '@angular/core';
import { SqlViewRepository, SQL_VIEW_REPOSITORY } from '../domain/sql-view.repository';

@Injectable({
  providedIn: 'root'
})
export class GetCompatibleDatasourcesUseCase {
  private repository = inject(SQL_VIEW_REPOSITORY);

  async execute(): Promise<{ id: string; name: string }[]> {
    return this.repository.getCompatibleDatasources();
  }
}