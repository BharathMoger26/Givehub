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
      <div className="p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto">
        <PageTitle title="Donations" />
        <p className="text-center text-red-500 mt-4">
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
    <div className="p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto w-full">
      <PageTitle title="Donations" />

      <div className="mt-6 w-full overflow-x-auto">
        <DonationsTable
          donations={JSON.parse(JSON.stringify(donations))}
          fromAdmin={false}
        />
      </div>
    </div>
  );
}

export default DonationsPage;
