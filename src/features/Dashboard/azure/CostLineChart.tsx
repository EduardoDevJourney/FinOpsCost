import Card from "../../../components/Card/Card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

interface Point {
  day: number;
  cost: number;
  budget: number;
}

interface Props {
  series: Point[];
}

export default function CostAreaChart({ series }: Props) {
  const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <Card
      title="Month Budget Tracking"
      value=""
      info="Custos diários (área vermelha) vs orçamento diário (área roxa). Onde o custo ultrapassa o orçamento, a área vermelha fica acima da roxa."
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={series}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <defs>
              {/* Gradientes suaves para cada área */}
              <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f47373" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#f47373" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6a5acd" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#6a5acd" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => brl.format(Number(value))}
            />
            <Tooltip
              labelFormatter={(d) => `Dia ${d}`}
              formatter={(v: number) => brl.format(Number(v))}
            />
            <Legend />

            {/* Orçamento (fica abaixo visualmente) */}
            <Area
              type="monotone"
              dataKey="budget"
              name="Budget"
              stroke="#6a5acd"
              fill="url(#budgetGradient)"
              fillOpacity={1}
              dot={false}
            />

            {/* Custo diário (fica por cima para evidenciar onde ultrapassa) */}
            <Area
              type="monotone"
              dataKey="cost"
              name="Cost"
              stroke="#f47373"
              fill="url(#costGradient)"
              fillOpacity={1}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
