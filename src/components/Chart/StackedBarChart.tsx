import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from "recharts";

export interface StackedBarSerie {
  name: string;
  [key: string]: string | number;
}

export interface StackedBarChartProps {
  data: StackedBarSerie[];
  series: { dataKey: string; name: string; fill: string }[];
  height?: number | string;
}

export default function StackedBarChart({
  data,
  series,
  height = 300,
}: StackedBarChartProps) {
  const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          angle={-20}
          textAnchor="end"
          height={1}
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => brl.format(Number(value))}
        />
        <Tooltip formatter={(value: number) => brl.format(Number(value))} />

        {series.map((s, index) => (
          <Bar
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.name}
            fill={s.fill}
            stackId="stack"
            barSize={50}
          >
            {index === series.length - 1 && (
              <LabelList
                dataKey={(d: any) =>
                  brl.format(
                    series.reduce(
                      (sum, key) => sum + (Number(d[key.dataKey]) || 0),
                      0
                    )
                  )
                }
                position="top"
                angle={0}
                style={{ fontSize: 12, fill: "#000" }}
              />
            )}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
