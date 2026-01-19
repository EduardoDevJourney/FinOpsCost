import axios from 'axios';
import type { 
  ApiOracleKpiResponse,
  ApiOracleTopAsset,
  ApiOracleTopCompartment,
  ApiOracleComparison,
  DashboardApiParams,
  DashboardUiData,
  RankingItem,
  BarChartItem
} from './types/dashboard';

const api = axios.create({
  baseURL: 'http://localhost:3333/oci' 
});

// Adapter para transformar dados da API Oracle em UI Data
function adaptOracleToUi(
  kpi: ApiOracleKpiResponse,
  topAssets: ApiOracleTopAsset[],
  topCompartments: ApiOracleTopCompartment[],
  comparison: ApiOracleComparison[]
): DashboardUiData {

  // 1. KPI
  const totalCost = Number(kpi.total_mes_atual || 0);
  const growth = Number(kpi.variacao_percentual || 0);

  // 2. Top Assets (Drill Down)
  const formatAssets = (list: ApiOracleTopAsset[]): RankingItem[] => {
    return list.slice(0, 5).map(item => ({
      name: item.resource_name || item.resource_id || 'Sem Nome',
      value: Number(item.valor_total),
      tenancyName: item.tenancy_name,
      compartmentName: item.compartment_name,
      resourceType: item.resource_type,
      resourceId: item.resource_id
    }));
  };

  // 3. Top Compartments (Resource Groups equivalent)
  const formatCompartments = (list: ApiOracleTopCompartment[]): RankingItem[] => {
    return list.slice(0, 5).map(item => ({
      name: item.compartment_name,
      value: Number(item.valor_total),
      tenancyName: item.tenancy_name
    }));
  };

  // 4. Bar Chart (Comparison)
  const formatComparison = (list: ApiOracleComparison[]): BarChartItem[] => {
    return list.map(item => ({
      name: item.compartment_name, // Agrupado por Compartment
      current: Number(item.current_month_cost),
      previous: Number(item.previous_month_cost),
      deltaPercent: Number(item.delta_percent)
    }));
  };

  return {
    kpi: {
      totalCost,
      growthPercentage: growth,
      overBudget: 0, // Oracle ainda não tem feature de Budget Diário implementada
      growthColor: kpi.kpi_color?.toLowerCase() as "red" | "green" || "green"
    },
    dailySeries: [], // Deixamos vazio por enquanto
    topResources: formatAssets(topAssets),
    topGroups: formatCompartments(topCompartments),
    barChartData: formatComparison(comparison) 
  };
}

export const fetchOracleDashboardData = async (params: DashboardApiParams): Promise<DashboardUiData> => {
  const { referenceMonth } = params;

  try {
    const [kpiRes, assetsRes, compartRes, compComparisonRes] = await Promise.all([
      // 1. KPI
      api.get<ApiOracleKpiResponse>('/kpi_view', {
        params: { referenceMonth }
      }),
      
      // 2. Top Assets
      api.get<ApiOracleTopAsset[]>('/top_assets', {
        params: { referenceMonth, scope: 'GLOBAL' }
      }),

      // 3. Top Compartments
      api.get<ApiOracleTopCompartment[]>('/top_compartments', {
        params: { referenceMonth, scope: 'GLOBAL' }
      }),

      // 4. Comparação (Compartment vs Compartment)
      api.get<ApiOracleComparison[]>('/compartment_comparison', {
        params: { referenceMonth }
      })
    ]);

    return adaptOracleToUi(
      kpiRes.data,
      assetsRes.data,
      compartRes.data,
      compComparisonRes.data
    );

  } catch (error) {
    console.error('❌ Erro na API Oracle:', error);
    throw error;
  }
};