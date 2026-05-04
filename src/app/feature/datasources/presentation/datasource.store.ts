import { Injectable, signal } from '@angular/core';
import { Datasource, ConnectionTestResult, ConnectionStatus } from '../domain/datasource.model';
import { GetAllDatasourcesUseCase } from '../application/get-all-datasources.use-case';
import { GetDatasourceByIdUseCase } from '../application/get-datasource-by-id.use-case';
import { CreateDatasourceUseCase } from '../application/create-datasource.use-case';
import { UpdateDatasourceUseCase } from '../application/update-datasource.use-case';
import { DeleteDatasourceUseCase } from '../application/delete-datasource.use-case';
import { TestConnectionUseCase } from '../application/test-connection.use-case';

@Injectable({
  providedIn: 'root'
})
export class DatasourceStore {
  datasources = signal<Datasource[]>([]);
  selectedDatasource = signal<Datasource | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  testResult = signal<ConnectionTestResult | null>(null);

  constructor(
    private getAllUseCase: GetAllDatasourcesUseCase,
    private getByIdUseCase: GetDatasourceByIdUseCase,
    private createUseCase: CreateDatasourceUseCase,
    private updateUseCase: UpdateDatasourceUseCase,
    private deleteUseCase: DeleteDatasourceUseCase,
    private testConnectionUseCase: TestConnectionUseCase
  ) {}

  async loadDatasources() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const datasources = await this.getAllUseCase.execute();
      this.datasources.set(datasources);
    } catch (err) {
      this.error.set('Erreur lors du chargement des datasources');
    } finally {
      this.loading.set(false);
    }
  }

  async loadDatasourceById(id: string) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const datasource = await this.getByIdUseCase.execute(id);
      this.selectedDatasource.set(datasource);
    } catch (err) {
      this.error.set('Erreur lors du chargement du datasource');
    } finally {
      this.loading.set(false);
    }
  }

  async createDatasource(dto: any) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const newDatasource = await this.createUseCase.execute(dto);
      this.datasources.update(list => [...list, newDatasource]);
    } catch (err) {
      this.error.set('Erreur lors de la création du datasource');
    } finally {
      this.loading.set(false);
    }
  }

  async updateDatasource(id: string, dto: any) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const updated = await this.updateUseCase.execute(id, dto);
      this.datasources.update(list => list.map(d => d.id === id ? updated : d));
      this.selectedDatasource.set(updated);
    } catch (err) {
      this.error.set('Erreur lors de la mise à jour du datasource');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteDatasource(id: string) {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.deleteUseCase.execute(id);
      this.datasources.update(list => list.filter(d => d.id !== id));
    } catch (err) {
      this.error.set('Erreur lors de la suppression du datasource');
    } finally {
      this.loading.set(false);
    }
  }

  async testConnection(id: string) {
    this.testResult.set(null);
    try {
      const result = await this.testConnectionUseCase.execute(id);
      this.testResult.set(result);
      // Update status in list
      this.datasources.update(list =>
        list.map(d => d.id === id ? { ...d, status: result.success ? ConnectionStatus.CONNECTED : ConnectionStatus.ERROR, lastCheckedAt: result.testedAt } : d)
      );
    } catch (err) {
      this.testResult.set({
        success: false,
        message: 'Erreur lors du test de connexion',
        testedAt: new Date()
      });
    }
  }

  clearError() {
    this.error.set(null);
  }

  clearTestResult() {
    this.testResult.set(null);
  }
}