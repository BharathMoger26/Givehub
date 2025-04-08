import React from 'react';
import PageTitle from '@/components/page-title';
import { connectDB } from '@/db/config';
import DonationModel from '@/models/donation-model';
import { getCurrentUserFromMongoDB } from '@/actions/users';
import DonationsTable from '@/components/donations-table';

connectDB();

async function DonationsPage() {
  const mongouser = await getCurrentUserFromMongoDB();

  // Handle undefined user
  if (!mongouser?.data?._id) {
    return (
      <div>
        <PageTitle title="Donations" />
        <p className="text-center text-red-500 mt-4">
          User not found or not logged in.
        </p>
      </div>
    );
  }

  const donations = await DonationModel.find({ user: mongouser.data._id })
    .populate('campaign')
    .populate('user')
    .sort({ createdAt: -1 });

  return (
    <div>
      <PageTitle title="Donations" />
      <DonationsTable
        donations={JSON.parse(JSON.stringify(donations))}
        fromAdmin={false}
      />
    </div>
  );
}

export default DonationsPage;
