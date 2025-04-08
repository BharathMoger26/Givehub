'use server';

import { connectDB } from '@/db/config';
import { getCurrentUserFromMongoDB } from './users';
import CampaignModel from '@/models/campaign-model';
import DonationModel from '@/models/donation-model';
import { revalidatePath } from 'next/cache';

connectDB();

export const addNewDonation = async (reqBody: any) => {
  try {
    const mongoUser = await getCurrentUserFromMongoDB();
    reqBody.user = mongoUser?.data?._id;
    const newDonation = new DonationModel(reqBody);
    await newDonation.save();

    // Update collected amount in campaign
    const campaign = (await CampaignModel.findById(reqBody.campaign)) as any;
    campaign.collectedAmount += reqBody.amount;
    await campaign.save();

    // ✅ Revalidate pages to reflect updated campaign data
    revalidatePath(`/campaign/${campaign._id}`);
    revalidatePath(`/profile/donations`);
    revalidatePath(`/admin/donations`);
    revalidatePath(`/`); // 👈 If CampaignCard is used on the homepage
    revalidatePath(`/explore`); // 👈 Or wherever you're listing campaigns

    return {
      success: true,
      message: 'Donation added successfully',
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const getDonationsByCampaignId = async (campaignid: string) => {
  try {
    const donations = await DonationModel.find({
      campaign: campaignid,
    }).populate('user');
    return {
      success: true,
      data: JSON.parse(JSON.stringify(donations)),
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
