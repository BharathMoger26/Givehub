"use client";

import React from "react";
import {
  AddressElement,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, message } from "antd";
import { useRouter } from "next/navigation";
import { CampaignType } from "@/interfaces";

interface PaymentModalProps {
  campaign: CampaignType;
  amount: number;
  messageText: string;
}

function PaymentModal({ campaign, amount, messageText }: PaymentModalProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);

      if (!stripe || !elements) return;

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "https://localhost:3000/profile/donations",
        },
        redirect: "if_required",
      });

      if (result.error) {
        message.error(result.error.message);
      } else {
        message.success("Payment Successful");

        const donationPayload = {
          campaign: campaign._id,
          amount,
          message: messageText,
          paymentId: result.paymentIntent?.id,
        };

        const response = await fetch("/api/donations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(donationPayload),
        });

        if (response.ok) {
          message.success("Donation Saved Successfully");
          router.push("/profile/donations");
        } else {
          const errorData = await response.json();
          message.error(errorData.error || "Failed to save donation.");
        }
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 flex flex-col gap-8 bg-white rounded-2xl shadow-md"
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary mb-2 text-center">
        Complete Your Payment
      </h2>

      <div className="w-full">
        <PaymentElement />
      </div>

      <div className="w-full">
        <AddressElement
          options={{
            allowedCountries: ["US", "IN"],
            mode: "shipping",
          }}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 w-full pt-2">
        <Button
          htmlType="button"
          className="w-full sm:w-auto"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="w-full sm:w-auto"
        >
          Pay
        </Button>
      </div>
    </form>
  );
}

export default PaymentModal;
