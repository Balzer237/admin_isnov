import { Signal, computed, inject, signal } from '@angular/core';
import { mockDatasources } from '../../datasources/infrastructure/datasource.mock';
import { CreateCategoryUseCase } from '../application/create-category.use-case';
import { CreateSqlViewUseCase } from '../application/create-sql-view.use-case';
import { DeleteSqlViewUseCase } from '../application/delete-sql-view.use-case';
import { DuplicateSqlViewUseCase } from '../application/duplicate-sql-view.use-case';
import { ExecuteRawSqlUseCase } from '../application/execute-raw-sql.use-case';
import { ExecuteSqlViewUseCase } from '../application/execute-sql-view.use-case';
import { GetAllSqlViewsUseCase } from '../application/get-all-sql-views.use-case';
import { GetCategoriesUseCase } from '../application/get-categories.use-case';
import { GetSqlViewByIdUseCase } from '../application/get-sql-view-by-id.use-case';
import { SQL_VIEW_REPOSITORY } from '../application/sql-view.repository.token';
import { UpdateSqlViewUseCase } from '../application/update-sql-view.use-case';
import {
  CreateSqlViewDto,
  ParamType,
  QueryResult,
  SqlView,
  SqlViewCategory,
  SqlViewParameter,
  SqlViewStatus,
  UpdateSqlViewDto,
  VizCompatibilityResult,
  VizConfig,
  VizMapping,
  VizType
} from '../domain/sql-view.model';
import { SqlViewRepository } from '../domain/sql-view.repository';
import { SqlViewRepositoryImpl } from '../infrastructure/sql-view.repository.impl';

type DatasourceOption = { id: string; name: string };

export interface SqlViewStore {
  sqlViews: Signal<SqlView[]>;
  categories: Signal<SqlViewCategory[]>;
  currentView: Signal<SqlView | null>;
  queryResult: Signal<QueryResult | null>;
  selectedViz: Signal<VizCompatibilityResult | null>;
  currentVizConfig: Signal<VizConfig | null>;
  paramValues: Signal<Record<string, any>>;
  isDirty: Signal<boolean>;
  loading: Signal<boolean>;
  executionLoading: Signal<boolean>;
  error: Signal<string | null>;
  datasources: Signal<DatasourceOption[]>;
  obsoleteParams: Signal<string[]>;
  lastExecutionSummary: Signal<string | null>;
  loadAll(): Promise<void>;
  openNewEditor(): void;
  openEditor(id: string): Promise<void>;
  updateMetadata(patch: Partial<Pick<SqlView, 'name' | 'categoryId' | 'datasourceId'>>): void;
  updateSql(sql: string): void;
  updateParam(name: string, value: any): void;
  updateParamConfig(name: string, config: Partial<SqlViewParameter>): void;
  reorderParameters(fromIndex: number, toIndex: number): void;
  removeParameter(name: string): void;
  execute(limit: number): Promise<void>;
  stopExecution(): void;
  selectViz(result: VizCompatibilityResult): void;
  updateVizMapping(mapping: VizMapping): void;
  updateVizTitle(title: string): void;
  toggleCustomColors(): void;
  updateVizColors(colors: string[]): void;
  saveView(): Promise<SqlView | null>;
  duplicate(id: string): Promise<void>;
  delete(id: string): Promise<void>;
  createCategory(label: string, color?: string): Promise<SqlViewCategory>;
  resetEditor(): void;
  getParameterOptions(parameter: SqlViewParameter): Array<{ label: string; value: any }>;
}

const confidenceWeight = { high: 3, medium: 2, low: 1 };
const emptyView = (): SqlView => ({
  id: '',
  name: '',
  datasourceId: '',
  sql: '',
  parameters: [],
  status: SqlViewStatus.DRAFT,
  categoryId: undefined,
  vizConfig: null,
  createdAt: new Date(),
  updatedAt: new Date()
});

export function createSqlViewStore(): SqlViewStore {
  const repository = inject<SqlViewRepository>(SQL_VIEW_REPOSITORY);
  const getAllUseCase = new GetAllSqlViewsUseCase(repository);
  const getByIdUseCase = new GetSqlViewByIdUseCase(repository);
  const createUseCase = new CreateSqlViewUseCase(repository);
  const updateUseCase = new UpdateSqlViewUseCase(repository);
  const deleteUseCase = new DeleteSqlViewUseCase(repository);
  const executeUseCase = new ExecuteSqlViewUseCase(repository);
  const executeRawUseCase = new ExecuteRawSqlUseCase(repository);
  const duplicateUseCase = new DuplicateSqlViewUseCase(repository);
  const getCategoriesUseCase = new GetCategoriesUseCase(repository);
  const createCategoryUseCase = new CreateCategoryUseCase(repository);

  const sqlViews = signal<SqlView[]>([]);
  const categories = signal<SqlViewCategory[]>([]);
  const currentView = signal<SqlView | null>(null);
  const queryResult = signal<QueryResult | null>(null);
  const selectedViz = signal<VizCompatibilityResult | null>(null);
  const currentVizConfig = signal<VizConfig | null>(null);
  const paramValues = signal<Record<string, any>>({});
  const isDirty = signal(false);
  const loading = signal(false);
  const executionLoading = signal(false);
  const error = signal<string | null>(null);
  const datasources = signal<DatasourceOption[]>(
    mockDatasources.map((item) => ({ id: item.id, name: item.name }))
  );
  const obsoleteParams = signal<string[]>([]);
  const lastExecutionSummary = signal<string | null>(null);

  let paramSyncTimer: ReturnType<typeof setTimeout> | null = null;
  let executionToken = 0;

  const sortCompatibleViz = (items: VizCompatibilityResult[]) =>
    [...items].sort((left, right) => {
      if (left.compatible !== right.compatible) {
        return left.compatible ? -1 : 1;
      }
      return confidenceWeight[right.confidence] - confidenceWeight[left.confidence];
    });

  const markDirty = () => {
    const view = currentView();
    if (!view) {
      return;
    }
    currentView.set({
      ...view,
      status: currentVizConfig() ? SqlViewStatus.READY : SqlViewStatus.DRAFT
    });
    isDirty.set(true);
  };

  const syncParameters = (sql: string, dirty = true) => {
    const view = currentView();
    if (!view) {
      return;
    }

    const regex = /:([a-zA-Z_][\w]*)/g;
    const detected: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(sql)) !== null) {
      if (!detected.includes(match[1])) {
        detected.push(match[1]);
      }
    }

    const existingMap = new Map(view.parameters.map((parameter) => [parameter.name, parameter]));
    const updated = detected.map((name) => {
      const existing = existingMap.get(name);
      return existing ?? {
        name,
        label: name.replace(/_/g, ' '),
        type: ParamType.TEXT,
        required: false
      };
    });

    const stale = view.parameters
      .filter((parameter) => !detected.includes(parameter.name))
      .map((parameter) => parameter.name);

    currentView.set({
      ...view,
      parameters: [...updated, ...view.parameters.filter((parameter) => stale.includes(parameter.name))]
    });
    obsoleteParams.set(stale);

    if (dirty) {
      markDirty();
    }
  };

  const scheduleParameterSync = (sql: string) => {
    if (paramSyncTimer) {
      clearTimeout(paramSyncTimer);
    }

    paramSyncTimer = setTimeout(() => syncParameters(sql), 600);
  };

  const buildVizConfig = (result: VizCompatibilityResult, previous?: VizConfig | null): VizConfig => ({
    type: result.type,
    title:
      previous?.type === result.type && previous.title
        ? previous.title
        : `Visualisation ${result.type.replace(/_/g, ' ')}`,
    mapping:
      previous?.type === result.type
        ? { ...previous.mapping, ...result.suggestedMapping }
        : {
            xAxis: result.suggestedMapping.xAxis,
            yAxis: result.suggestedMapping.yAxis ? [...result.suggestedMapping.yAxis] : undefined,
            label: result.suggestedMapping.label,
            value: result.suggestedMapping.value
          },
    useCustomColors: previous?.useCustomColors ?? false,
    colors: previous?.colors ? [...previous.colors] : ['#2563EB', '#38BDF8', '#0F766E', '#F59E0B', '#7C3AED']
  });

  const applyVizSelection = (result: VizCompatibilityResult, dirty = true) => {
    selectedViz.set(result);
    if (result.compatible) {
      currentVizConfig.set(buildVizConfig(result, currentVizConfig()));
      if (dirty) {
        markDirty();
      }
    }
  };

  const ensureLookups = async () => {
    if (categories().length > 0) {
      return;
    }
    categories.set(await getCategoriesUseCase.execute());
  };

  const loadAll = async () => {
    loading.set(true);
    error.set(null);
    try {
      const [views, lookupCategories] = await Promise.all([
        getAllUseCase.execute(),
        getCategoriesUseCase.execute()
      ]);
      sqlViews.set(views);
      categories.set(lookupCategories);
    } catch (caught) {
      error.set(caught instanceof Error ? caught.message : 'Impossible de charger les SQL Views.');
    } finally {
      loading.set(false);
    }
  };

  const openNewEditor = () => {
    currentView.set(emptyView());
    currentVizConfig.set(null);
    queryResult.set(null);
    selectedViz.set(null);
    paramValues.set({});
    obsoleteParams.set([]);
    lastExecutionSummary.set(null);
    isDirty.set(false);
  };

  const openEditor = async (id: string) => {
    loading.set(true);
    error.set(null);
    try {
      await ensureLookups();
      const view = await getByIdUseCase.execute(id);
      currentView.set(view);
      currentVizConfig.set(view.vizConfig ?? null);
      queryResult.set(null);
      selectedViz.set(null);
      obsoleteParams.set([]);
      paramValues.set(
        Object.fromEntries(view.parameters.map((parameter) => [parameter.name, parameter.defaultValue ?? '']))
      );
      syncParameters(view.sql, false);
      isDirty.set(false);
      lastExecutionSummary.set(null);
    } catch (caught) {
      error.set(caught instanceof Error ? caught.message : 'Impossible d’ouvrir la SQL View.');
    } finally {
      loading.set(false);
    }
  };

  const updateMetadata = (patch: Partial<Pick<SqlView, 'name' | 'categoryId' | 'datasourceId'>>) => {
    const view = currentView();
    if (!view) {
      return;
    }

    currentView.set({
      ...view,
      ...patch
    });
    markDirty();
  };

  const updateSql = (sql: string) => {
    const view = currentView();
    if (!view) {
      return;
    }

    currentView.set({
      ...view,
      sql
    });
    markDirty();
    scheduleParameterSync(sql);
  };

  const updateParam = (name: string, value: any) => {
    paramValues.update((values) => ({
      ...values,
      [name]: value
    }));
  };

  const updateParamConfig = (name: string, config: Partial<SqlViewParameter>) => {
    const view = currentView();
    if (!view) {
      return;
    }

    currentView.set({
      ...view,
      parameters: view.parameters.map((parameter) =>
        parameter.name === name ? { ...parameter, ...config } : parameter
      )
    });
    markDirty();
  };

  const reorderParameters = (fromIndex: number, toIndex: number) => {
    const view = currentView();
    if (!view || fromIndex === toIndex || toIndex < 0 || toIndex >= view.parameters.length) {
      return;
    }

    const reordered = [...view.parameters];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    currentView.set({
      ...view,
      parameters: reordered
    });
    markDirty();
  };

  const removeParameter = (name: string) => {
    const view = currentView();
    if (!view) {
      return;
    }

    currentView.set({
      ...view,
      parameters: view.parameters.filter((parameter) => parameter.name !== name)
    });
    obsoleteParams.update((values) => values.filter((value) => value !== name));
    paramValues.update((values) => {
      const next = { ...values };
      delete next[name];
      return next;
    });
    markDirty();
  };

  const execute = async (limit: number) => {
    const view = currentView();
    if (!view || !view.sql || !view.datasourceId) {
      return;
    }

    executionLoading.set(true);
    error.set(null);
    const token = ++executionToken;

    try {
      const result = view.id && !isDirty()
        ? await executeUseCase.execute(view.id, paramValues(), limit)
        : await executeRawUseCase.execute(view.sql, view.datasourceId, paramValues(), limit);

      if (token !== executionToken) {
        return;
      }

      queryResult.set(result);
      lastExecutionSummary.set(`Exécuté en ${result.executionTimeMs}ms — ${result.rowCount} lignes`);
      const best = sortCompatibleViz(result.compatibleViz)[0] ?? null;
      if (best) {
        applyVizSelection(best, false);
      }
    } catch (caught) {
      if (token === executionToken) {
        error.set(caught instanceof Error ? caught.message : 'Erreur lors de l’exécution.');
      }
    } finally {
      if (token === executionToken) {
        executionLoading.set(false);
      }
    }
  };

  const stopExecution = () => {
    executionToken += 1;
    executionLoading.set(false);
  };

  const selectViz = (result: VizCompatibilityResult) => applyVizSelection(result);

  const updateVizMapping = (mapping: VizMapping) => {
    const config = currentVizConfig();
    if (!config) {
      return;
    }

    currentVizConfig.set({
      ...config,
      mapping: {
        ...config.mapping,
        ...mapping
      }
    });
    markDirty();
  };

  const updateVizTitle = (title: string) => {
    const config = currentVizConfig();
    if (!config) {
      return;
    }

    currentVizConfig.set({
      ...config,
      title
    });
    markDirty();
  };

  const toggleCustomColors = () => {
    const config = currentVizConfig();
    if (!config) {
      return;
    }

    currentVizConfig.set({
      ...config,
      useCustomColors: !config.useCustomColors
    });
    markDirty();
  };

  const updateVizColors = (colors: string[]) => {
    const config = currentVizConfig();
    if (!config) {
      return;
    }

    currentVizConfig.set({
      ...config,
      colors: [...colors]
    });
    markDirty();
  };

  const saveView = async (): Promise<SqlView | null> => {
    const view = currentView();
    if (!view) {
      return null;
    }

    loading.set(true);
    error.set(null);
    try {
      const dto: CreateSqlViewDto | UpdateSqlViewDto = {
        name: view.name.trim(),
        datasourceId: view.datasourceId,
        sql: view.sql,
        parameters: view.parameters
          .filter((parameter) => !obsoleteParams().includes(parameter.name))
          .map((parameter) => ({
            ...parameter,
            defaultValue: paramValues()[parameter.name] ?? parameter.defaultValue
          })),
        categoryId: view.categoryId,
        vizConfig: currentVizConfig(),
        status: currentVizConfig() ? SqlViewStatus.READY : SqlViewStatus.DRAFT
      };

      const saved = view.id
        ? await updateUseCase.execute(view.id, dto)
        : await createUseCase.execute(dto as CreateSqlViewDto);

      currentView.set(saved);
      currentVizConfig.set(saved.vizConfig ?? null);
      sqlViews.update((items) => {
        const exists = items.some((item) => item.id === saved.id);
        return exists ? items.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...items];
      });
      isDirty.set(false);
      return saved;
    } catch (caught) {
      error.set(caught instanceof Error ? caught.message : 'Erreur lors de la sauvegarde.');
      return null;
    } finally {
      loading.set(false);
    }
  };

  const duplicate = async (id: string) => {
    loading.set(true);
    error.set(null);
    try {
      const duplicated = await duplicateUseCase.execute(id);
      sqlViews.update((items) => [duplicated, ...items]);
    } catch (caught) {
      error.set(caught instanceof Error ? caught.message : 'Erreur lors de la duplication.');
    } finally {
      loading.set(false);
    }
  };

  const deleteView = async (id: string) => {
    loading.set(true);
    error.set(null);
    try {
      await deleteUseCase.execute(id);
      sqlViews.update((items) => items.filter((item) => item.id !== id));
      if (currentView()?.id === id) {
        openNewEditor();
      }
    } catch (caught) {
      error.set(caught instanceof Error ? caught.message : 'Erreur lors de la suppression.');
    } finally {
      loading.set(false);
    }
  };

  const createCategory = async (label: string, color?: string) => {
    const created = await createCategoryUseCase.execute(label, color);
    categories.update((items) => [created, ...items]);
    updateMetadata({ categoryId: created.id });
    return created;
  };

  const resetEditor = () => {
    currentView.set(null);
    currentVizConfig.set(null);
    queryResult.set(null);
    selectedViz.set(null);
    paramValues.set({});
    obsoleteParams.set([]);
    lastExecutionSummary.set(null);
    error.set(null);
    isDirty.set(false);
  };

  const getParameterOptions = (parameter: SqlViewParameter) => {
    if (parameter.type === ParamType.LIST_STATIC) {
      return parameter.staticOptions ?? [];
    }

    if (
      parameter.type === ParamType.LIST_SQL &&
      repository instanceof SqlViewRepositoryImpl
    ) {
      return repository.getMockListValues(parameter.name);
    }

    return [];
  };

  return {
    sqlViews: computed(() => sqlViews()),
    categories: computed(() => categories()),
    currentView: computed(() => currentView()),
    queryResult: computed(() => queryResult()),
    selectedViz: computed(() => selectedViz()),
    currentVizConfig: computed(() => currentVizConfig()),
    paramValues: computed(() => paramValues()),
    isDirty: computed(() => isDirty()),
    loading: computed(() => loading()),
    executionLoading: computed(() => executionLoading()),
    error: computed(() => error()),
    datasources: computed(() => datasources()),
    obsoleteParams: computed(() => obsoleteParams()),
    lastExecutionSummary: computed(() => lastExecutionSummary()),
    loadAll,
    openNewEditor,
    openEditor,
    updateMetadata,
    updateSql,
    updateParam,
    updateParamConfig,
    reorderParameters,
    removeParameter,
    execute,
    stopExecution,
    selectViz,
    updateVizMapping,
    updateVizTitle,
    toggleCustomColors,
    updateVizColors,
    saveView,
    duplicate,
    delete: deleteView,
    createCategory,
    resetEditor,
    getParameterOptions
  };
}
