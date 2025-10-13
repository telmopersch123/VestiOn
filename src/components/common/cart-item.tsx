import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { formatCentsToBRL } from "@/helpers/money";
import { useDecreaseProductFromCart } from "@/hooks/mutations/use-decrease-product-from-cart";
import { useIncreaseProductFromCart } from "@/hooks/mutations/use-increase-product-from-cart";
import { useRemoveProductFromCart } from "@/hooks/mutations/use-remove-product-from-cart";

import { Button } from "../ui/button";

interface CartItemProps {
  id: string;
  productName: string;
  productVariantId: string;
  productVariantName: string;
  productVariantImageUrl: string;
  ProductVariantTotalPriceInCents: number;
  quantity: number;
}
const CartItem = ({
  id,
  productName,
  productVariantId,
  productVariantName,
  productVariantImageUrl,
  ProductVariantTotalPriceInCents,
  quantity,
}: CartItemProps) => {
  const removeProductCartMutation = useRemoveProductFromCart(id);
  const decreaseProductCartMutation = useDecreaseProductFromCart(id);
  const increaseProductCartMutation =
    useIncreaseProductFromCart(productVariantId);
  const handleIncreaseClick = () => {
    increaseProductCartMutation.mutate(undefined, {});
  };
  const handleDecreaseClick = () => {
    decreaseProductCartMutation.mutate(undefined, {});
  };
  const handleDeleteClick = () => {
    removeProductCartMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Produto removido do carrinho.");
      },
      onError: () => {
        toast.error("Erro ao remover produto do carrinho.");
      },
    });
  };
  return (
    <div className="m-0 flex w-full flex-col items-start justify-between gap-4 rounded-2xl p-2 shadow-sm md:flex-row md:items-center">
      <div className="flex w-full items-start gap-4 md:items-center">
        <Image
          src={productVariantImageUrl}
          alt={productVariantName}
          width={100}
          height={100}
          className="flex-shrink-0 rounded-xl object-cover"
        />
        <div className="flex flex-1 flex-col gap-1">
          <p className="truncate text-sm font-semibold">{productName}</p>
          <p className="text-muted-foreground truncate text-sm font-medium">
            {productVariantName}
          </p>
          <div className="mt-1 flex w-full max-w-[120px] flex-row items-center justify-between rounded-lg border p-1">
            <Button
              className="h-6 w-6 p-0"
              variant="ghost"
              onClick={handleDecreaseClick}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            <p className="w-6 text-center">{quantity}</p>
            <Button
              className="h-6 w-6 p-0"
              variant="ghost"
              onClick={handleIncreaseClick}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-2 flex w-full flex-row items-center justify-between gap-2 md:mt-0 md:w-auto md:flex-col md:items-end">
        <Button
          className="cursor-pointer rounded-lg bg-red-500/90 px-3 py-2 font-medium text-white transition-colors hover:bg-red-600"
          variant="outline"
          size="icon"
          onClick={handleDeleteClick}
        >
          <Trash2Icon className="h-4 w-4 text-white" />
        </Button>
        <p className="mt-0 text-sm font-bold text-black/80 md:mt-1">
          {formatCentsToBRL(ProductVariantTotalPriceInCents)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
