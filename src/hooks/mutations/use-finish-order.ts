import { finishOrder } from "@/actions/finish-order";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getUseCartQueryKey } from "../queries/use-card";

export const getFinishOrdersMutationKey = () => ["finish-orders"] as const;

export function useFinishOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getFinishOrdersMutationKey(),
    mutationFn: async () => {
      return await finishOrder();
    },
    onSuccess: () => {
      // Invalida queries relacionadas ao carrinho, se houver
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
}
