import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Card from "../../../components/Card/Card";
import type { BarChartItem } from "../../../services/types/dashboard";

interface Props {
  data: BarChartItem[];
}

export default function CostBarChart({ data }: Props) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as BarChartItem;
      const isPositive = data.deltaPercent > 0;
      const isEconomy = data.deltaPercent < 0;

      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg z-50">
          <p className="font-bold text-gray-700 mb-2">{label}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
            <span>Anterior: {formatCurrency(data.previous)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-600 font-medium mt-1">
            <div className="w-3 h-3 bg-purple-600 rounded-sm"></div>
            <span>Atual: {formatCurrency(data.current)}</span>
          </div>
          <div
            className={`mt-3 pt-2 border-t text-sm font-bold flex items-center gap-1
            ${isPositive ? "text-red-500" : ""} 
            ${isEconomy ? "text-green-600" : ""}
            ${data.deltaPercent === 0 ? "text-gray-500" : ""}
          `}
          >
            {isPositive && "🔺 Aumento de"}
            {isEconomy && "📉 Economia de"}
            {data.deltaPercent === 0 && "Inalterado"}
            {Math.abs(data.deltaPercent).toFixed(1)}%
          </div>
        </div>
      );
    }
    return null;
  };
  const itemWidth = 120;
  const minContainerWidth = "100%";
  const dynamicWidth = Math.max(data.length * itemWidth, 600);

  return (
    <Card
      title="Comparativo Mensal por Assinatura"
      info="Compara o custo do mês atual versus o mês anterior."
      value=""
    >
      {/* 1. Container com Scroll Horizontal */}
      <div className="w-full h-80 overflow-x-auto overflow-y-hidden mt-4 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {!data || data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            Nenhum dado disponível.
          </div>
        ) : (
          /* 2. Div interna com largura dinâmica */
          <div
            style={{
              width: dynamicWidth,
              height: "100%",
              minWidth: minContainerWidth,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                // barGap define a distância entre a barra cinza e a roxa
                barGap={2}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                  interval={0} // Força mostrar todos os rótulos
                  // Quebra o texto se for muito longo
                  tickFormatter={(val) =>
                    val.length > 20 ? val.slice(0, 20) + "..." : val
                  }
                />

                <YAxis
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  tickFormatter={(val) => `R$ ${val / 1000}k`}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#F3F4F6" }}
                />

                <Legend wrapperStyle={{ paddingTop: "10px" }} />

                <Bar
                  dataKey="previous"
                  name="Mês Anterior"
                  fill="#9CA3AF"
                  radius={[4, 4, 0, 0]}
                  barSize={20} // Barra mais fina para caber melhor
                />

                <Bar
                  dataKey="current"
                  name="Mês Atual"
                  fill="#7C3AED"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}
