// app/profile/dashboard/page.tsx

import DashboardCard from "@/components/dashboard-card";
import PageTitle from "@/components/page-title";
import { connectDB } from "@/db/config";
import React from "react";
import CampaignModel from "@/models/campaign-model";
import DonationModel from "@/models/donation-model";
import DonationsTable from "@/components/donations-table";
import { getCurrentUserFromMongoDB } from "@/actions/users";
import mongoose from "mongoose";

// ✅ Force dynamic rendering
export const dynamic = "force-dynamic";

connectDB();

async function DashboardPage() {
  const mongoUser = await getCurrentUserFromMongoDB();

  if (!mongoUser?.data?._id) {
    return (
      <div className="text-red-500 text-center mt-10 text-lg font-medium">
        User not found.
      </div>
    );
  }

  const userId = new mongoose.Types.ObjectId(mongoUser.data._id);

  let [donationsCount, amountRaised] = await Promise.all([
    DonationModel.countDocuments({ user: mongoUser.data._id }),
    DonationModel.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]),
  ]);

  amountRaised = amountRaised[0]?.totalAmount || 0;

  const recentDonations = await DonationModel.find({
    user: mongoUser.data._id,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("campaign");

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-6 max-w-screen-2xl mx-auto">
      {/* Page Title */}
      <PageTitle title="Dashboard" />

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
        <DashboardCard
          cardTitle="Donations"
          description="Total number of Donations for all campaigns"
          value={donationsCount.toString()}
          onClickPath="/admin/donations"
        />
        <DashboardCard
          cardTitle="Amount Donated"
          description="Total amount donated for all campaigns"
          value={`$${amountRaised}`}
        />
      </div>

      {/* Table Section */}
      <div className="mt-12 w-full overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
          Recent Donations
        </h2>
        <div className="min-w-[320px]">
          <DonationsTable
            donations={JSON.parse(JSON.stringify(recentDonations))}
            pagination={true}
            fromAdmin={false}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
