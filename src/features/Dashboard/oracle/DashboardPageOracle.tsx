import { useEffect, useState } from "react";
import { useFilters } from "../../../contexts/FilterContext";
import { fetchOracleDashboardData } from "../../../services/oracle-dashboard"; // Serviço Oracle
import type { DashboardUiData } from "../../../services/types/dashboard";

// Componentes Oracle & Shared
import TotalCostCard from "../shared/TotalCostCard";
import OverBudgetCard from "../shared/OverBudgetCard";
import OracleTopAssets from "./OracleTopAssets";
import OracleTopCompartments from "./OracleTopCompartments";
import OracleCostComparison from "./OracleCostComparison";

export default function DashboardPageOracle() {
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
        const referenceMonth = "2025-11";

        const params = {
          startDate: undefined,
          endDate: undefined,
          referenceMonth: referenceMonth,
        };

        console.log("Fg Carregando OCI Dashboard...");
        const result = await fetchOracleDashboardData(params);
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados da Oracle Cloud.");
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TotalCostCard
          value={data.kpi.totalCost}
          percentageGrowth={data.kpi.growthPercentage}
          growthColor={data.kpi.growthColor}
        />

        <OracleTopAssets items={data.topResources} />
        <OracleTopCompartments items={data.topGroups} />

        <OverBudgetCard
          value={data.kpi.overBudget}
          provider="OCI"
          percentageGrowth={0}
        />
      </div>

      <div className="w-full">
        <OracleCostComparison data={data.barChartData} />
      </div>
    </div>
  );
}

const LoadingState = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
  </div>
);

const ErrorState = ({ message }: { message: string | null }) => (
  <div className="text-center text-red-500 mt-10 p-4 bg-red-50 rounded">
    <p>{message || "Dados indisponíveis."}</p>
  </div>
);
