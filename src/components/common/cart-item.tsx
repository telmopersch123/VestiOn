import { formatCentsToBRL } from "@/helpers/money";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

interface CartItemProps {
  id: string;
  productName: string;
  productVariantName: string;
  productVariantImageUrl: string;
  ProductVariantTotalPriceInCents: number;
  quantity: number;
}
const CartItem = ({
  id,
  productName,
  productVariantName,
  productVariantImageUrl,
  ProductVariantTotalPriceInCents,
  quantity,
}: CartItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={productVariantImageUrl}
          alt={productVariantName}
          width={100}
          height={100}
          className="rounded-xl"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{productName}</p>
          <p className="text-muted-foreground text-sm font-medium">
            {productVariantName}
          </p>
          <div className="flex w-[100px] flex-row items-center justify-between rounded-lg border p-1">
            <Button className="h-4 w-4" variant="ghost" onClick={() => {}}>
              <MinusIcon />
            </Button>
            <p>{quantity}</p>
            <Button className="h-4 w-4" variant="ghost" onClick={() => {}}>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center gap-2">
        <Button
          className="rounded-lg bg-red-500/90 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600"
          variant="outline"
          size="icon"
        >
          <Trash2Icon className="text-white" />
        </Button>
        <p className="text-sm font-bold text-black/80">
          {formatCentsToBRL(ProductVariantTotalPriceInCents)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
