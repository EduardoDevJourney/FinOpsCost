import Card from "../../../components/Card/Card";
import DonutChart from "../../../components/Chart/DonutChart";
import type { RankingItem } from "../../../services/types/dashboard";

interface Props {
  items: RankingItem[];
}

const CUSTOM_COLORS = ["#7C3AED", "#2563EB", "#059669", "#D97706", "#DC2626"];

export default function HighestCostResourceGroups({ items }: Props) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 2,
    }).format(value);

  const ResourceGroupTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as RankingItem;

      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg z-50">
          <p className="font-bold text-gray-800 mb-1">{data.name}</p>

          <div className="text-purple-600 font-semibold mb-2">
            {formatCurrency(data.value)}
          </div>

          {data.subscriptionName && (
            <div className="pt-2 border-t border-gray-100 text-xs text-gray-500">
              <span className="font-medium">Subscrição:</span>{" "}
              {data.subscriptionName}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title="Top 5 Grupos de Recursos"
      value=""
      info="Identifica os Grupos de Recursos (Resource Groups) que mais consomem orçamento no total."
    >
      <div className="h-64 w-full">
        {!items || items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Sem dados
          </div>
        ) : (
          <DonutChart
            data={items}
            colors={CUSTOM_COLORS}
            customTooltip={<ResourceGroupTooltip />}
          />
        )}
      </div>
    </Card>
  );
}
