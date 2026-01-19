import axios from 'axios';
import type { 
  ApiKpiResponse, 
  ApiDailyBudgetResponse, 
  ApiTopAsset, 
  ApiTopResourceGroup,   
  ApiSubscriptionComparison,
  DashboardApiParams,
  DashboardUiData,
  ChartSeriesPoint,
  RankingItem,
  BarChartItem
} from './types/dashboard';

const api = axios.create({
  baseURL: 'http://localhost:3333/azure' 
});

export const fetchDashboardData = async (params: DashboardApiParams): Promise<DashboardUiData> => {
  const { startDate, endDate, referenceMonth } = params;

  try {
    const [kpiRes, dailyRes, assetsRes, rgRes, subCompRes] = await Promise.all([
      // 1. KPI
      api.get<ApiKpiResponse>('/kpi_view'),
      
      // 2. Daily Chart
      api.get<ApiDailyBudgetResponse[]>('/daily_budget', {
        params: {
          viewMode: 'consolidated',
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString()
        }
      }),

      // 3. Top Assets (Antiga most_offensive_resources)
      api.get<ApiTopAsset[]>('/most_offensive_resources', {
        params: { 
          referenceMonth, 
          scope: 'GLOBAL' // Traz os maiores vilões da empresa toda
        }
      }),

      // 4. Top Resource Groups (NOVA ROTA)
      api.get<ApiTopResourceGroup[]>('/top_resource_groups', {
        params: { 
          referenceMonth, 
          scope: 'GLOBAL' 
        }
      }),

      // 5. Comparação Mensal
      api.get<ApiSubscriptionComparison[]>('/subscription_comparison', {
        params: { referenceMonth }
      })
    ]);

    return adaptToUi(
      kpiRes.data, 
      dailyRes.data, 
      assetsRes.data, 
      rgRes.data,
      subCompRes.data
    );

  } catch (error) {
    console.error('❌ Erro na API:', error);
    throw error;
  }
};

function adaptToUi(
  kpi: ApiKpiResponse,
  daily: ApiDailyBudgetResponse[],
  topAssets: ApiTopAsset[],           // <--- Dados novos
  topRgs: ApiTopResourceGroup[],      // <--- Dados novos
  subComparison: ApiSubscriptionComparison[]
): DashboardUiData {

  // 1. KPI
  const totalCost = Number(kpi.total_mes_atual || 0);
  const growth = Number(kpi.variacao_percentual || 0);

  // 2. Daily Series
  const dailySeries: ChartSeriesPoint[] = daily.map(item => ({
    day: new Date(item.data_uso).getDate() + 1,
    fullDate: item.data_uso,
    cost: Number(item.gasto_real_dia_total || 0),
    budget: Number(item.budget_diario_total || 0)
  })).sort((a, b) => a.day - b.day);

  const totalOverBudget = dailySeries.reduce((acc, curr) => 
     acc + Math.max(0, curr.cost - curr.budget), 0);

  // 3. Top Assets (Mapeamento Rico)
  const formatAssets = (list: ApiTopAsset[]): RankingItem[] => {
    return list.slice(0, 5).map(item => ({
      name: item.resource_name,       // Nome da VM/Banco
      value: Number(item.valor_total),
      subscriptionName: item.subscription_name,
      resourceGroup: item.resource_group, // Extra pra tooltip
      resourceType: item.resource_type    // Extra pra tooltip
    }));
  };

  // 4. Top Resource Groups (Mapeamento Simples)
  const formatRgs = (list: ApiTopResourceGroup[]): RankingItem[] => {
    return list.slice(0, 5).map(item => ({
      name: item.resource_group,      // Nome do RG
      value: Number(item.valor_total),
      subscriptionName: item.subscription_name
    }));
  };

  // 5. Bar Chart Comparison
  const barChartData: BarChartItem[] = subComparison.map(item => ({
      name: item.subscription_name,
      current: Number(item.current_month_cost),
      previous: Number(item.previous_month_cost),
      deltaPercent: Number(item.delta_percent)
  }));

  return {
    kpi: {
      totalCost,
      growthPercentage: growth,
      overBudget: totalOverBudget,
      growthColor: kpi.kpi_color?.toLowerCase() as "red" | "green" || "green"
    },
    dailySeries,
    topResources: formatAssets(topAssets),
    topGroups: formatRgs(topRgs),
    barChartData
  };
}