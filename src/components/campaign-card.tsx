"use client";

import React from "react";
import { Progress } from "antd";
import { useRouter } from "next/navigation";
import { CampaignType } from "@/interfaces";

interface CampaignCardProps {
  campaign: CampaignType;
}

function CampaignCard({ campaign }: CampaignCardProps) {
  const router = useRouter();
  const mainImage = campaign.images[0];
  const collectedPercentage = Math.round(
    (campaign.collectedAmount / campaign.targetAmount) * 100
  );

  return (
    <div
      className="w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-sm mx-auto bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 transition-all cursor-pointer flex flex-col"
      onClick={() => router.push(`/campaign/${campaign._id}`)}
    >
      {/* Campaign Image */}
      <img
        src={mainImage}
        alt="Main Image"
        className="w-full h-44 sm:h-52 md:h-56 lg:h-60 xl:h-64 object-cover transition-transform duration-300 hover:scale-[1.01]"
      />

      {/* Campaign Content */}
      <div className="p-4 space-y-2 flex flex-col justify-between h-full">
        {/* Campaign Name */}
        <h1 className="text-base md:text-lg font-semibold text-primary line-clamp-2">
          {campaign.name}
        </h1>

        {/* Progress Bar */}
        <Progress
          percent={collectedPercentage}
          size="small"
          strokeColor="#164863"
          trailColor="#e5e7eb"
        />

        {/* Raised Amount Info */}
        <p className="text-sm md:text-base text-gray-700">
          <span className="font-semibold text-black">
            ${campaign.collectedAmount}
          </span>{" "}
          raised of{" "}
          <span className="font-semibold text-black">
            ${campaign.targetAmount}
          </span>
        </p>

        {/* Organizer Info */}
        <p className="text-xs md:text-sm text-gray-500 font-medium">
          Organized by {campaign.organizer}
        </p>
      </div>
    </div>
  );
}

export default CampaignCard;
