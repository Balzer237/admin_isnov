import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { DATASOURCE_REPOSITORY } from './feature/datasources/domain/datasource.repository';
import { DatasourceRepositoryImpl } from './feature/datasources/infrastructure/datasource.repository.impl';
import { SQL_VIEW_REPOSITORY } from './feature/sql_views/domain/sql-view.repository';
import { SqlViewRepositoryImpl } from './feature/sql_views/infrastructure/sql-view.repository.impl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    { provide: DATASOURCE_REPOSITORY, useClass: DatasourceRepositoryImpl },
    { provide: SQL_VIEW_REPOSITORY, useClass: SqlViewRepositoryImpl }
  ]
};
