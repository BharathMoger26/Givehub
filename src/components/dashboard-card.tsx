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
      className="w-full max-w-full md:max-w-sm lg:max-w-md xl:max-w-lg bg-white rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col justify-between space-y-3 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => {
        if (onClickPath) router.push(onClickPath);
      }}
    >
      {/* Card Title */}
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary truncate">
        {cardTitle}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-sm md:text-base text-gray-500 leading-snug line-clamp-2">
        {description}
      </p>

      {/* Value */}
      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700">
        {value}
      </span>
    </div>
  );
}

export default DashboardCard;
