import React from "react";
import { HiInformationCircle } from "react-icons/hi";

interface CardWrapperProps {
  title: string;
  info?: string;
  children: React.ReactNode;
}

export default function CardWrapper({
  title,
  info,
  children,
}: CardWrapperProps) {
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
      {children}
    </div>
  );
}
