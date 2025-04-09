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
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 max-w-[95%] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
      <PageTitle title="Edit Campaign" />

      <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md">
        <CampaignForm
          isEditForm={true}
          initialData={JSON.parse(JSON.stringify(campaign))}
        />
      </div>
    </div>
  );
}

export default EditCampaignPage;
