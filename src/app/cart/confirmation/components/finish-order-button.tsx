"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { createCheckoutSessions } from "@/actions/create-checkout-session";
import { Button } from "@/components/ui/button";
import { useFinishOrderMutate } from "@/hooks/mutations/use-finish-order";
import { useFinishOrderNowMutate } from "@/hooks/mutations/use-finish-order-now";

export type FinishOrderNowParams = {
  quantity: number | undefined;
  productVariantId: string | undefined;
};

export const FinishOrderButton = ({
  quantity,
  productVariantId,
}: FinishOrderNowParams) => {
  const [isLoading, setIsLoading] = useState(false);

  const finishOrderNowMutation = useFinishOrderNowMutate({
    productVariantId,
    quantity,
  });
  const finishOrderMutation = useFinishOrderMutate();

  const activeMutation =
    quantity && productVariantId ? finishOrderNowMutation : finishOrderMutation;

  const isPending = activeMutation.isPending || isLoading;

  const handleFinishOrder = async () => {
    try {
      setIsLoading(true);

      const { orderId } = await activeMutation.mutateAsync();
      if (!orderId) throw new Error("Order ID is undefined");

      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe key is undefined");
      }

      const { id: sessionId } = await createCheckoutSessions(
        { orderId },
        productVariantId ? false : true,
      );

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      );

      if (!stripe) throw new Error("Stripe is undefined");

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full cursor-pointer rounded-full"
      size="lg"
      type="button"
      onClick={handleFinishOrder}
      disabled={isPending}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Finalizar Compra
    </Button>
  );
};
