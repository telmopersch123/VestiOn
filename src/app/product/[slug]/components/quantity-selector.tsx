"use client";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

const QuantitySelector = () => {
  const [quantity, setQuantity] = useState(1);

  const handleMais = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleMenos = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="space-x-4">
      <h3 className="font-medium">Quantidade</h3>
      <div className="flex w-[100px] flex-row items-center justify-between rounded-lg border">
        <Button size="icon" variant="outline" onClick={handleMenos}>
          <MinusIcon />
        </Button>
        <p>{quantity}</p>
        <Button size="icon" variant="outline" onClick={handleMais}>
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
