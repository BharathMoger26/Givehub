// app/api/donations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/config";
import { currentUser } from "@clerk/nextjs/server";
import CampaignModel from "@/models/campaign-model";
import DonationModel from "@/models/donation-model";
import UserModel from "@/models/user-model";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const loggedInUser = await currentUser();

    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mongoUser = await UserModel.findOne({
      clerkUserId: loggedInUser.id,
    });

    if (!mongoUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const donation = new DonationModel({
      amount: body.amount,
      paymentId: body.paymentId,
      campaign: body.campaign,
      user: mongoUser._id,
      message: body.message,
    });

    await donation.save();

    const campaign = await CampaignModel.findById(body.campaign);
    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    campaign.collectedAmount += body.amount;
    await campaign.save();

    return NextResponse.json({ success: true, message: "Donation saved." });
  } catch (error: any) {
    console.error("Donation error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
