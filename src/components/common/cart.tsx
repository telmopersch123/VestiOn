"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBasketIcon } from "lucide-react";
import { Button } from "../ui/button";

import { formatCentsToBRL } from "@/helpers/money";
import { useCart } from "@/hooks/queries/use-card";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import CartItem from "./cart-item";
const Cart = () => {
  const { data: cart } = useCart();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="mr-4 cursor-pointer">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col">
        <SheetHeader>
          <SheetTitle className="mb-4 text-lg font-medium">Carrinho</SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-col px-5 pb-5">
          <div className="h-full max-h-full flex-col overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex h-full flex-col gap-8">
                {cart?.items.map((item) => (
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
                ))}
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

              <Link href="/cart/identification" className="w-full">
                <Button className="mt-5 w-full cursor-pointer rounded-full">
                  Finalizar compra
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
