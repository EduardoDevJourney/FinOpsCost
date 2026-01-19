import Card from "../../../components/Card/Card";
import DonutChart from "../../../components/Chart/DonutChart";
import type { RankingItem } from "../../../services/types/dashboard";

interface Props {
  items: RankingItem[];
}

const COLORS = ["#EA580C", "#DC2626", "#4B5563", "#D97706", "#9CA3AF"];

export default function OracleTopCompartments({ items }: Props) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 2,
    }).format(value);

  const CompartmentTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as RankingItem;

      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg z-50">
          <p className="font-bold text-gray-800 mb-1">{data.name}</p>

          <div className="text-orange-600 font-semibold mb-2">
            {formatCurrency(data.value)}
          </div>

          {data.tenancyName && (
            <div className="pt-2 border-t border-gray-100 text-xs text-gray-500">
              <span className="font-medium">Tenancy:</span> {data.tenancyName}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title="Top Compartments"
      value=""
      info="Agrupamento de custos por Compartment (Projetos/Departamentos)."
    >
      <div className="h-64 w-full">
        {!items || items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Sem dados
          </div>
        ) : (
          <DonutChart
            data={items}
            colors={COLORS}
            customTooltip={<CompartmentTooltip />}
          />
        )}
      </div>
    </Card>
  );
}
