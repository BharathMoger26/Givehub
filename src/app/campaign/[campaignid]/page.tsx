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
    <div className="flex flex-col text-sm">
      <span className="font-semibold text-gray-800">{key}</span>
      <span className="text-gray-500 break-words">{value}</span>
    </div>
  );

  return (
    campaign && (
      <div className="p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto w-full space-y-6">
        <LinkButton title="Back to Campaigns" path="/" />

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700">
          {campaign.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Campaign Details Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Campaign Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {campaign.images.map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`Campaign Image ${index + 1}`}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-md shadow-md"
                />
              ))}
            </div>

            {/* Campaign Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

            {/* Campaign Description */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {campaign.description}
            </p>
          </div>

          {/* Donation Section */}
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
