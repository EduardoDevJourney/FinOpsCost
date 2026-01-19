// src/components/FilterBar/FilterBar.tsx
import { useEffect } from "react";
import TabSelector from "../Navbar/TabSelector";
import DatePicker from "../Navbar/DatePicker";
import { useFilters } from "../../contexts/FilterContext";
import { getDateRange } from "../../utils/dateFilters";

export default function FilterBar() {
  const {
    timeFilter,
    setTimeFilter,
    cloudProvider,
    setCloudProvider,
    dateRange,
    setDateRange,
  } = useFilters();

  // Atualiza o dateRange automaticamente quando o timeFilter muda
  useEffect(() => {
    if (timeFilter !== "Custom Range") {
      const range = getDateRange(timeFilter);
      setDateRange(range);
    }
  }, [timeFilter, setDateRange]);

  // Handler para quando o usuário seleciona um range customizado
  const handleDateRangeChange = (range: any) => {
    setDateRange(range);
    // Quando o usuário seleciona manualmente um range, muda para "Custom Range"
    if (range && timeFilter !== "Custom Range") {
      setTimeFilter("Custom Range");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={cloudProvider}
            onChange={(e) => setCloudProvider(e.target.value)}
          >
            <option>Azure</option>
            <option>AWS</option>
            <option>OCI</option>
          </select>
        </div>

        {/* Abas, data e botão */}
        <div className="flex items-center space-x-6">
          <TabSelector
            options={["Today", "Last Week", "Month"]}
            activeTab={timeFilter === "Custom Range" ? "" : timeFilter}
            onChange={(tab) => setTimeFilter(tab as any)}
          />
          <DatePicker
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
          <button className="bg-purple-600 text-white px-4 py-1 rounded text-sm hover:bg-purple-700 transition">
            Latest Reports
          </button>
        </div>
      </div>
    </div>
  );
}
