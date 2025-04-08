"use client";
import { getStripeClientSecrete } from "@/actions/payments";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button, Input, Modal, Progress } from "antd";
const { TextArea } = Input;

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
  const [showAllDonationsModal = false, setShowAllDonationsModal] =
    React.useState<boolean>(false);
  const [showPaymentModel = false, setShowPaymentModel] =
    React.useState<boolean>(false);
  const [loading = false, setLoading] = React.useState<boolean>(false);
  const [clientSecret = "", setClientSecret] = React.useState<string>("");
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
      <div className="p-2 rounded-sm bg-gray-100 flex flex-col">
        <span className="text-gray-600 text-sm font-semibold">
          ${donation.amount} by {donation.user?.userName || "Anonymous"}
        </span>
        <span className="text-gray-500 text-sm">{donation.message}</span>
      </div>
    );
  };

  const getRecentDonations = () => {
    if (donations?.length === 0)
      return (
        <span className="text-gray-600 text-xs">
          No donation yet. Be the first to donate to this campaign
        </span>
      );
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
    <div className="border border-solid rounded border-gray-300 p-5">
      <span className="text-l text-primary font-semibold">
        ${campaign.collectedAmount} raised of ${campaign.targetAmount}
      </span>
      <Progress percent={collectedPercentage} />

      {campaign.showDonarsInCampaign && (
        <>
          <span className="text-semibold text-gray-600 text-sm">
            Recent Donations
          </span>

          <div className="flex flex-col gap-5 mt-5 mb-5">
            {getRecentDonations()}
          </div>
          {donations?.length > 0 && (
            <span
              className="text-primary text-sm font-semibold cursor-pointer underline"
              onClick={() => {
                setShowAllDonationsModal(true);
                getAllDonations();
              }}
            >
              view all{" "}
            </span>
          )}
        </>
      )}
      <hr className="my-10" />

      <div className="flex flex-col gap-5 mt-3">
        <Input
          placeholder="amount"
          type="number"
          onChange={(e) => setAmount(Number(e.target.value))}
          value={amount}
        />
        <TextArea
          placeholder="message"
          rows={4}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
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

      {showPaymentModel && clientSecret && (
        <Modal
          open={showPaymentModel}
          onCancel={() => {
            setShowPaymentModel(false);
            setClientSecret("");
          }}
          width={600}
          footer={null}
          title="Complete your donation payment"
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

      {showAllDonationsModal && (
        <Modal
          open={showAllDonationsModal}
          onCancel={() => {
            setShowAllDonationsModal(false);
          }}
          width={600}
          footer={null}
          title="All Donations for this campaign"
        >
          <div className="flex flex-col gap-5 my-5">
            {allDonations.map((donation) => donationList(donation))}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default DonationCard;
