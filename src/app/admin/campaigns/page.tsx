import LinkButton from "@/components/link-button";
import PageTitle from "@/components/page-title";
import { connectDB } from "@/db/config";
import CampaignModel from "@/models/campaign-model";
import React from "react";
import CampaignsTable from "./_components/campaigns-table";
import { CampaignType } from "@/interfaces";

connectDB();

async function CampaignsPage() {
  const campaigns: CampaignType[] = (await CampaignModel.find().sort({
    createdAt: -1,
  })) as any;

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 max-w-[95%] md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <PageTitle title="Campaigns" />
        <LinkButton
          title="Create Campaign"
          path="/admin/campaigns/new-campaign"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md overflow-x-auto">
        <CampaignsTable campaigns={JSON.parse(JSON.stringify(campaigns))} />
      </div>
    </div>
  );
}

export default CampaignsPage;
