"use client";
import { Loader2, ShoppingBasketIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatCentsToBRL } from "@/helpers/money";
import { useCart } from "@/hooks/queries/use-card";

import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import CartItem from "./cart-item";
const Cart = () => {
  const { data: cart } = useCart();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleContinue = () => {
    startTransition(() => router.push("/cart/identification"));
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="mr-4 cursor-pointer">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col">
        <SheetHeader>
          <SheetTitle className="mb-4 text-lg font-medium">Sacola</SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-col px-5 pb-5">
          <div className="h-full max-h-full flex-col overflow-hidden">
            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="flex h-full flex-col gap-12">
                {cart?.items && cart?.items?.length > 0 ? (
                  cart.items.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      productName={item.productVariant.product.name}
                      productVariantId={item.productVariant.id}
                      productVariantName={item.productVariant.name}
                      productVariantImageUrl={item.productVariant.imageUrl}
                      ProductVariantTotalPriceInCents={
                        item.productVariant.priceInCents
                      }
                      quantity={item.quantity}
                    />
                  ))
                ) : (
                  <div className="text-muted-foreground absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center font-semibold">
                    Sua sacola está vazia
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          {(cart?.items?.length ?? 0) > 0 && (
            <div className="flex flex-col gap-4">
              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Total</p>
                <p className="text-sm font-semibold">
                  {formatCentsToBRL(cart?.totalPriceInCents ?? 0)}
                </p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Entrega</p>
                <p className="text-sm font-semibold text-green-600">Grátis</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Total</p>
                <p className="text-sm font-semibold">
                  {formatCentsToBRL(cart?.totalPriceInCents ?? 0)}
                </p>
              </div>

              <Button
                onClick={handleContinue}
                disabled={isPending}
                className="mt-5 w-full cursor-pointer rounded-full"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Continuar compra
                  </>
                ) : (
                  "Continuar compra"
                )}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
