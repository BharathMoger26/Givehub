import React from 'react';
import PageTitle from '@/components/page-title';
import { connectDB } from '@/db/config';
import DonationModel from '@/models/donation-model';
import DonationsTable from '@/components/donations-table';

connectDB();

async function DonationsPage() {
  const donations = await DonationModel.find({})
    .populate('campaign')
    .populate('user')
    .sort({ createdAt: -1 });

  return (
    <div>
      <PageTitle title="Donations" />
      <DonationsTable
        donations={JSON.parse(JSON.stringify(donations))}
        fromAdmin={true}
      />
    </div>
  );
}

export default DonationsPage;
