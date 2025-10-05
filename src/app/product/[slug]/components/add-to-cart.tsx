"use client";
import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const AddToCardButton = ({
  productVariantId,
  quantity = 1,
}: {
  productVariantId: string;
  quantity?: number;
}) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["addProductToCart", productVariantId, quantity],
    mutationFn: async () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  return (
    <Button
      disabled={isPending}
      size="lg"
      variant="outline"
      className="rounded-full"
      onClick={() => mutate()}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Adicionar ao carrinho
    </Button>
  );
};

export default AddToCardButton;
