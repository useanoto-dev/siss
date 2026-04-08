"use client";

import { Button } from "@/app/_components/ui/button";
import { createStripeCheckout } from "../_actions/create-stripe-checkout";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

const AcquirePlanButton = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleAcquirePlanClick = async () => {
    setIsLoading(true);
    try {
      const { sessionId } = await createStripeCheckout();
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe publishable key not found");
      }
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      );
      if (!stripe) {
        throw new Error("Stripe not found");
      }
      await stripe.redirectToCheckout({ sessionId });
    } catch {
      toast.error("Erro ao processar compra. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  const hasPremiumPlan = user?.publicMetadata?.subscriptionPlan === "premium";
  if (hasPremiumPlan) {
    return (
      <Button className="w-full rounded-full font-bold" variant="link">
        <Link
          href={`${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL as string}?prefilled_email=${user?.emailAddresses?.[0]?.emailAddress ?? ""}`}
        >
          Gerenciar plano
        </Link>
      </Button>
    );
  }
  return (
    <Button
      className="w-full rounded-full font-bold"
      onClick={handleAcquirePlanClick}
      disabled={isLoading}
    >
      {isLoading && <Loader2Icon className="animate-spin" />}
      {isLoading ? "Processando..." : "Adquirir plano"}
    </Button>
  );
};

export default AcquirePlanButton;
