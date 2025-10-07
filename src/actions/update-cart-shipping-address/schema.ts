// src/actions/cart/schema.ts
import { z } from "zod";

export const UpdateCartShippingAddressSchema = z.object({
  shippingAddressId: z.uuid("ID de endereço inválido"),
});

export type UpdateCartShippingAddressSchema = z.infer<
  typeof UpdateCartShippingAddressSchema
>;
