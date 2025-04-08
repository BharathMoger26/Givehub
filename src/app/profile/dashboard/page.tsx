// app/profile/dashboard/page.tsx (or .js if JS)
import DashboardCard from "@/components/dashboard-card";
import PageTitle from "@/components/page-title";
import { connectDB } from "@/db/config";
import React from "react";
import CampaignModel from "@/models/campaign-model";
import DonationModel from "@/models/donation-model";
import DonationsTable from "@/components/donations-table";
import { getCurrentUserFromMongoDB } from "@/actions/users";
import mongoose from "mongoose";

// ✅ Tell Next.js this page is dynamic and not to prerender
export const dynamic = "force-dynamic";

connectDB();

async function DashboardPage() {
  const mongoUser = await getCurrentUserFromMongoDB();

  // ✅ Prevent rendering if user is not found
  if (!mongoUser?.data?._id) {
    return (
      <div className="text-red-500 text-center mt-10">User not found.</div>
    );
  }

  const userId = new mongoose.Types.ObjectId(mongoUser.data._id);

  let [donationsCount, amountRaised] = await Promise.all([
    DonationModel.countDocuments({
      user: mongoUser.data._id,
    }),
    DonationModel.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
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
    <div>
      <PageTitle title="Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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

      <div className="mt-10">
        <h1 className="text-2xl font-semibold">Recent Donations</h1>
        <DonationsTable
          donations={JSON.parse(JSON.stringify(recentDonations))}
          pagination={true}
          fromAdmin={false}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
