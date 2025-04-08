import DashboardCard from "@/components/dashboard-card";
import PageTitle from "@/components/page-title";
import { connectDB } from "@/db/config";
import React from "react";
import CampaignModel from "@/models/campaign-model";
import DonationModel from "@/models/donation-model";
import CampaignsTable from "../campaigns/_components/campaigns-table";
import DonationsTable from "@/components/donations-table";

connectDB();

async function DashboardPage() {
  let [campaignsCount, donationsCount, amountRaised] = await Promise.all([
    CampaignModel.countDocuments({}),
    DonationModel.countDocuments({}),
    DonationModel.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  amountRaised = amountRaised[0]?.totalAmount || 0;

  const [recentCampaigns, recentDonations] = await Promise.all([
    CampaignModel.find({}).sort({ createdAt: -1 }).limit(5),
    DonationModel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user")
      .populate("campaign"),
  ]);

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 max-w-7xl mx-auto">
      <PageTitle title="Dashboard" />

      {/* Dashboard cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        <DashboardCard
          cardTitle="Campaigns"
          description="Total number of campaigns including active and inactive"
          value={campaignsCount.toString()}
          onClickPath="/admin/campaigns"
        />
        <DashboardCard
          cardTitle="Donations"
          description="Total number of Donations done by the users"
          value={donationsCount.toString()}
          onClickPath="/admin/donations"
        />
        <DashboardCard
          cardTitle="Amount Raised"
          description="Total amount raised by all campaigns including active and inactive"
          value={`$${amountRaised}`}
        />
      </div>

      {/* Recent Campaigns */}
      <div className="mt-10 bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl shadow-md overflow-x-auto">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
          Recent Campaigns
        </h1>
        <CampaignsTable
          campaigns={JSON.parse(JSON.stringify(recentCampaigns))}
          pagination={false}
        />
      </div>

      {/* Recent Donations */}
      <div className="mt-10 bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl shadow-md overflow-x-auto">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
          Recent Donations
        </h1>
        <DonationsTable
          donations={JSON.parse(JSON.stringify(recentDonations))}
          pagination={false}
          fromAdmin
        />
      </div>
    </div>
  );
}

export default DashboardPage;
