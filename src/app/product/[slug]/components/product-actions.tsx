"use client";

import { Button } from "@/components/ui/button";
import AddToCardButton from "./add-to-cart";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

interface ProductActionsProps {
  productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleMais = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleMenos = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };
  return (
    <>
      <div className="px-5">
        <div className="space-x-4">
          <h3 className="font-medium">Quantidade</h3>
          <div className="flex w-[100px] flex-row items-center justify-between rounded-lg border">
            <Button
              className="cursor-pointer"
              size="icon"
              variant="outline"
              onClick={handleMenos}
            >
              <MinusIcon />
            </Button>
            <p>{quantity}</p>
            <Button
              className="cursor-pointer"
              size="icon"
              variant="outline"
              onClick={handleMais}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4 px-5">
        <AddToCardButton
          productVariantId={productVariantId}
          quantity={quantity}
        />
        <Button size="lg" className="cursor-pointer rounded-full">
          Comprar agora
        </Button>
      </div>
    </>
  );
};

export default ProductActions;
