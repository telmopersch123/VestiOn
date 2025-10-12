"use client";
import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

const AddToCardButton = ({
  productVariantId,
  quantity = 1,
}: {
  productVariantId: string;
  quantity?: number;
}) => {
  const router = useRouter();
  const session = authClient.useSession().data;
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
  const handleClick = () => {
    if (!session?.user) {
      toast.error("Você precisa estar logado para comprar.");
      router.push("/authentication");
      return;
    }
    mutate();
  };
  return (
    <Button
      disabled={isPending}
      size="lg"
      variant="outline"
      className="cursor-pointer rounded-full"
      onClick={handleClick}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Adicionar na sacola
    </Button>
  );
};

export default AddToCardButton;
