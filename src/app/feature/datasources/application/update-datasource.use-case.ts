import { Injectable, Inject } from '@angular/core';
import { Datasource, UpdateDatasourceDto } from '../domain/datasource.model';
import { DatasourceRepository, DATASOURCE_REPOSITORY } from '../domain/datasource.repository';

@Injectable({
  providedIn: 'root'
})
export class UpdateDatasourceUseCase {
  constructor(@Inject(DATASOURCE_REPOSITORY) private repository: DatasourceRepository) {}

  execute(id: string, dto: UpdateDatasourceDto): Promise<Datasource> {
    return this.repository.update(id, dto);
  }
}