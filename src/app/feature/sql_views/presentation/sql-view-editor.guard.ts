import { CanDeactivateFn } from '@angular/router';
import { SqlViewEditorComponent } from './sql-view-editor.component';

export const canDeactivateSqlViewEditor: CanDeactivateFn<SqlViewEditorComponent> = (component) =>
  component.canDeactivate();
