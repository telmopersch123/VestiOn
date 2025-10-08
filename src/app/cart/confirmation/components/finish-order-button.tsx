"use client";
import { createCheckoutSessions } from "@/actions/create-checkout-session";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";

import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
export const FinishOrderButton = () => {
  const [successDialogIsOpen, setSuccessDialogIsOpen] = useState(false);
  const finishOrderMutation = useFinishOrder();

  const handleFinishOrder = async () => {
    try {
      const { orderId } = await finishOrderMutation.mutateAsync();
      if (!orderId) {
        throw new Error("Order ID is undefined");
      }
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe key is undefined");
      }
      const { id: sessionId } = await createCheckoutSessions({ orderId });

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      );
      if (!stripe) {
        throw new Error("Stripe is undefined");
      }
      await stripe.redirectToCheckout({ sessionId });
      setSuccessDialogIsOpen(true);
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
    }
  };

  return (
    <>
      <Button
        className="w-full cursor-pointer rounded-full"
        size="lg"
        type="button"
        onClick={handleFinishOrder}
        disabled={finishOrderMutation.isPending}
      >
        {finishOrderMutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Finalizar Compra
      </Button>
      <Dialog open={successDialogIsOpen} onOpenChange={setSuccessDialogIsOpen}>
        <DialogContent className="text-center">
          <Image
            src="/illustration.svg"
            alt="Success IMG"
            height={300}
            width={300}
            className="mx-auto"
          />

          <DialogTitle className="mt-4 text-2xl">
            Compra realizada com sucesso!
          </DialogTitle>
          <DialogDescription>
            Seu pedido foi efetuado com sucesso. Você pode acompanhar o status
            na seção de "Meus Pedidos".
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => setSuccessDialogIsOpen(false)}
              className="cursor-pointer rounded-full"
              size="lg"
            >
              Ver meus pedidos
            </Button>
            <Button
              onClick={() => setSuccessDialogIsOpen(false)}
              className="cursor-pointer rounded-full"
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/"> Voltar para a loja</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
