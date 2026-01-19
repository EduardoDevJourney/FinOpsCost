import Card from "../../../components/Card/Card";
import DonutChart from "../../../components/Chart/DonutChart";
import type { RankingItem } from "../../../services/types/dashboard";

interface Props {
  items: RankingItem[];
}

// Paleta Oracle (Tons de Vermelho/Laranja/Cinza) ou mantemos a padrão?
// Vou manter a padrão do sistema para consistência, mas você pode alterar.
const COLORS = ["#EA580C", "#DC2626", "#4B5563", "#D97706", "#9CA3AF"];

export default function OracleTopAssets({ items }: Props) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 2,
    }).format(value);

  // --- TOOLTIP OCI (Drill Down) ---
  const AssetTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as RankingItem;

      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg z-50 min-w-[250px]">
          {/* Nome do Recurso */}
          <p className="font-bold text-gray-800 mb-1 break-words">
            {data.name}
          </p>

          <div className="text-orange-600 font-semibold mb-3">
            {formatCurrency(data.value)}
          </div>

          {/* Metadados OCI */}
          <div className="flex flex-col gap-1 pt-2 border-t border-gray-100 text-xs text-gray-500">
            {data.resourceType && (
              <div className="flex justify-between">
                <span className="font-medium mr-2">Serviço:</span>
                <span className="truncate max-w-[150px]">
                  {data.resourceType}
                </span>
              </div>
            )}

            {data.compartmentName && (
              <div className="flex justify-between">
                <span className="font-medium mr-2">Compartment:</span>
                <span className="text-gray-700">{data.compartmentName}</span>
              </div>
            )}

            {data.tenancyName && (
              <div className="flex justify-between">
                <span className="font-medium mr-2">Tenancy:</span>
                <span>{data.tenancyName}</span>
              </div>
            )}

            {/* OCID (Importante na OCI) */}
            {data.resourceId && (
              <div className="mt-1 pt-1 border-t border-gray-50 text-[10px] text-gray-400 break-all">
                ID: {data.resourceId.slice(0, 15)}...{data.resourceId.slice(-5)}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title="Top 5 Assets (OCI)"
      value=""
      info="Os 5 recursos específicos que mais consumiram créditos na Oracle Cloud."
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
            customTooltip={<AssetTooltip />}
          />
        )}
      </div>
    </Card>
  );
}
