import { addProductToCart } from "@/actions/add-cart-product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUseCartQueryKey } from "../queries/use-card";

export const INCREASE_PRODUCT_FROM_CART_MUTATION_KEY = (cartItemId: string) =>
  ["increase-product-from-cart", cartItemId] as const;

export const useIncreaseProductFromCart = (productVariantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: INCREASE_PRODUCT_FROM_CART_MUTATION_KEY(productVariantId),
    mutationFn: async () => addProductToCart({ productVariantId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
