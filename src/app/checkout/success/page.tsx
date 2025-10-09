"use client";
import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
const Success = () => {
  return (
    <>
      <Header />
      <Dialog open={true} onOpenChange={() => {}}>
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
            <Button className="cursor-pointer rounded-full" asChild size="lg">
              <Link href="/my-orders"> Ver meus pedidos</Link>
            </Button>
            <Button
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

export default Success;
