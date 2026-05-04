import { Datasource, CreateDatasourceDto, UpdateDatasourceDto, ConnectionTestResult } from '../domain/datasource.model';

export class DatasourceMapper {
  static fromApiToDomain(apiData: any): Datasource {
    return {
      id: apiData.id,
      name: apiData.name,
      type: apiData.type,
      host: apiData.host,
      port: apiData.port,
      database: apiData.database,
      schema: apiData.schema,
      username: apiData.username,
      password: apiData.password,
      timeoutMs: apiData.timeoutMs,
      status: apiData.status,
      lastCheckedAt: apiData.lastCheckedAt ? new Date(apiData.lastCheckedAt) : undefined,
      createdAt: new Date(apiData.createdAt),
      updatedAt: new Date(apiData.updatedAt)
    };
  }

  static fromDomainToApiCreate(dto: CreateDatasourceDto): any {
    return {
      name: dto.name,
      type: dto.type,
      host: dto.host,
      port: dto.port,
      database: dto.database,
      schema: dto.schema,
      username: dto.username,
      password: dto.password,
      timeoutMs: dto.timeoutMs
    };
  }

  static fromDomainToApiUpdate(dto: UpdateDatasourceDto): any {
    return {
      ...dto
    };
  }

  static testResultFromApiToDomain(apiData: any): ConnectionTestResult {
    return {
      success: apiData.success,
      message: apiData.message,
      dbVersion: apiData.dbVersion,
      testedAt: new Date(apiData.testedAt)
    };
  }
}