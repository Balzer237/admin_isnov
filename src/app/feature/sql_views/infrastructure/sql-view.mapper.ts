import { SqlView, SqlViewCategory } from '../domain/sql-view.model';

export class SqlViewMapper {
  static cloneView(view: SqlView): SqlView {
    return {
      ...view,
      parameters: view.parameters.map((parameter) => ({
        ...parameter,
        staticOptions: parameter.staticOptions ? [...parameter.staticOptions] : undefined
      })),
      vizConfig: view.vizConfig
        ? {
            ...view.vizConfig,
            mapping: {
              ...view.vizConfig.mapping,
              yAxis: view.vizConfig.mapping.yAxis ? [...view.vizConfig.mapping.yAxis] : undefined
            },
            colors: view.vizConfig.colors ? [...view.vizConfig.colors] : undefined
          }
        : null,
      createdAt: new Date(view.createdAt),
      updatedAt: new Date(view.updatedAt)
    };
  }

  static cloneCategory(category: SqlViewCategory): SqlViewCategory {
    return { ...category };
  }
}
