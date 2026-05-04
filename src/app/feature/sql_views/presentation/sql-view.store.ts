import { Injectable, signal, computed } from '@angular/core';
import { SqlView, CreateSqlViewDto, UpdateSqlViewDto, ExecuteSqlViewDto, SqlViewExecutionResult } from '../domain/sql-view.model';
import { GetAllSqlViewsUseCase } from '../application/get-all-sql-views.use-case';
import { CreateSqlViewUseCase } from '../application/create-sql-view.use-case';
import { UpdateSqlViewUseCase } from '../application/update-sql-view.use-case';
import { DeleteSqlViewUseCase } from '../application/delete-sql-view.use-case';
import { GetSqlViewByIdUseCase } from '../application/get-sql-view-by-id.use-case';
import { ExecuteSqlViewUseCase } from '../application/execute-sql-view.use-case';
import { GetCompatibleDatasourcesUseCase } from '../application/get-compatible-datasources.use-case';

@Injectable({
  providedIn: 'root'
})
export class SqlViewStore {
  private readonly getAllUseCase = new GetAllSqlViewsUseCase();
  private readonly createUseCase = new CreateSqlViewUseCase();
  private readonly updateUseCase = new UpdateSqlViewUseCase();
  private readonly deleteUseCase = new DeleteSqlViewUseCase();
  private readonly getByIdUseCase = new GetSqlViewByIdUseCase();
  private readonly executeUseCase = new ExecuteSqlViewUseCase();
  private readonly getDatasourcesUseCase = new GetCompatibleDatasourcesUseCase();

  // State
  private readonly _sqlViews = signal<SqlView[]>([]);
  private readonly _currentSqlView = signal<SqlView | null>(null);
  private readonly _executionResult = signal<SqlViewExecutionResult | null>(null);
  private readonly _compatibleDatasources = signal<{ id: string; name: string }[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  // Computed signals
  readonly sqlViews = this._sqlViews.asReadonly();
  readonly currentSqlView = this._currentSqlView.asReadonly();
  readonly executionResult = this._executionResult.asReadonly();
  readonly compatibleDatasources = this._compatibleDatasources.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasSqlViews = computed(() => this._sqlViews().length > 0);

  async loadSqlViews(): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      const sqlViews = await this.getAllUseCase.execute();
      this._sqlViews.set(sqlViews);
    } catch (error) {
      this._error.set(error instanceof Error ? error.message : 'Erreur lors du chargement des vues SQL');
    } finally {
      this._loading.set(false);
    }
  }

  async loadCompatibleDatasources(): Promise<void> {
    try {
      const datasources = await this.getDatasourcesUseCase.execute();
      this._compatibleDatasources.set(datasources);
    } catch (error) {
      this._error.set(error instanceof Error ? error.message : 'Erreur lors du chargement des datasources');
    }
  }

  async createSqlView(dto: CreateSqlViewDto): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      const newSqlView = await this.createUseCase.execute(dto);
      this._sqlViews.update(sqlViews => [...sqlViews, newSqlView]);
    } catch (error) {
      this._error.set(error instanceof Error ? error.message : 'Erreur lors de la création de la vue SQL');
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async updateSqlView(id: string, dto: UpdateSqlViewDto): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      const updatedSqlView = await this.updateUseCase.execute(id, dto);
      this._sqlViews.update(sqlViews =>
        sqlViews.map(sv => sv.id === id ? updatedSqlView : sv)
      );
      if (this._currentSqlView()?.id === id) {
        this._currentSqlView.set(updatedSqlView);
      }
    } catch (error) {
      this._error.set(error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la vue SQL');
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async deleteSqlView(id: string): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      await this.deleteUseCase.execute(id);
      this._sqlViews.update(sqlViews => sqlViews.filter(sv => sv.id !== id));
      if (this._currentSqlView()?.id === id) {
        this._currentSqlView.set(null);
      }
    } catch (error) {
      this._error.set(error instanceof Error ? error.message : 'Erreur lors de la suppression de la vue SQL');
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async loadSqlViewById(id: string): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      const sqlView = await this.getByIdUseCase.execute(id);
      this._currentSqlView.set(sqlView);
    } catch (error) {
      this._error.set(error instanceof Error ? error.message : 'Erreur lors du chargement de la vue SQL');
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async executeSqlView(id: string, dto: ExecuteSqlViewDto): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      const result = await this.executeUseCase.execute(id, dto);
      this._executionResult.set(result);
    } catch (error) {
      this._error.set(error instanceof Error ? error.message : 'Erreur lors de l\'exécution de la vue SQL');
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  clearError(): void {
    this._error.set(null);
  }

  clearExecutionResult(): void {
    this._executionResult.set(null);
  }

  setCurrentSqlView(sqlView: SqlView | null): void {
    this._currentSqlView.set(sqlView);
  }
}