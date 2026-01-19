import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  data: any[];
  dataKey?: string;
  nameKey?: string;
  colors?: string[];
  customTooltip?: any;
  height?: string | number;
}

const DEFAULT_COLORS = ["#8979FF", "#FF928A", "#3CC3DF", "#FFAE4C", "#537FF1"];

export default function DonutChart({
  data,
  dataKey = "value",
  nameKey = "name",
  colors = DEFAULT_COLORS,
  customTooltip,
  height = "100%",
}: Props) {
  const sortedData = [...data].sort((a, b) => b[dataKey] - a[dataKey]);

  const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={sortedData}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          innerRadius="50%"
          outerRadius="80%"
          paddingAngle={2}
        >
          {sortedData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              stroke="none"
            />
          ))}
        </Pie>

        {customTooltip ? (
          <Tooltip content={customTooltip} />
        ) : (
          <Tooltip formatter={(value: number) => brl.format(Number(value))} />
        )}

        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => (
            <span className="text-xs text-gray-600 font-medium ml-1">
              {value.length > 15 ? value.slice(0, 15) + "..." : value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
