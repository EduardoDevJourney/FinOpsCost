import React from "react";
import { HiInformationCircle } from "react-icons/hi";

interface CardProps {
  title: string;
  value: string | number;
  info?: string;
  children?: React.ReactNode;
}

export default function Card({ title, value, info, children }: CardProps) {
  return (
    <div className="relative bg-white rounded-2xl shadow p-6 flex flex-col">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-500">{title}</h2>
        {info && (
          <button title={info} className="text-gray-400 hover:text-gray-600">
            <HiInformationCircle className="w-5 h-5" color="#7640bd" />
          </button>
        )}
      </header>

      <div className="text-2xl font-bold text-gray-800 ">{value}</div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
