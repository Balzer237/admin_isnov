import { Injectable, Inject } from '@angular/core';
import { ConnectionTestResult } from '../domain/datasource.model';
import { DatasourceRepository, DATASOURCE_REPOSITORY } from '../domain/datasource.repository';

@Injectable({
  providedIn: 'root'
})
export class TestConnectionUseCase {
  constructor(@Inject(DATASOURCE_REPOSITORY) private repository: DatasourceRepository) {}

  execute(id: string): Promise<ConnectionTestResult> {
    return this.repository.testConnection(id);
  }
}