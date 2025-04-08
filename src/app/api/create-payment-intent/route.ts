import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Use the correct enum for the API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any, // 👈 quick workaround (Stripe types might expect a literal)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount } = body;

    if (!amount || isNaN(amount)) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      payment_method_types: ["card"],
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Stripe Payment Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
