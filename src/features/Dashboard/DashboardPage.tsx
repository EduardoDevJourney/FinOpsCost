import { useFilters } from "../../contexts/FilterContext";
import DashboardPageAzure from "./azure/DashboardPageAzure";
import DashboardPageOracle from "./oracle/DashboardPageOracle";

export default function DashboardPage() {
  const { cloudProvider } = useFilters();

  // O Grande Switch
  switch (cloudProvider) {
    case "OCI":
      return <DashboardPageOracle />;

    case "AWS":
      return (
        <div className="flex items-center justify-center h-96 text-gray-500">
          🚧 AWS Dashboard em construção...
        </div>
      );

    case "Azure":
    default:
      return <DashboardPageAzure />;
  }
}
