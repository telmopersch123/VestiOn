"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
const FinishOrderButton = () => {
  const [successDialogIsOpen, setSuccessDialogIsOpen] = useState(true);
  const finishOrderMutation = useFinishOrder();
  return (
    <>
      <Button
        className="w-full cursor-pointer rounded-full"
        size="lg"
        onClick={() => finishOrderMutation.mutate()}
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
            >
              Voltar para a loja
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FinishOrderButton;
