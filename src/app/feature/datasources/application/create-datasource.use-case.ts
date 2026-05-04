import { Injectable, Inject } from '@angular/core';
import { Datasource, CreateDatasourceDto } from '../domain/datasource.model';
import { DatasourceRepository, DATASOURCE_REPOSITORY } from '../domain/datasource.repository';

@Injectable({
  providedIn: 'root'
})
export class CreateDatasourceUseCase {
  constructor(@Inject(DATASOURCE_REPOSITORY) private repository: DatasourceRepository) {}

  execute(dto: CreateDatasourceDto): Promise<Datasource> {
    return this.repository.create(dto);
  }
}