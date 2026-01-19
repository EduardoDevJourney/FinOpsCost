// src/contexts/FilterContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type TimeFilter = "Today" | "Last Week" | "Month" | "Custom Range";

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface FilterContextValue {
  timeFilter: TimeFilter;
  setTimeFilter: (filter: TimeFilter) => void;
  dateRange: DateRange | null;
  setDateRange: (range: DateRange | null) => void;
  cloudProvider: string;
  setCloudProvider: (provider: string) => void;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
}

export function FilterProvider({ children }: FilterProviderProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("Today");
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [cloudProvider, setCloudProvider] = useState("Azure");

  const value: FilterContextValue = {
    timeFilter,
    setTimeFilter,
    dateRange,
    setDateRange,
    cloudProvider,
    setCloudProvider,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}
