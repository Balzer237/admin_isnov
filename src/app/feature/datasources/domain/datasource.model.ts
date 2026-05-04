export interface Datasource {
  id: string;
  name: string;
  type: DatasourceType;
  host: string;
  port: number;
  database: string;
  schema?: string;
  username: string;
  password: string;
  timeoutMs: number;
  status: ConnectionStatus;
  lastCheckedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  dbVersion?: string;
  testedAt: Date;
}

export enum DatasourceType {
  POSTGRESQL = 'postgresql',
  MYSQL = 'mysql',
  ORACLE = 'oracle',
  SQLSERVER = 'sqlserver',
  H2 = 'h2'
}

export enum ConnectionStatus {
  CONNECTED = 'connected',
  UNTESTED = 'untested',
  ERROR = 'error'
}

export interface CreateDatasourceDto {
  name: string;
  type: DatasourceType;
  host: string;
  port: number;
  database: string;
  schema?: string;
  username: string;
  password: string;
  timeoutMs: number;
}

export interface UpdateDatasourceDto extends Partial<CreateDatasourceDto> {}

