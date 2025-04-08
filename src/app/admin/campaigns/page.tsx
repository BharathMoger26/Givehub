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
    <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <PageTitle title="Campaigns" />
        <LinkButton
          title="Create Campaign"
          path="/admin/campaigns/new-campaign"
        />
      </div>
      <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl shadow-md">
        <CampaignsTable campaigns={JSON.parse(JSON.stringify(campaigns))} />
      </div>
    </div>
  );
}

export default CampaignsPage;
