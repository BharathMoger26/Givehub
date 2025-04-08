"use client";
import { getStripeClientSecrete } from "@/actions/payments";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button, Input, Modal, Progress } from "antd";
const { TextArea } = Input;
import { CampaignType, DonationType } from "@/interfaces";

import React from "react";
import PaymentModal from "./payment-modal";
import { getDonationsByCampaignId } from "@/actions/donations";
import { message as antdMessage } from "antd";

interface DonationCardProps {
  campaign: CampaignType;
  donations?: DonationType[];
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function DonationCard({ campaign, donations = [] }: DonationCardProps) {
  const [allDonations, setAllDonations] = React.useState<DonationType[]>([]);
  const [showAllDonationsModal, setShowAllDonationsModal] =
    React.useState<boolean>(false);
  const [showPaymentModel, setShowPaymentModel] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [clientSecret, setClientSecret] = React.useState<string>("");
  const [amount, setAmount] = React.useState<number>();
  const [message, setMessage] = React.useState("");

  const collectedPercentage = Math.round(
    (campaign.collectedAmount / campaign.targetAmount) * 100
  );

  const getClientSecret = async () => {
    try {
      setLoading(true);
      const response = await getStripeClientSecrete({ amount: amount! });
      if (response.error) throw new Error(response.error);
      setClientSecret(response.clientSecret);
      setShowPaymentModel(true);
    } catch (error) {
      console.error("Error getting client secret:", error);
    } finally {
      setLoading(false);
    }
  };

  const donationList = (donation: DonationType) => {
    return (
      <div
        key={donation._id}
        className="p-2 rounded-md bg-gray-100 flex flex-col"
      >
        <span className="text-gray-700 text-sm font-semibold">
          ${donation.amount} by {donation.user?.userName || "Anonymous"}
        </span>
        <span className="text-gray-500 text-sm break-words">
          {donation.message}
        </span>
      </div>
    );
  };

  const getRecentDonations = () => {
    if (donations?.length === 0) {
      return (
        <span className="text-gray-600 text-xs">
          No donation yet. Be the first to donate to this campaign.
        </span>
      );
    }
    return donations?.map((donation) => donationList(donation));
  };

  const getAllDonations = async () => {
    try {
      const response: any = await getDonationsByCampaignId(campaign._id);
      if (response.error) throw new Error(response.error);
      setAllDonations(response.data);
    } catch (error: any) {
      antdMessage.error(error.message);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 sm:p-6 bg-white shadow-sm w-full">
      <div className="text-sm sm:text-base font-semibold text-primary mb-2">
        ${campaign.collectedAmount} raised of ${campaign.targetAmount}
      </div>

      <Progress percent={collectedPercentage} className="mb-4" />

      {campaign.showDonarsInCampaign && (
        <>
          <span className="font-medium text-gray-700 text-sm sm:text-base">
            Recent Donations
          </span>

          <div className="flex flex-col gap-3 mt-4 mb-4">
            {getRecentDonations()}
          </div>

          {donations?.length > 0 && (
            <span
              className="text-primary text-sm font-medium underline cursor-pointer"
              onClick={() => {
                setShowAllDonationsModal(true);
                getAllDonations();
              }}
            >
              View all
            </span>
          )}
        </>
      )}

      <hr className="my-6 border-gray-300" />

      <div className="flex flex-col gap-4 mt-4">
        <Input
          placeholder="Enter amount"
          type="number"
          onChange={(e) => setAmount(Number(e.target.value))}
          value={amount}
          className="text-sm sm:text-base"
        />
        <TextArea
          placeholder="Enter a message (optional)"
          rows={4}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className="text-sm sm:text-base"
        />

        <Button
          type="primary"
          block
          disabled={!amount}
          onClick={getClientSecret}
          loading={loading}
          className="mt-1"
        >
          Donate
        </Button>
      </div>

      {/* Payment Modal */}
      {showPaymentModel && clientSecret && (
        <Modal
          open={showPaymentModel}
          onCancel={() => {
            setShowPaymentModel(false);
            setClientSecret("");
          }}
          width={600}
          footer={null}
          title="Complete your donation"
        >
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentModal
              messageText={message}
              campaign={campaign}
              amount={amount || 0}
            />
          </Elements>
        </Modal>
      )}

      {/* All Donations Modal */}
      {showAllDonationsModal && (
        <Modal
          open={showAllDonationsModal}
          onCancel={() => setShowAllDonationsModal(false)}
          width={600}
          footer={null}
          title="All Donations"
        >
          <div className="flex flex-col gap-4 my-4">
            {allDonations.map((donation) => donationList(donation))}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default DonationCard;
