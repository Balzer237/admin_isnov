import { Injectable, Inject } from '@angular/core';
import { Datasource } from '../domain/datasource.model';
import { DatasourceRepository, DATASOURCE_REPOSITORY } from '../domain/datasource.repository';

@Injectable({
  providedIn: 'root'
})
export class GetAllDatasourcesUseCase {
  constructor(@Inject(DATASOURCE_REPOSITORY) private repository: DatasourceRepository) {}

  execute(): Promise<Datasource[]> {
    return this.repository.getAll();
  }
}