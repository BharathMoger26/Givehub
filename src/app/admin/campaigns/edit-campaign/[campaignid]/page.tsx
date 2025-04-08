import PageTitle from "@/components/page-title";
import React from "react";
import CampaignForm from "../../_components/campaign-form";
import { connectDB } from "@/db/config";
import CampaignModel from "@/models/campaign-model";

connectDB();

interface Props {
  params: {
    campaignid: string;
  };
}

async function EditCampaignPage({ params }: Props) {
  const campaign = await CampaignModel.findById(params.campaignid);

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 max-w-5xl mx-auto">
      <PageTitle title="Edit Campaign" />
      <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl shadow-md">
        <CampaignForm
          isEditForm={true}
          initialData={JSON.parse(JSON.stringify(campaign))}
        />
      </div>
    </div>
  );
}

export default EditCampaignPage;
