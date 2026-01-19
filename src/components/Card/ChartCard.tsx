// src/components/Card/ChartCard.tsx
import React from "react";
import CardWrapper from "./CardWrapper";

interface ChartCardProps {
  title: string;
  info?: string;
  children: React.ReactNode;
}

export default function ChartCard({ title, info, children }: ChartCardProps) {
  return (
    <CardWrapper title={title} info={info}>
      <div className="mt-2 w-full">{children}</div>
    </CardWrapper>
  );
}
