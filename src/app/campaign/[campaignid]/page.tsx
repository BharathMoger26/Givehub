import { connectDB } from "@/db/config";
import React from "react";
import CampaignModel from "@/models/campaign-model";
import LinkButton from "@/components/link-button";
import DonationCard from "@/components/donation-card";
import DonationModel from "@/models/donation-model";
import { CampaignType } from "@/interfaces";

connectDB();

interface SingleCampaignPageProps {
  params: {
    campaignid: string;
  };
}

async function SingleCampaignPage({ params }: SingleCampaignPageProps) {
  const campaign: CampaignType = (await CampaignModel.findById(
    params.campaignid
  )) as any;

  const recentFiveDonations = await DonationModel.find({
    campaign: params.campaignid,
  })
    .populate("user", "userName")
    .sort({ createdAt: -1 })
    .limit(5);

  const getProperty = (key: string, value: any) => (
    <div className="flex flex-col gap-1 text-sm sm:text-base">
      <span className="font-medium text-gray-700">{key}</span>
      <span className="text-gray-500 break-words">{value}</span>
    </div>
  );

  return (
    campaign && (
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-6 max-w-screen-2xl mx-auto w-full space-y-8">
        {/* Back Button */}
        <LinkButton title="Back to Campaigns" path="/" />

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          {campaign.name}
        </h1>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left: Campaign Info */}
          <div className="lg:col-span-3 space-y-8">
            {/* Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {campaign.images.map((image: string, index: number) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl shadow-md aspect-video"
                >
                  <img
                    src={image}
                    alt={`Campaign Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Campaign Meta Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {getProperty("Organizer", campaign.organizer)}
              {getProperty(
                "Start Date",
                new Date(campaign.startDate).toLocaleDateString()
              )}
              {getProperty(
                "End Date",
                new Date(campaign.endDate).toLocaleDateString()
              )}
              {getProperty("Target Amount", `$${campaign.targetAmount}`)}
              {getProperty("Collected Amount", `$${campaign.collectedAmount}`)}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                Description
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {campaign.description}
              </p>
            </div>
          </div>

          {/* Right: Donation Section */}
          <div className="lg:col-span-1 w-full">
            <DonationCard
              donations={JSON.parse(JSON.stringify(recentFiveDonations))}
              campaign={JSON.parse(JSON.stringify(campaign))}
            />
          </div>
        </div>
      </div>
    )
  );
}

export default SingleCampaignPage;
