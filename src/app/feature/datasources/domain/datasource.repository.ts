import { InjectionToken } from '@angular/core';
import { Datasource, CreateDatasourceDto, UpdateDatasourceDto, ConnectionTestResult } from './datasource.model';

export interface DatasourceRepository {
  getAll(): Promise<Datasource[]>;
  getById(id: string): Promise<Datasource | null>;
  create(dto: CreateDatasourceDto): Promise<Datasource>;
  update(id: string, dto: UpdateDatasourceDto): Promise<Datasource>;
  delete(id: string): Promise<void>;
  testConnection(id: string): Promise<ConnectionTestResult>;
}

export const DATASOURCE_REPOSITORY = new InjectionToken<DatasourceRepository>('DatasourceRepository');