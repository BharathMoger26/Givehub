"use client";

import { getStripeClientSecrete } from "@/actions/payments";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button, Input, Modal, Progress, message as antdMessage } from "antd";
const { TextArea } = Input;

import React from "react";
import PaymentModal from "./payment-modal";
import { getDonationsByCampaignId } from "@/actions/donations";
import { CampaignType, DonationType } from "@/interfaces";

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
        className="p-3 rounded-lg bg-gray-100 flex flex-col gap-1"
      >
        <span className="text-gray-800 text-sm sm:text-base font-semibold">
          ${donation.amount} by {donation.user?.userName || "Anonymous"}
        </span>
        <span className="text-gray-600 text-xs sm:text-sm break-words">
          {donation.message}
        </span>
      </div>
    );
  };

  const getRecentDonations = () => {
    if (donations.length === 0) {
      return (
        <span className="text-gray-600 text-sm sm:text-base">
          No donations yet. Be the first to contribute!
        </span>
      );
    }
    return donations.map((donation) => donationList(donation));
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
    <div className="w-full max-w-full bg-white border border-gray-300 rounded-2xl shadow-md p-4 sm:p-6 md:p-8 flex flex-col gap-6">
      {/* Campaign Stats */}
      <div className="flex flex-col gap-2">
        <div className="text-base sm:text-lg md:text-xl font-semibold text-primary">
          ${campaign.collectedAmount} raised of ${campaign.targetAmount}
        </div>
        <Progress percent={collectedPercentage} />
      </div>

      {/* Recent Donations */}
      {campaign.showDonarsInCampaign && (
        <div className="flex flex-col gap-3">
          <span className="font-medium text-gray-800 text-sm sm:text-base">
            Recent Donations
          </span>

          <div className="flex flex-col gap-3">{getRecentDonations()}</div>

          {donations.length > 0 && (
            <button
              className="text-primary text-sm font-medium underline self-start"
              onClick={() => {
                setShowAllDonationsModal(true);
                getAllDonations();
              }}
            >
              View all
            </button>
          )}
        </div>
      )}

      <hr className="border-gray-300" />

      {/* Donation Form */}
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Enter amount"
          type="number"
          onChange={(e) => setAmount(Number(e.target.value))}
          value={amount}
          className="text-sm sm:text-base"
        />
        <TextArea
          placeholder="Enter a message (optional)"
          rows={3}
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
        >
          Donate
        </Button>
      </div>

      {/* Stripe Payment Modal */}
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
