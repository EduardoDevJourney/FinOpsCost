import { useEffect, useState } from "react";
import { useFilters } from "../../../contexts/FilterContext";
import { fetchDashboardData } from "../../../services/azure-dashboard"; // Serviço Azure
import type { DashboardUiData } from "../../../services/types/dashboard";

// Componentes Azure & Shared
import TotalCostCard from "../shared/TotalCostCard";
import OverBudgetCard from "../shared/OverBudgetCard";
import HighestCostResources from "./HighestCostResources";
import HighestCostResourceGroups from "./HighestCostResourceGroups";
import CostBarChart from "./CostBarChart";
import CostLineChart from "./CostLineChart";

export default function DashboardPageAzure() {
  const { dateRange, timeFilter } = useFilters();
  const [data, setData] = useState<DashboardUiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // --- DATA FIXA PARA DEV (Novembro 2025) ---
        // Quando for pra produção, troque para usar dateRange?.startDate
        const referenceMonth = "2025-11";

        // Calculando Start/End dates baseadas no mês de referência para o Gráfico de Linha funcionar
        const [yearStr, monthStr] = referenceMonth.split("-");
        const year = parseInt(yearStr);
        const month = parseInt(monthStr);
        const fixedStartDate = new Date(year, month - 1, 1);
        const fixedEndDate = new Date(year, month, 0);
        // ------------------------------------------

        const params = {
          startDate: fixedStartDate,
          endDate: fixedEndDate,
          referenceMonth: referenceMonth,
        };

        console.log("🟦 Carregando Azure Dashboard...");
        const result = await fetchDashboardData(params);
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados do Azure.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dateRange, timeFilter]);

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error} />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TotalCostCard
          value={data.kpi.totalCost}
          percentageGrowth={data.kpi.growthPercentage}
          growthColor={data.kpi.growthColor}
        />

        <HighestCostResources items={data.topResources} />
        <HighestCostResourceGroups items={data.topGroups} />

        <OverBudgetCard
          value={data.kpi.overBudget}
          percentageGrowth={0}
          provider="Azure"
        />
      </div>

      <div className="w-full">
        <CostLineChart series={data.dailySeries} />
      </div>

      <div className="w-full">
        <CostBarChart data={data.barChartData} />
      </div>
    </div>
  );
}

const LoadingState = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
  </div>
);

const ErrorState = ({ message }: { message: string | null }) => (
  <div className="text-center text-red-500 mt-10 p-4 bg-red-50 rounded">
    <p>{message || "Dados indisponíveis."}</p>
  </div>
);
