import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";

interface Serie {
  name: string;
  [key: string]: string | number;
}

interface VerticalBarChartProps {
  data: Serie[];
  keys: { dataKey: string; name: string; fill: string }[];
  height?: number | string;
}

export default function VerticalBarChart({
  data,
  keys,
  height = 300,
}: VerticalBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <XAxis type="number" tick={{ fontSize: 12 }} hide />{" "}
        {/* esconde eixo X */}
        <YAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          type="category"
          width={100}
        />
        <Tooltip />
        <Legend verticalAlign="top" align="center" iconSize={8} />
        {keys.map((k, index) => (
          <Bar
            key={k.dataKey}
            dataKey={k.dataKey}
            name={k.name}
            fill={k.fill}
            stackId="stack"
            barSize={50}
          >
            {index === keys.length - 1 && (
              <LabelList
                dataKey={(d: any) =>
                  keys.reduce(
                    (sum, key) => sum + (Number(d[key.dataKey]) || 0),
                    0
                  )
                }
                position="right"
                style={{ fontSize: 12, fill: "#000" }}
              />
            )}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
