import React from "react";
import PageTitle from "@/components/page-title";
import { connectDB } from "@/db/config";
import DonationModel from "@/models/donation-model";
import DonationsTable from "@/components/donations-table";

connectDB();

async function DonationsPage() {
  const donations = await DonationModel.find({})
    .populate("campaign")
    .populate("user")
    .sort({ createdAt: -1 });

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 max-w-7xl mx-auto">
      <PageTitle title="Donations" />

      <div className="mt-6 bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl shadow-md overflow-x-auto">
        <DonationsTable
          donations={JSON.parse(JSON.stringify(donations))}
          fromAdmin={true}
        />
      </div>
    </div>
  );
}

export default DonationsPage;
