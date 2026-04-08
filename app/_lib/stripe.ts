import Stripe from "stripe";

let _stripe: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (_stripe) return _stripe;
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia",
  });
  return _stripe;
};
