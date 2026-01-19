import { HiChartBar } from "react-icons/hi";
import KpiCard from "../../../components/Card/KpiCard";

export default function TotalCostCard({
  value,
  percentageGrowth,
  growthColor,
}: {
  value: number;
  percentageGrowth: number;
  growthColor: "red" | "green";
}) {
  return (
    <KpiCard
      title="All Subscriptions Cost"
      value={value}
      info="Displays the total cost incurred across all Azure subscriptions for the current month. Includes all resource consumption charges."
      growth={percentageGrowth}
      growthColor={growthColor}
      growthLabel="Percentage Growth"
      icon={<HiChartBar className="w-full h-full" />}
    />
  );
}
