// src/components/Navbar/DatePicker.tsx
import React, { useState, useEffect, useRef } from "react";
import { HiCalendar } from "react-icons/hi";
import type { DateRange } from "../../contexts/FilterContext";

export interface DatePickerProps {
  dateRange?: DateRange | null;
  onDateRangeChange?: (range: DateRange | null) => void;
}

export default function DatePicker({
  dateRange,
  onDateRangeChange,
}: DatePickerProps) {
  // hoje e 90 dias atrás
  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];
  const dt90 = new Date(today);
  dt90.setDate(dt90.getDate() - 90);
  const minDate = dt90.toISOString().split("T")[0];

  // estados para start e end dates
  const [startValue, setStartValue] = useState(
    dateRange?.startDate ? dateRange.startDate.toISOString().split("T")[0] : ""
  );
  const [endValue, setEndValue] = useState(
    dateRange?.endDate ? dateRange.endDate.toISOString().split("T")[0] : ""
  );
  const [showPicker, setShowPicker] = useState(false);

  // refs
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // sincroniza dateRange externo
  useEffect(() => {
    if (dateRange) {
      setStartValue(dateRange.startDate.toISOString().split("T")[0]);
      setEndValue(dateRange.endDate.toISOString().split("T")[0]);
    }
  }, [dateRange]);

  // fecha o picker quando clica fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // quando muda a data de início
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStartValue(newStart);

    if (newStart && endValue) {
      const startDate = new Date(newStart);
      const endDate = new Date(endValue);
      onDateRangeChange?.({ startDate, endDate });
    }
  };

  // quando muda a data de fim
  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    setEndValue(newEnd);

    if (startValue && newEnd) {
      const startDate = new Date(startValue);
      const endDate = new Date(newEnd);
      onDateRangeChange?.({ startDate, endDate });
    }
  };

  // formata o range para exibição
  const formatDateRange = () => {
    if (!dateRange) {
      return "Select date range";
    }

    const start = dateRange.startDate;
    const end = dateRange.endDate;

    const formatDate = (date: Date) => {
      return `${date.getDate()} ${date.toLocaleString("en-US", {
        month: "short",
      })} ${date.getFullYear()}`;
    };

    if (start.toDateString() === end.toDateString()) {
      return formatDate(start);
    }

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <div className="relative inline-block w-80" ref={containerRef}>
      {/* Display do range */}
      <div
        className="flex items-center space-x-2 bg-white cursor-pointer border border-gray-300 rounded px-3 py-1.5"
        onClick={() => setShowPicker(!showPicker)}
      >
        <HiCalendar className="w-5 h-5 text-purple-600" />
        <span className="text-sm truncate">{formatDateRange()}</span>
      </div>

      {/* Popup com os date inputs */}
      {showPicker && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 w-80">
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Start Date
              </label>
              <input
                ref={startInputRef}
                type="date"
                value={startValue}
                onChange={handleStartChange}
                min={minDate}
                max={endValue || maxDate}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                End Date
              </label>
              <input
                ref={endInputRef}
                type="date"
                value={endValue}
                onChange={handleEndChange}
                min={startValue || minDate}
                max={maxDate}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <button
                onClick={() => {
                  setStartValue("");
                  setEndValue("");
                  onDateRangeChange?.(null);
                  setShowPicker(false);
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
              <button
                onClick={() => setShowPicker(false)}
                className="bg-purple-600 text-white px-4 py-1 rounded text-sm hover:bg-purple-700 transition"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
