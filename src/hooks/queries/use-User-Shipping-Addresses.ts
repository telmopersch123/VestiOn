import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getUserShippingAddresses } from "@/actions/get-user-shipping-addresses";
import { shippingAddressTable } from "@/db/schema";

export const getUserAddressesKey = () => ["user-shipping-addresses"] as const;

export function useUserShippingAddresses(params?: {
  initialData?: (typeof shippingAddressTable.$inferSelect)[];
}) {
  return useQuery({
    queryKey: getUserAddressesKey(),
    queryFn: async () => {
      return await getUserShippingAddresses();
    },
    initialData: params?.initialData,
  });
}

export function useInvalidateUserAddresses() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: getUserAddressesKey() });
}
