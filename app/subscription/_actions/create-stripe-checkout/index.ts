"use server";

import { auth } from "@clerk/nextjs/server";
import { getStripe } from "@/app/_lib/stripe";

export const createStripeCheckout = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  if (!process.env.STRIPE_PREMIUM_PLAN_PRICE_ID) {
    throw new Error("Stripe premium plan price ID not found");
  }
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error("App URL not configured");
  }
  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
    subscription_data: {
      metadata: {
        clerk_user_id: userId,
      },
    },
    line_items: [
      {
        price: process.env.STRIPE_PREMIUM_PLAN_PRICE_ID,
        quantity: 1,
      },
    ],
  });
  return { sessionId: session.id };
};
