import KpiCard from "../../../components/Card/KpiCard";
import { HiPresentationChartLine } from "react-icons/hi";

interface Props {
  value: number;
  percentageGrowth: number;
  provider: string;
}

export default function OverBudgetCard({ value, percentageGrowth }: Props) {
  return (
    <KpiCard
      title="Spending Above Budget"
      value={value}
      info="Shows how much the current spending has exceeded the defined budget for the month. Positive values indicate cost overrun."
      growth={percentageGrowth}
      growthLabel="Percentage Growth"
      icon={<HiPresentationChartLine className="w-full h-full" />}
    />
  );
}
