import { removeProductFromCart } from "@/actions/remove-cart-product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUseCartQueryKey } from "../queries/use-card";

export const REMOVE_PRODUCT_FROM_CART_MUTATION_KEY = (cartItemId: string) =>
  ["remove-product-from-cart", cartItemId] as const;

export const useRemoveProductFromCart = (cartItemId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: REMOVE_PRODUCT_FROM_CART_MUTATION_KEY(cartItemId),
    mutationFn: async () => removeProductFromCart({ cartItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
