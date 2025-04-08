import PageTitle from "@/components/page-title";
import React from "react";
import CampaignForm from "../_components/campaign-form";

function NewCampaignPage() {
  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 max-w-5xl mx-auto">
      <PageTitle title="New Campaign" />
      <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl shadow-md">
        <CampaignForm />
      </div>
    </div>
  );
}

export default NewCampaignPage;
