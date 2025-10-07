import { createShippingAddress } from "@/actions/address-cart";
import { addressSchema } from "@/actions/address-cart/schema";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const getCreateShippingAddress = () =>
  ["create-shipping-address"] as const;

export function useCreateShippingAddress() {
  return useMutation({
    mutationKey: getCreateShippingAddress(),
    mutationFn: async (data: z.infer<typeof addressSchema>) => {
      return await createShippingAddress(data);
    },
  });
}
