import { SqlView, CreateSqlViewDto, UpdateSqlViewDto } from '../domain/sql-view.model';

export class SqlViewMapper {
  static fromApiToDomain(apiData: any): SqlView {
    return {
      id: apiData.id,
      name: apiData.name,
      description: apiData.description,
      datasourceId: apiData.datasourceId,
      query: apiData.query,
      parameters: apiData.parameters || [],
      columns: apiData.columns || [],
      visualization: apiData.visualization || { type: 'table', config: {} },
      createdAt: new Date(apiData.createdAt),
      updatedAt: new Date(apiData.updatedAt)
    };
  }

  static fromDomainToApiCreate(dto: CreateSqlViewDto): any {
    return {
      name: dto.name,
      description: dto.description,
      datasourceId: dto.datasourceId,
      query: dto.query
    };
  }

  static fromDomainToApiUpdate(dto: UpdateSqlViewDto): any {
    const apiData: any = {};
    if (dto.name !== undefined) apiData.name = dto.name;
    if (dto.description !== undefined) apiData.description = dto.description;
    if (dto.query !== undefined) apiData.query = dto.query;
    if (dto.visualization !== undefined) apiData.visualization = dto.visualization;
    return apiData;
  }
}