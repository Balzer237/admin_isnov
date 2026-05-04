import { Injectable, Inject } from '@angular/core';
import { DatasourceRepository, DATASOURCE_REPOSITORY } from '../domain/datasource.repository';

@Injectable({
  providedIn: 'root'
})
export class DeleteDatasourceUseCase {
  constructor(@Inject(DATASOURCE_REPOSITORY) private repository: DatasourceRepository) {}

  execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}