import { useMutation, useQueryClient } from "@tanstack/react-query";

import useFinishOrderNow from "@/actions/finish-order-now";
import { FinishOrderNowParams } from "@/app/cart/confirmation/components/finish-order-button";
import { getUseCartQueryKey } from "../queries/use-card";

export const getFinishOrdersNowMutationKey = () =>
  ["finish-order-now"] as const;

export function useFinishOrderNowMutate({
  quantity,
  productVariantId,
}: FinishOrderNowParams) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getFinishOrdersNowMutationKey(),
    mutationFn: async () => {
      return await useFinishOrderNow({ quantity, productVariantId });
    },
    onSuccess: () => {
      // Invalida queries relacionadas ao carrinho, se houver
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
}
