import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SqlViewStore } from '../presentation/sql-view.store';
import { SqlView } from '../domain/sql-view.model';
import { SqlViewFormComponent } from './sql-view-form.component';
import { SqlViewDeleteModalComponent } from './sql-view-delete-modal.component';
import { SqlViewEditorComponent } from './sql-view-editor.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PageContentComponent } from '../../../shared/components/page-content/page-content.component';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-sql-view-list',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    PageContentComponent,
    ToolbarComponent,
    TableComponent,
    ButtonComponent,
    EmptyStateComponent,
    SqlViewFormComponent,
    SqlViewDeleteModalComponent,
    SqlViewEditorComponent
  ],
  template: `
    <app-page-content>
      <app-page-header title="Gestion des Vues SQL" subtitle="Créer et gérer vos vues SQL personnalisées">
        <app-toolbar>
          <app-button
            label="Nouvelle Vue SQL"
            icon="plus"
            variant="primary"
            (click)="openCreateForm()">
          </app-button>
        </app-toolbar>
      </app-page-header>

      <div class="content">
        @if (store.loading()) {
          <div class="loading">Chargement...</div>
        } @else if (!store.hasSqlViews()) {
          <app-empty-state
            title="Aucune vue SQL"
            description="Créez votre première vue SQL pour commencer l'analyse de vos données."
            icon="database">
            <app-button
              label="Créer une vue SQL"
              variant="primary"
              (click)="openCreateForm()">
            </app-button>
          </app-empty-state>
        } @else {
          <app-table
            [columns]="columns"
            [data]="store.sqlViews()"
            [actions]="tableActions"
            (action)="handleTableAction($event)">
          </app-table>
        }
      </div>

      @if (showCreateForm()) {
        <app-sql-view-form
          [isOpen]="showCreateForm()"
          (close)="closeCreateForm()"
          (save)="onCreateSqlView($event)">
        </app-sql-view-form>
      }

      @if (showEditForm()) {
        <app-sql-view-form
          [isOpen]="showEditForm()"
          [sqlView]="selectedSqlView()"
          (close)="closeEditForm()"
          (save)="onUpdateSqlView($event)">
        </app-sql-view-form>
      }

      @if (showDeleteModal()) {
        <app-sql-view-delete-modal
          [isOpen]="showDeleteModal()"
          [sqlView]="selectedSqlView()"
          (close)="closeDeleteModal()"
          (confirm)="onDeleteSqlView()">
        </app-sql-view-delete-modal>
      }

      @if (showEditor()) {
        <app-sql-view-editor
          [isOpen]="showEditor()"
          [sqlView]="selectedSqlView()"
          (close)="closeEditor()">
        </app-sql-view-editor>
      }
    </app-page-content>
  `,
  styles: [`
    .content {
      padding: 1rem;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #6B7280;
    }
  `]
})
export class SqlViewListComponent implements OnInit {
  store = new SqlViewStore();

  showCreateForm = signal(false);
  showEditForm = signal(false);
  showDeleteModal = signal(false);
  showEditor = signal(false);
  selectedSqlView = signal<SqlView | null>(null);

  columns = [
    { key: 'name', label: 'Nom', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'datasourceId', label: 'Datasource', sortable: true },
    { key: 'createdAt', label: 'Créé le', sortable: true, type: 'date' as const },
    { key: 'updatedAt', label: 'Modifié le', sortable: true, type: 'date' as const }
  ];

  tableActions = [
    { label: 'Éditer', action: 'edit', icon: 'edit' },
    { label: 'Visualiser', action: 'view', icon: 'eye' },
    { label: 'Supprimer', action: 'delete', icon: 'trash', variant: 'danger' as const }
  ];

  ngOnInit(): void {
    this.store.loadSqlViews();
    this.store.loadCompatibleDatasources();
  }

  openCreateForm(): void {
    this.selectedSqlView.set(null);
    this.showCreateForm.set(true);
  }

  closeCreateForm(): void {
    this.showCreateForm.set(false);
  }

  openEditForm(sqlView: SqlView): void {
    this.selectedSqlView.set(sqlView);
    this.showEditForm.set(true);
  }

  closeEditForm(): void {
    this.showEditForm.set(false);
    this.selectedSqlView.set(null);
  }

  openDeleteModal(sqlView: SqlView): void {
    this.selectedSqlView.set(sqlView);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedSqlView.set(null);
  }

  openEditor(sqlView: SqlView): void {
    this.selectedSqlView.set(sqlView);
    this.showEditor.set(true);
  }

  closeEditor(): void {
    this.showEditor.set(false);
    this.selectedSqlView.set(null);
  }

  async onCreateSqlView(dto: any): Promise<void> {
    try {
      await this.store.createSqlView(dto);
      this.closeCreateForm();
    } catch (error) {
      // Error handled by store
    }
  }

  async onUpdateSqlView(dto: any): Promise<void> {
    const sqlView = this.selectedSqlView();
    if (sqlView) {
      try {
        await this.store.updateSqlView(sqlView.id, dto);
        this.closeEditForm();
      } catch (error) {
        // Error handled by store
      }
    }
  }

  async onDeleteSqlView(): Promise<void> {
    const sqlView = this.selectedSqlView();
    if (sqlView) {
      try {
        await this.store.deleteSqlView(sqlView.id);
        this.closeDeleteModal();
      } catch (error) {
        // Error handled by store
      }
    }
  }

  handleTableAction(event: { action: string; item: SqlView }): void {
    const { action, item } = event;
    switch (action) {
      case 'edit':
        this.openEditForm(item);
        break;
      case 'view':
        this.openEditor(item);
        break;
      case 'delete':
        this.openDeleteModal(item);
        break;
    }
  }
}