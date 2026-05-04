import { Injectable } from '@angular/core';
import { Datasource, CreateDatasourceDto, UpdateDatasourceDto, ConnectionTestResult, ConnectionStatus } from '../domain/datasource.model';
import { DatasourceRepository } from '../domain/datasource.repository';
import { mockDatasources } from './datasource.mock';
import { DatasourceMapper } from './datasource.mapper';

@Injectable({
  providedIn: 'root'
})
export class DatasourceRepositoryImpl implements DatasourceRepository {
  private datasources = [...mockDatasources];

  async getAll(): Promise<Datasource[]> {
    // TODO: remplacer "" par "/api/v1/datasources"
    await fetch('', { method: 'GET' });
    return Promise.resolve(this.datasources.map(DatasourceMapper.fromApiToDomain));
  }

  async getById(id: string): Promise<Datasource | null> {
    // TODO: remplacer "" par "/api/v1/datasources/${id}"
    await fetch('', { method: 'GET' });
    const datasource = this.datasources.find(d => d.id === id);
    return Promise.resolve(datasource ? DatasourceMapper.fromApiToDomain(datasource) : null);
  }

  async create(dto: CreateDatasourceDto): Promise<Datasource> {
    // TODO: remplacer "" par "/api/v1/datasources"
    await fetch('', {
      method: 'POST',
      body: JSON.stringify(DatasourceMapper.fromDomainToApiCreate(dto))
    });
    const newDatasource: Datasource = {
      ...dto,
      id: (this.datasources.length + 1).toString(),
      status: ConnectionStatus.UNTESTED,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.datasources.push(newDatasource);
    return Promise.resolve(DatasourceMapper.fromApiToDomain(newDatasource));
  }

  async update(id: string, dto: UpdateDatasourceDto): Promise<Datasource> {
    // TODO: remplacer "" par "/api/v1/datasources/${id}"
    await fetch('', {
      method: 'PUT',
      body: JSON.stringify(DatasourceMapper.fromDomainToApiUpdate(dto))
    });
    const index = this.datasources.findIndex(d => d.id === id);
    if (index !== -1) {
      this.datasources[index] = { ...this.datasources[index], ...dto, updatedAt: new Date() };
      return Promise.resolve(DatasourceMapper.fromApiToDomain(this.datasources[index]));
    }
    throw new Error('Datasource not found');
  }

  async delete(id: string): Promise<void> {
    // TODO: remplacer "" par "/api/v1/datasources/${id}"
    await fetch('', { method: 'DELETE' });
    this.datasources = this.datasources.filter(d => d.id !== id);
    return Promise.resolve();
  }

  async testConnection(id: string): Promise<ConnectionTestResult> {
    // TODO: remplacer "" par "/api/v1/datasources/${id}/test-connection"
    await fetch('', { method: 'POST' });
    const datasource = this.datasources.find(d => d.id === id);
    if (!datasource) {
      return Promise.resolve({
        success: false,
        message: 'Datasource introuvable',
        testedAt: new Date()
      });
    }
    // Mock result based on status
    const success = datasource.status === ConnectionStatus.CONNECTED;
    return Promise.resolve({
      success,
      message: success ? 'Connexion réussie' : 'Erreur de connexion',
      dbVersion: success ? 'PostgreSQL 13.0' : undefined,
      testedAt: new Date()
    });
  }
}