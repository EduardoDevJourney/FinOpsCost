import Card from "../../../components/Card/Card";
import DonutChart from "../../../components/Chart/DonutChart";
import type { RankingItem } from "../../../services/types/dashboard";

interface Props {
  items: RankingItem[];
}

const CUSTOM_COLORS = ["#7C3AED", "#2563EB", "#059669", "#D97706", "#DC2626"];

export default function HighestCostResources({ items }: Props) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 2,
    }).format(value);

  const AssetTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as RankingItem;

      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg z-50 min-w-[200px]">
          <p className="font-bold text-gray-800 mb-1 break-words">
            {data.name}
          </p>

          <div className="text-purple-600 font-semibold mb-3">
            {formatCurrency(data.value)}
          </div>

          <div className="flex flex-col gap-1 pt-2 border-t border-gray-100 text-xs text-gray-500">
            {data.resourceType && (
              <div className="flex justify-between">
                <span className="font-medium mr-2">Tipo:</span>
                <span
                  className="truncate max-w-[120px]"
                  title={data.resourceType}
                >
                  {data.resourceType.split("/").pop()}
                </span>
              </div>
            )}

            {data.resourceGroup && (
              <div className="flex justify-between">
                <span className="font-medium mr-2">RG:</span>
                <span>{data.resourceGroup}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="font-medium mr-2">Sub:</span>
              <span>{data.subscriptionName}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title="Top 5 Recursos"
      value=""
      info="Mostra os 5 recursos específicos (Assets) que mais gastaram no período."
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
            customTooltip={<AssetTooltip />}
          />
        )}
      </div>
    </Card>
  );
}
