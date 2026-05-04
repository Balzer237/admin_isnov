import { InjectionToken } from '@angular/core';
import { SqlViewRepository } from '../domain/sql-view.repository';

export const SQL_VIEW_REPOSITORY = new InjectionToken<SqlViewRepository>('SQL_VIEW_REPOSITORY');
