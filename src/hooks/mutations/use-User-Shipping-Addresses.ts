import { getUserShippingAddresses } from "@/actions/get-user-shipping-addresses";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const getUserAddressesKey = () => ["user-shipping-addresses"] as const;

export function useUserShippingAddresses() {
  return useQuery({
    queryKey: getUserAddressesKey(),
    queryFn: async () => {
      return await getUserShippingAddresses();
    },
  });
}

export function useInvalidateUserAddresses() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: getUserAddressesKey() });
}
