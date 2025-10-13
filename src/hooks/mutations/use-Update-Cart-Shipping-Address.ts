import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCartShippingAddress } from "@/actions/update-cart-shipping-address";
import { UpdateCartShippingAddressSchema } from "@/actions/update-cart-shipping-address/schema";

import { getUseCartQueryKey } from "../queries/use-card";

export const getUpdateCartShippingAddressKey = () =>
  ["update-cart-shipping-address"] as const;

export const useUpdateCartShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUpdateCartShippingAddressKey(),
    mutationFn: async (data: UpdateCartShippingAddressSchema) => {
      return await updateCartShippingAddress(data);
    },
    onSuccess: () => {
      // Invalida queries relacionadas ao carrinho, se houver
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
