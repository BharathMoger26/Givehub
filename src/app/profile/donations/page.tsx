// app/profile/donations/page.tsx

import React from "react";
import PageTitle from "@/components/page-title";
import { connectDB } from "@/db/config";
import DonationModel from "@/models/donation-model";
import { getCurrentUserFromMongoDB } from "@/actions/users";
import DonationsTable from "@/components/donations-table";

// ✅ Force dynamic rendering
export const dynamic = "force-dynamic";

connectDB();

async function DonationsPage() {
  const mongouser = await getCurrentUserFromMongoDB();

  if (!mongouser?.data?._id) {
    return (
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-6 max-w-screen-2xl mx-auto">
        <PageTitle title="Donations" />
        <p className="text-center text-red-500 text-base sm:text-lg mt-4">
          User not found or not logged in.
        </p>
      </div>
    );
  }

  const donations = await DonationModel.find({ user: mongouser.data._id })
    .populate("campaign")
    .populate("user")
    .sort({ createdAt: -1 });

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-6 max-w-screen-2xl mx-auto w-full">
      {/* Page Title */}
      <PageTitle title="Donations" />

      {/* Table Section */}
      <div className="mt-8 w-full overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
          Your Recent Donations
        </h2>
        <div className="min-w-[320px]">
          <DonationsTable
            donations={JSON.parse(JSON.stringify(donations))}
            fromAdmin={false}
          />
        </div>
      </div>
    </div>
  );
}

export default DonationsPage;
