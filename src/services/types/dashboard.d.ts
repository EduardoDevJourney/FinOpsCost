
export interface DashboardApiParams {
  startDate?: Date;
  endDate?: Date;
  referenceMonth: string;
}

// --- AZURE ---
export interface ApiKpiResponse {
  data_atual: string;
  total_mes_atual: number;
  total_mes_anterior: number;
  variacao_percentual: number;
  kpi_color: string;
}

export interface ApiDailyBudgetResponse {
  data_uso: string;
  gasto_real_dia_total?: number;
  budget_diario_total?: number;
}

export interface ApiTopAsset {
  mes_referencia: string;
  subscription_name: string;
  resource_group: string;
  resource_type: string;
  resource_name: string;
  valor_total: number;
  currency: string;
  ranking_global: number;
}

export interface ApiTopResourceGroup {
  mes_referencia: string;
  subscription_name: string;
  resource_group: string;
  valor_total: number;
  currency: string;
  ranking_global: number;
}

export interface ApiSubscriptionComparison {
  subscription_name: string;
  current_month_cost: number;
  previous_month_cost: number;
  delta_value: number;
  delta_percent: number;
}

// --- ORACLE (OCI) ---
export interface ApiOracleKpiResponse {
  data_atual: string;
  total_mes_atual: number;
  total_mes_anterior: number;
  variacao_percentual: number;
  kpi_color: string;
}

export interface ApiOracleTopAsset {
  mes_referencia: string;
  tenancy_name: string;
  compartment_name: string;
  resource_type: string;
  resource_name: string;
  resource_id: string;
  valor_total: number;
  currency: string;
  ranking_global: number;
}

export interface ApiOracleTopCompartment {
  mes_referencia: string;
  tenancy_name: string;
  compartment_name: string;
  valor_total: number;
  currency: string;
  ranking_global: number;
}

export interface ApiOracleComparison {
  compartment_name: string;
  current_month_cost: number;
  previous_month_cost: number;
  delta_value: number;
  delta_percent: number;
}

// ==========================================
// 3. TIPOS UNIFICADOS DE UI (Camel Case)
// ==========================================

export interface ChartSeriesPoint {
  day: number;
  fullDate: string;
  cost: number;
  budget: number;
}

export interface RankingItem {
  name: string;
  value: number;
  subscriptionName?: string;
  resourceGroup?: string;
  resourceType?: string;
  tenancyName?: string;
  compartmentName?: string;
  resourceId?: string;
}

export interface BarChartItem {
  name: string;
  current: number;
  previous: number;
  deltaPercent: number;
}

export interface DashboardUiData {
  kpi: {
    totalCost: number;
    growthPercentage: number;
    overBudget: number;
    growthColor: "red" | "green";
  };
  dailySeries: ChartSeriesPoint[];
  topResources: RankingItem[];
  topGroups: RankingItem[];
  barChartData: BarChartItem[];
}