"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBasketIcon } from "lucide-react";
import { Button } from "../ui/button";

import getCart from "@/actions/get-cart";
import Image from "next/image";
const Cart = () => {
  const { data: cart, isPending: cartIsLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      return getCart();
    },
  });
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="mr-4">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="mb-4 text-lg font-medium">Carrinho</SheetTitle>
          <div>
            {cartIsLoading && <p>Carregando...</p>}
            {cart?.items.map((item) => (
              <div key={item.id} className="mb-4 flex items-center">
                <Image
                  src={item.productVariant.imageUrl}
                  alt={item.productVariant.name}
                  width={100}
                  height={100}
                  className="rounded-xl"
                />
                <div className="ml-4">
                  <h3 className="font-semibold">{item.productVariant.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {item.productVariant.product.name}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Quantidade: {item.quantity}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Preço: R$ {item.productVariant.priceInCents.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
