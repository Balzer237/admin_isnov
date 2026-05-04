import { Injectable, Inject } from '@angular/core';
import { Datasource } from '../domain/datasource.model';
import { DatasourceRepository, DATASOURCE_REPOSITORY } from '../domain/datasource.repository';

@Injectable({
  providedIn: 'root'
})
export class GetDatasourceByIdUseCase {
  constructor(@Inject(DATASOURCE_REPOSITORY) private repository: DatasourceRepository) {}

  execute(id: string): Promise<Datasource | null> {
    return this.repository.getById(id);
  }
}