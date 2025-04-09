import PageTitle from "@/components/page-title";
import React from "react";
import CampaignForm from "../_components/campaign-form";

function NewCampaignPage() {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 max-w-[95%] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
      <PageTitle title="New Campaign" />

      <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md">
        <CampaignForm />
      </div>
    </div>
  );
}

export default NewCampaignPage;
