import { DecreaseCartProduct } from "@/actions/decrease-cart-product-quantity";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUseCartQueryKey } from "../queries/use-card";

export const DECREASE_PRODUCT_FROM_CART_MUTATION_KEY = (cartItemId: string) =>
  ["decrease-product-from-cart", cartItemId] as const;

export const useDecreaseProductFromCart = (cartItemId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: DECREASE_PRODUCT_FROM_CART_MUTATION_KEY(cartItemId),
    mutationFn: async () => DecreaseCartProduct({ cartItemId: cartItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
