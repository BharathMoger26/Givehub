"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface DashboardCardProps {
  cardTitle: string;
  description: string;
  value: string;
  onClickPath?: string;
}

function DashboardCard({
  cardTitle,
  description,
  value,
  onClickPath,
}: DashboardCardProps) {
  const router = useRouter();

  return (
    <div
      className="flex flex-col justify-between gap-2 sm:gap-3 p-4 sm:p-5 border border-gray-200 rounded-lg bg-white hover:border-gray-400 hover:shadow-md transition-all duration-200 cursor-pointer w-full"
      onClick={() => {
        if (onClickPath) router.push(onClickPath);
      }}
    >
      <span className="text-base sm:text-lg font-semibold text-primary">
        {cardTitle}
      </span>

      <span className="text-xs sm:text-sm text-gray-500">{description}</span>

      <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-700">
        {value}
      </span>
    </div>
  );
}

export default DashboardCard;
