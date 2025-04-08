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
      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-gray-400 cursor-pointer bg-white w-full max-w-sm mx-auto"
      onClick={() => router.push(`/campaign/${campaign._id}`)}
    >
      <img
        src={mainImage}
        alt="Main Image"
        className="w-full h-48 object-cover sm:h-56 md:h-60 lg:h-64"
      />
      <div className="p-4 space-y-2">
        <h1 className="text-base font-semibold text-primary truncate">
          {campaign.name}
        </h1>

        <Progress percent={collectedPercentage} size="small" />

        <p className="text-sm text-gray-600">
          <span className="font-semibold">${campaign.collectedAmount}</span>{" "}
          raised of{" "}
          <span className="font-semibold">${campaign.targetAmount}</span>
        </p>

        <p className="text-xs text-gray-500 font-medium">
          Organized by {campaign.organizer}
        </p>
      </div>
    </div>
  );
}

export default CampaignCard;
