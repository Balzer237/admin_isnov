import { SqlView, VisualizationType, ParameterType, ColumnType } from '../domain/sql-view.model';

export const mockSqlViews: SqlView[] = [
  {
    id: '1',
    name: 'Ventes par Mois',
    description: 'Analyse des ventes mensuelles avec tendances',
    datasourceId: '1', // PostgreSQL
    query: 'SELECT DATE_TRUNC(\'month\', order_date) as month, SUM(amount) as total_sales FROM orders WHERE order_date >= $start_date AND order_date <= $end_date GROUP BY month ORDER BY month',
    parameters: [
      {
        name: 'start_date',
        type: ParameterType.DATE,
        required: true,
        description: 'Date de début'
      },
      {
        name: 'end_date',
        type: ParameterType.DATE,
        required: true,
        description: 'Date de fin'
      }
    ],
    columns: [
      { name: 'month', type: ColumnType.DATE, nullable: false, description: 'Mois' },
      { name: 'total_sales', type: ColumnType.NUMBER, nullable: false, description: 'Ventes totales' }
    ],
    visualization: {
      type: VisualizationType.LINE_CHART,
      config: {
        title: 'Évolution des Ventes Mensuelles',
        xAxis: 'month',
        yAxis: 'total_sales',
        showLegend: false,
        showGrid: true,
        colors: ['#3B82F6']
      }
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Répartition par Catégorie',
    description: 'Répartition des produits par catégorie',
    datasourceId: '2', // MySQL
    query: 'SELECT category, COUNT(*) as count, AVG(price) as avg_price FROM products GROUP BY category ORDER BY count DESC',
    parameters: [],
    columns: [
      { name: 'category', type: ColumnType.STRING, nullable: false, description: 'Catégorie' },
      { name: 'count', type: ColumnType.NUMBER, nullable: false, description: 'Nombre de produits' },
      { name: 'avg_price', type: ColumnType.NUMBER, nullable: false, description: 'Prix moyen' }
    ],
    visualization: {
      type: VisualizationType.PIE_CHART,
      config: {
        title: 'Répartition par Catégorie',
        showLegend: true,
        colors: ['#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4']
      }
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Clients Actifs',
    description: 'Liste des clients actifs avec statistiques',
    datasourceId: '3', // SQL Server
    query: 'SELECT c.name, c.email, COUNT(o.id) as order_count, SUM(o.amount) as total_spent FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE c.status = \'active\' AND o.order_date >= DATEADD(month, -6, GETDATE()) GROUP BY c.id, c.name, c.email ORDER BY total_spent DESC',
    parameters: [],
    columns: [
      { name: 'name', type: ColumnType.STRING, nullable: false, description: 'Nom du client' },
      { name: 'email', type: ColumnType.STRING, nullable: false, description: 'Email' },
      { name: 'order_count', type: ColumnType.NUMBER, nullable: false, description: 'Nombre de commandes' },
      { name: 'total_spent', type: ColumnType.NUMBER, nullable: false, description: 'Total dépensé' }
    ],
    visualization: {
      type: VisualizationType.TABLE,
      config: {
        title: 'Clients Actifs (6 derniers mois)'
      }
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '4',
    name: 'Performance des Produits',
    description: 'Analyse comparative des produits',
    datasourceId: '4', // Oracle
    query: 'SELECT p.name, p.category, SUM(oi.quantity) as total_quantity, SUM(oi.quantity * oi.unit_price) as total_revenue FROM products p JOIN order_items oi ON p.id = oi.product_id WHERE oi.order_date BETWEEN TO_DATE($start_date, \'YYYY-MM-DD\') AND TO_DATE($end_date, \'YYYY-MM-DD\') GROUP BY p.id, p.name, p.category ORDER BY total_revenue DESC FETCH FIRST 10 ROWS ONLY',
    parameters: [
      {
        name: 'start_date',
        type: ParameterType.STRING,
        required: true,
        description: 'Date de début (YYYY-MM-DD)'
      },
      {
        name: 'end_date',
        type: ParameterType.STRING,
        required: true,
        description: 'Date de fin (YYYY-MM-DD)'
      }
    ],
    columns: [
      { name: 'name', type: ColumnType.STRING, nullable: false, description: 'Nom du produit' },
      { name: 'category', type: ColumnType.STRING, nullable: false, description: 'Catégorie' },
      { name: 'total_quantity', type: ColumnType.NUMBER, nullable: false, description: 'Quantité totale' },
      { name: 'total_revenue', type: ColumnType.NUMBER, nullable: false, description: 'Revenus totaux' }
    ],
    visualization: {
      type: VisualizationType.BAR_CHART,
      config: {
        title: 'Top 10 Produits par Revenus',
        xAxis: 'name',
        yAxis: 'total_revenue',
        groupBy: 'category',
        showLegend: true,
        showGrid: true,
        colors: ['#3B82F6', '#EF4444', '#10B981']
      }
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-30')
  }
];