import React from "react";
import { HiInformationCircle } from "react-icons/hi";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";

interface KpiCardProps {
  title: string;
  value: number;
  info?: string;
  growth: number;
  growthColor?: "red" | "green";
  growthLabel: string;
  icon: React.ReactNode;
}

export default function KpiCard({
  title,
  value,
  info,
  growth,
  growthColor,
  growthLabel,
  icon,
}: KpiCardProps) {
  const formattedValue = value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedGrowth = `${growth.toFixed(1).replace(".", ",")}%`;

  return (
    <div
      className="
      bg-white rounded-2xl shadow p-4 sm:p-6 md:p-8
      flex flex-col justify-between h-full
    "
    >
      <div className="flex items-center justify-between">
        <h2 className="font-roboto text-base md:text-lg font-medium text-gray-500">
          {title}
        </h2>
        {info && (
          <button title={info} className="text-gray-400 hover:text-gray-600">
            <HiInformationCircle className="w-5 h-5 text-purple-700" />
          </button>
        )}
      </div>

      <div className="mt-4 md:mt-6 flex items-center justify-between">
        <span className="block font-roboto font-bold text-2xl md:text-3xl text-gray-800">
          R$ {formattedValue}
        </span>
        <div className="text-purple-600 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
          {icon}
        </div>
      </div>

      <div className="mt-4 md:mt-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span
            className={`font-roboto text-sm md:text-base font-medium ${
              growthColor === "red" ? "text-red-500" : "text-green-500"
            } flex items-center`}
          >
            {growthColor === "red" ? (
              <HiTrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <HiTrendingDown className="w-4 h-4 mr-1" />
            )}
            {formattedGrowth}
          </span>
          <span className="font-roboto text-xs md:text-sm text-gray-400 mt-1">
            {growthLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
